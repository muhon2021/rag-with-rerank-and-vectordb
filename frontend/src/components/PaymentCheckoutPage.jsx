import React, { useEffect, useMemo, useState } from 'react';
import ApplePayButton from './ApplePayButton';
import GooglePayButton from './GooglePayButton';
import PayPalButton from './PayPalButton';
import { createBotoxPaymentIntent } from '../api/client';

const PaymentCheckoutPage = ({
  amount: propAmount,
  currency: propCurrency,
  description: propDescription,
  isBotoxItem = true,
  savePaymentMethod = false,
  customerId,
}) => {
  const [amount, setAmount] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    const v = parseFloat(p.get('amount'));
    return !isNaN(v) && v > 0 ? v : (typeof propAmount === 'number' ? propAmount : 49.99);
  });
  const [currency, setCurrency] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('currency') || propCurrency || 'USD';
  });
  const [description] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('description') || propDescription || 'Botox Items Purchase';
  });

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const showKlarna = useMemo(() => false, []); // Explicitly disabled for treatment payments

  useEffect(() => {
    let cancelled = false;
    async function prepareIntent() {
      setLoading(true);
      setError('');
      try {
        const { clientSecret: cs } = await createBotoxPaymentIntent({ amount, currency, description, method: 'wallet', savePaymentMethod, customerId });
        if (!cancelled) setClientSecret(cs);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to prepare payment.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (amount && currency) {
      prepareIntent();
    }
    return () => { cancelled = true; };
  }, [amount, currency, description, savePaymentMethod, customerId]);

  const handleSuccess = () => {
    setSuccess(true);
    setError('');
  };
  const handleError = (msg) => {
    setSuccess(false);
    setError(msg || 'Payment failed');
  };

  return (
    <div style={{ maxWidth: 460, margin: '20px auto', padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
      <h2 style={{ marginTop: 0 }}>Checkout — {description}</h2>
      <p style={{ marginTop: 0, color: '#444' }}>
        Amount: <strong>{amount.toFixed(2)} {currency.toUpperCase()}</strong>
      </p>

      {loading && <p>Preparing payment options…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Payment successful!</p>}

      {/* Wallets: Apple Pay / Google Pay (Stripe Payment Request) */}
      {clientSecret && (
        <>
          <ApplePayButton
            clientSecret={clientSecret}
            amount={amount}
            currency={currency}
            description={description}
            onPaymentSuccess={handleSuccess}
            onPaymentError={handleError}
          />
          <GooglePayButton
            clientSecret={clientSecret}
            amount={amount}
            currency={currency}
            description={description}
            onPaymentSuccess={handleSuccess}
            onPaymentError={handleError}
          />
        </>
      )}

      {/* PayPal via Stripe */}
      <PayPalButton
        amount={amount}
        currency={currency}
        description={description}
        onPaymentSuccess={handleSuccess}
        onPaymentError={handleError}
      />

      {/* Klarna explicitly excluded */}
      {!showKlarna && (
        <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
          Klarna is not available for treatment payments.
        </div>
      )}

      <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
        Note: Apple/Google Pay buttons only appear on supported devices/browsers.
      </div>
    </div>
  );
};

export default PaymentCheckoutPage;
