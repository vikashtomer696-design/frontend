export function createLog(level, message, meta = {}) {
  return {
    level,
    message,
    meta,
    timestamp: new Date().toISOString()
  };
}
