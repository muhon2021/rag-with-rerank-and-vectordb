import React, { useCallback, useState } from 'react';
import { createBotoxPaymentIntent } from '../api/client';

function loadStripeInstance() {
  return new Promise((resolve, reject) => {
    const pubKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!pubKey) return reject(new Error('Stripe publishable key missing (VITE_STRIPE_PUBLISHABLE_KEY).'));

    if (window.Stripe) {
      return resolve(window.Stripe(pubKey));
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      try {
        resolve(window.Stripe(pubKey));
      } catch (e) {
        reject(e);
      }
    };
    script.onerror = () => reject(new Error('Failed to load Stripe.js'));
    document.head.appendChild(script);
  });
}

const PayPalButton = ({ amount, currency = 'USD', description = 'Order', onPaymentSuccess = () => {}, onPaymentError = () => {} }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (!amount) {
      onPaymentError('Amount is missing.');
      return;
    }
    setLoading(true);
    try {
      const stripe = await loadStripeInstance();
      const { clientSecret } = await createBotoxPaymentIntent({ amount, currency, description, method: 'paypal' });

      const { error } = await stripe.confirmPayPalPayment(clientSecret, {
        return_url: window.location.origin + '/checkout-success',
      });

      // For PayPal, user is usually redirected. If an immediate error, report it.
      if (error) {
        onPaymentError(error.message || 'PayPal payment failed');
      } else {
        // In rare cases without redirect
        onPaymentSuccess(clientSecret);
      }
    } catch (e) {
      onPaymentError(e.message || 'PayPal payment failed');
    } finally {
      setLoading(false);
    }
  }, [amount, currency, description, onPaymentError, onPaymentSuccess]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      style={{
        width: '100%',
        height: '40px',
        backgroundColor: '#0070ba',
        color: '#fff',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: loading ? 'not-allowed' : 'pointer',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10px',
      }}
      aria-label="Pay with PayPal"
    >
      {loading ? 'Processing…' : 'Pay with PayPal'}
    </button>
  );
};

export default PayPalButton;
