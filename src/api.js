// src/api.js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod/v4';

import { generateFullData, SUPPORTED_TYPES } from './dataGenerator.js';
import { swaggerSpec } from './swagger.js';
import logger from './logger.js';
import { recordRequest, getMetrics } from './metrics.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const MAX_COUNT = parseInt(process.env.MAX_COUNT || '100', 10);

// ─── Core middleware ──────────────────────────────────────────────────────────

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID', 'X-Response-Time'],
}));
app.use(compression());
app.use(express.json({ limit: '1mb' }));

// ─── Request ID & response timing ────────────────────────────────────────────

app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || uuidv4();
  req.startAt = process.hrtime.bigint();
  res.setHeader('X-Request-ID', req.id);
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - req.startAt) / 1_000_000;
    res.setHeader('X-Response-Time', `${durationMs.toFixed(3)}ms`);
  });
  next();
});

// ─── HTTP request logging ─────────────────────────────────────────────────────

app.use(
  morgan('combined', {
    stream: { write: (msg) => logger.http(msg.trim()) },
    skip: (req) => req.path === '/health',
  })
);

// ─── Rate limiting ────────────────────────────────────────────────────────────

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT || '200', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests. Please slow down.',
  },
  keyGenerator: (req) => req.ip || 'unknown',
});

app.use('/api', limiter);

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const querySchema = z.object({
  count: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .pipe(z.number().int().min(1).max(MAX_COUNT)),
  seed: z
    .string()
    .optional()
    .transform((v) => (v !== undefined ? parseInt(v, 10) : undefined))
    .pipe(z.number().int().optional()),
  locale: z.string().max(10).optional(),
  fields: z
    .string()
    .optional()
    .transform((v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : undefined)),
});

const bulkItemSchema = z.object({
  type: z.enum(SUPPORTED_TYPES),
  count: z.number().int().min(1).max(MAX_COUNT).default(1),
  seed: z.number().int().optional(),
  locale: z.string().max(10).optional(),
  fields: z.array(z.string()).optional(),
});

const bulkSchema = z.object({
  requests: z.array(bulkItemSchema).min(1).max(10),
});

// ─── Helper: success envelope ─────────────────────────────────────────────────

function successResponse(res, req, data, meta = {}) {
  const durationMs = Number(process.hrtime.bigint() - req.startAt) / 1_000_000;
  res.setHeader('X-Response-Time', `${durationMs.toFixed(3)}ms`);
  return res.json({
    success: true,
    requestId: req.id,
    timestamp: new Date().toISOString(),
    meta,
    data,
  });
}

function errorResponse(res, req, status, code, message) {
  return res.status(status).json({
    success: false,
    requestId: req.id,
    timestamp: new Date().toISOString(),
    error: code,
    message,
  });
}

// ─── Health & metrics ─────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: process.env.npm_package_version || '2.0.0',
    uptime_ms: Math.round(process.uptime() * 1000),
    memory: process.memoryUsage(),
    node: process.version,
    timestamp: new Date().toISOString(),
    supportedTypes: SUPPORTED_TYPES,
  });
});

app.get('/metrics', (req, res) => {
  res.json(getMetrics());
});

// ─── Swagger docs ─────────────────────────────────────────────────────────────

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'backend-sim API docs',
  swaggerOptions: { persistAuthorization: true, displayRequestDuration: true },
}));

app.get('/openapi.json', (req, res) => res.json(swaggerSpec));

// ─── v1 routes ────────────────────────────────────────────────────────────────

const v1 = express.Router();

// GET /api/v1/:type
v1.get('/:type', (req, res) => {
  const { type } = req.params;

  if (!SUPPORTED_TYPES.includes(type)) {
    return errorResponse(res, req, 400, 'UNSUPPORTED_TYPE',
      `Unsupported type "${type}". Valid types: ${SUPPORTED_TYPES.join(', ')}`);
  }

  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    return errorResponse(res, req, 400, 'VALIDATION_ERROR',
      z.prettifyError(parsed.error));
  }

  const { count, seed, locale, fields } = parsed.data;

  try {
    const data = generateFullData(type, count, { seed, locale, fields });
    const durationMs = Number(process.hrtime.bigint() - req.startAt) / 1_000_000;
    recordRequest({ type, success: true, durationMs });

    return successResponse(res, req, data, {
      type,
      count: data.length,
      seed: seed ?? null,
      locale: locale || 'en',
      fields: fields || null,
    });
  } catch (err) {
    recordRequest({ type, success: false, durationMs: 0 });
    logger.error({ message: err.message, type, requestId: req.id });
    return errorResponse(res, req, 500, 'GENERATION_ERROR', err.message);
  }
});

// POST /api/v1/bulk
v1.post('/bulk', (req, res) => {
  const parsed = bulkSchema.safeParse(req.body);
  if (!parsed.success) {
    return errorResponse(res, req, 400, 'VALIDATION_ERROR',
      z.prettifyError(parsed.error));
  }

  const results = [];
  try {
    for (const item of parsed.data.requests) {
      const data = generateFullData(item.type, item.count, {
        seed: item.seed,
        locale: item.locale,
        fields: item.fields,
      });
      results.push({ type: item.type, count: data.length, data });
    }
  } catch (err) {
    logger.error({ message: err.message, requestId: req.id });
    return errorResponse(res, req, 500, 'GENERATION_ERROR', err.message);
  }

  const durationMs = Number(process.hrtime.bigint() - req.startAt) / 1_000_000;
  recordRequest({ type: 'bulk', success: true, durationMs });

  return successResponse(res, req, results, {
    totalRequests: results.length,
    totalRecords: results.reduce((s, r) => s + r.count, 0),
  });
});

app.use('/api/v1', v1);

// ─── Legacy route (backwards-compatible) ─────────────────────────────────────

app.get('/api/:type', (req, res) => {
  const { type } = req.params;
  const count = parseInt(req.query.count, 10) || 1;

  try {
    const data = generateFullData(type, count);
    recordRequest({ type, success: true, durationMs: 0 });
    res.status(200).json({ success: true, data });
  } catch (err) {
    recordRequest({ type, success: false, durationMs: 0 });
    res.status(400).json({ success: false, message: err.message });
  }
});

// ─── 404 & global error handler ───────────────────────────────────────────────

app.use((req, res) => {
  errorResponse(res, req, 404, 'NOT_FOUND',
    `Route ${req.method} ${req.path} not found. See /docs for the API reference.`);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  logger.error({ message: err.message, stack: err.stack, requestId: req.id });
  errorResponse(res, req, 500, 'INTERNAL_ERROR', 'An unexpected error occurred.');
});

// ─── Server factory ───────────────────────────────────────────────────────────

export function simApiServer() {
  const server = app.listen(PORT, () => {
    logger.info(`backend-sim API v2 running on http://localhost:${PORT}`);
    logger.info(`Swagger docs available at http://localhost:${PORT}/docs`);
    logger.info(`Health check at http://localhost:${PORT}/health`);
    logger.info(`Supported types: ${SUPPORTED_TYPES.join(', ')}`);
  });

  // Graceful shutdown
  const shutdown = (signal) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      logger.info('Server closed.');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return server;
}

export default app;
