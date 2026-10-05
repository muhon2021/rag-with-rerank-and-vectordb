import { URLSearchParams } from 'url';

const STRIPE_API_BASE = 'https://api.stripe.com/v1';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SK || '';

function assertStripeConfig() {
  if (!STRIPE_SECRET_KEY) {
    throw Object.assign(new Error('Stripe secret key not configured. Set STRIPE_SECRET_KEY in environment.'), { status: 500, code: 'STRIPE_CONFIG_MISSING' });
  }
}

function isZeroDecimalCurrency(currency) {
  if (!currency) return false;
  const zero = new Set([
    'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf',
  ]);
  return zero.has(String(currency).toLowerCase());
}

function toStripeAmount(amount, currency) {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    throw Object.assign(new Error('Invalid amount. Must be a positive number.'), { status: 400, code: 'INVALID_AMOUNT' });
  }
  const zero = isZeroDecimalCurrency(currency);
  return zero ? Math.round(amount) : Math.round(amount * 100);
}

async function stripeRequest(path, method, params) {
  assertStripeConfig();
  const url = `${STRIPE_API_BASE}${path}`;
  const headers = {
    Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const body = params ? new URLSearchParams(params).toString() : undefined;

  const res = await fetch(url, { method, headers, body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error?.message || data?.message || res.statusText || 'Stripe request failed';
    const code = data?.error?.type || 'STRIPE_ERROR';
    const status = res.status;
    const err = Object.assign(new Error(message), { code, status, raw: data });
    throw err;
  }
  return data;
}

export async function createPaymentIntent({ amount, currency = 'USD', description, method = 'wallet', savePaymentMethod = false, customerId }) {
  if (String(method).toLowerCase() === 'klarna') {
    throw Object.assign(new Error('Klarna is not allowed for treatment payments.'), { status: 400, code: 'METHOD_NOT_ALLOWED' });
  }
  const amt = toStripeAmount(amount, currency);
  const lower = String(currency).toLowerCase();
  const params = {
    amount: String(amt),
    currency: lower,
  };
  if (description) params.description = description;

  // Configure method types
  const m = String(method).toLowerCase();
  if (m === 'paypal') {
    // Explicitly use PayPal
    params['payment_method_types[]'] = 'paypal';
  } else {
    // Wallets (Apple/Google) route through card via Payment Request
    params['automatic_payment_methods[enabled]'] = 'true';
  }

  if (savePaymentMethod) {
    // Ask Stripe to attach PM for future off-session use when possible
    params.setup_future_usage = 'off_session';
  }
  if (customerId) {
    params.customer = customerId;
  }

  const intent = await stripeRequest('/payment_intents', 'POST', params);
  return {
    id: intent.id,
    clientSecret: intent.client_secret,
    status: intent.status,
  };
}
