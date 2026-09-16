export async function withRetry(fn, { maxRetries = 2, delays = [1000, 3000] } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const status = err.status || err.statusCode;
      const retryable = status === 429 || status === 500 || status === 503 || err.code === 'ETIMEDOUT';
      if (!retryable || attempt === maxRetries) throw err;
      await new Promise((r) => setTimeout(r, delays[attempt] || delays[delays.length - 1]));
    }
  }
  throw lastError;
}
