// src/metrics.js

const startTime = Date.now();

const state = {
  requests: { total: 0, success: 0, error: 0 },
  byType: {},
  responseTimes: [],
  lastReset: new Date().toISOString(),
};

export function recordRequest({ type, success, durationMs }) {
  state.requests.total++;
  if (success) {
    state.requests.success++;
  } else {
    state.requests.error++;
  }

  if (type) {
    if (!state.byType[type]) {
      state.byType[type] = { total: 0, success: 0, error: 0 };
    }
    state.byType[type].total++;
    if (success) state.byType[type].success++;
    else state.byType[type].error++;
  }

  if (durationMs != null) {
    state.responseTimes.push(durationMs);
    // Keep only the last 1000 samples to avoid unbounded memory growth
    if (state.responseTimes.length > 1000) {
      state.responseTimes.shift();
    }
  }
}

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

export function getMetrics() {
  const sorted = [...state.responseTimes].sort((a, b) => a - b);
  const avg =
    sorted.length > 0 ? sorted.reduce((s, v) => s + v, 0) / sorted.length : 0;

  return {
    uptime_ms: Date.now() - startTime,
    uptime_human: formatUptime(Date.now() - startTime),
    requests: { ...state.requests },
    by_type: { ...state.byType },
    response_time_ms: {
      avg: Math.round(avg * 100) / 100,
      p50: percentile(sorted, 50),
      p95: percentile(sorted, 95),
      p99: percentile(sorted, 99),
      min: sorted[0] ?? 0,
      max: sorted[sorted.length - 1] ?? 0,
    },
    last_reset: state.lastReset,
  };
}

function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h ${m % 60}m`;
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}
