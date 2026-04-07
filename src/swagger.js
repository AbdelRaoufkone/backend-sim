// src/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';

const SUPPORTED_TYPES = ['person', 'finance', 'location', 'date', 'commerce', 'internet', 'vehicle', 'network', 'company', 'banking'];

const definition = {
  openapi: '3.0.3',
  info: {
    title: 'backend-sim API',
    version: '2.0.0',
    description:
      'Ultra-fast realistic fake data generator API. Supports seeding, locales, field filtering, and bulk generation.',
    contact: {
      name: 'AbdelRaouf KONE',
      email: 'abdel.koner@gmail.com',
    },
    license: { name: 'MIT' },
  },
  servers: [
    { url: '/api/v1', description: 'v1 (stable)' },
    { url: '/api', description: 'Legacy (deprecated)' },
  ],
  tags: [
    { name: 'Data', description: 'Generate fake data' },
    { name: 'Bulk', description: 'Generate multiple types at once' },
    { name: 'System', description: 'Health & metrics' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        description: 'Returns service health and basic runtime info.',
        responses: {
          200: {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    version: { type: 'string', example: '2.0.0' },
                    uptime_ms: { type: 'number', example: 12345 },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/metrics': {
      get: {
        tags: ['System'],
        summary: 'Runtime metrics',
        description: 'Returns request counts, latency percentiles, and per-type breakdowns.',
        responses: {
          200: {
            description: 'Metrics payload',
            content: { 'application/json': { schema: { type: 'object' } } },
          },
        },
      },
    },
    '/api/v1/{type}': {
      get: {
        tags: ['Data'],
        summary: 'Generate fake records',
        parameters: [
          {
            name: 'type',
            in: 'path',
            required: true,
            schema: { type: 'string', enum: SUPPORTED_TYPES },
            description: 'Data type to generate',
          },
          {
            name: 'count',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 1 },
            description: 'Number of records (max 100)',
          },
          {
            name: 'seed',
            in: 'query',
            schema: { type: 'integer' },
            description: 'Seed for reproducible data',
          },
          {
            name: 'locale',
            in: 'query',
            schema: { type: 'string', example: 'fr' },
            description: 'Faker locale (e.g. en, fr, de, ja, es)',
          },
          {
            name: 'fields',
            in: 'query',
            schema: { type: 'string', example: 'firstName,email,phone' },
            description: 'Comma-separated list of fields to include (default: all)',
          },
        ],
        responses: {
          200: {
            description: 'Successfully generated data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    requestId: { type: 'string', format: 'uuid' },
                    timestamp: { type: 'string', format: 'date-time' },
                    meta: {
                      type: 'object',
                      properties: {
                        type: { type: 'string' },
                        count: { type: 'integer' },
                        seed: { type: 'integer', nullable: true },
                        locale: { type: 'string' },
                      },
                    },
                    data: { type: 'array', items: { type: 'object' } },
                  },
                },
              },
            },
          },
          400: { description: 'Validation error' },
          429: { description: 'Rate limit exceeded' },
          500: { description: 'Internal server error' },
        },
      },
    },
    '/api/v1/bulk': {
      post: {
        tags: ['Bulk'],
        summary: 'Generate multiple types in one request',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['requests'],
                properties: {
                  requests: {
                    type: 'array',
                    maxItems: 10,
                    items: {
                      type: 'object',
                      required: ['type'],
                      properties: {
                        type: { type: 'string', enum: SUPPORTED_TYPES },
                        count: { type: 'integer', minimum: 1, maximum: 100, default: 1 },
                        seed: { type: 'integer' },
                        locale: { type: 'string' },
                        fields: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Bulk data generated' },
          400: { description: 'Validation error' },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJsdoc({ definition, apis: [] });
