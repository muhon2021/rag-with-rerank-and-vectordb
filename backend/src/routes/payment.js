import express from 'express';
import { createPaymentIntent } from '../services/stripeService.js';

const router = express.Router();

router.post('/create-intent', async (req, res, next) => {
  try {
    const { amount, currency = 'USD', description, method = 'wallet', savePaymentMethod = false, customerId } = req.body || {};

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required', code: 'VALIDATION_ERROR' });
    }
    if (!currency) {
      return res.status(400).json({ error: 'Currency is required', code: 'VALIDATION_ERROR' });
    }

    const allowed = new Set(['wallet', 'paypal', 'card']);
    if (!allowed.has(String(method).toLowerCase())) {
      return res.status(400).json({ error: 'Unsupported payment method', code: 'UNSUPPORTED_METHOD' });
    }

    const result = await createPaymentIntent({ amount: Number(amount), currency, description, method, savePaymentMethod: Boolean(savePaymentMethod), customerId });
    return res.json({ clientSecret: result.clientSecret, id: result.id, status: result.status });
  } catch (err) {
    if (err?.status && err?.code) {
      return res.status(err.status).json({ error: err.message, code: err.code });
    }
    return next(err);
  }
});

export default router;
