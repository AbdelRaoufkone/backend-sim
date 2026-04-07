// src/backend-sim.d.ts

export type DataType =
  | 'person'
  | 'finance'
  | 'location'
  | 'date'
  | 'commerce'
  | 'internet'
  | 'vehicle'
  | 'network'
  | 'company'
  | 'banking';

export interface GenerateOptions {
  /** Seed for reproducible data generation */
  seed?: number;
  /** Faker locale, e.g. 'fr', 'de', 'ja', 'es' */
  locale?: string;
  /** Whitelist of field names to include in each record */
  fields?: string[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  requestId: string;
  timestamp: string;
  meta: {
    type: DataType;
    count: number;
    seed: number | null;
    locale: string;
    fields: string[] | null;
  };
  data: T[];
}

export interface BulkItem {
  type: DataType;
  count?: number;
  seed?: number;
  locale?: string;
  fields?: string[];
}

export interface BulkResult<T = unknown> {
  type: DataType;
  count: number;
  data: T[];
}

export interface HealthResponse {
  status: 'ok';
  version: string;
  uptime_ms: number;
  memory: NodeJS.MemoryUsage;
  node: string;
  timestamp: string;
  supportedTypes: DataType[];
}

export interface MetricsResponse {
  uptime_ms: number;
  uptime_human: string;
  requests: { total: number; success: number; error: number };
  by_type: Record<string, { total: number; success: number; error: number }>;
  response_time_ms: {
    avg: number;
    p50: number;
    p95: number;
    p99: number;
    min: number;
    max: number;
  };
  last_reset: string;
}

/**
 * Generate an array of fake records of the given type.
 *
 * @param type    Data type to generate
 * @param count   Number of records (default 1, max 1000)
 * @param options Optional seed, locale, and field filter
 */
export function generateFullData<T = Record<string, unknown>>(
  type: DataType,
  count?: number,
  options?: GenerateOptions
): T[];

/** Start the Express API server. Returns the http.Server instance. */
export function simApiServer(): import('http').Server;

/** All supported data types */
export const SUPPORTED_TYPES: DataType[];
