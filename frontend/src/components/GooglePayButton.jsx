import React, { useEffect, useRef, useState } from 'react';

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

const GooglePayButton = ({ clientSecret, amount, currency = 'USD', description = 'Order', onPaymentSuccess = () => {}, onPaymentError = () => {} }) => {
  const containerRef = useRef(null);
  const [available, setAvailable] = useState(false);
  const [mounted, setMounted] = useState(false);
  const stripeRef = useRef(null);
  const elementRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function setup() {
      try {
        const stripe = await loadStripeInstance();
        if (cancelled) return;
        stripeRef.current = stripe;
        const elements = stripe.elements();

        const paymentRequest = stripe.paymentRequest({
          country: 'US',
          currency: String(currency).toLowerCase(),
          total: { label: description, amount: Math.round(Number(amount) * 100) },
          requestPayerName: true,
          requestPayerEmail: true,
        });

        const can = await paymentRequest.canMakePayment();
        if (can && can.googlePay) {
          setAvailable(true);
          const prButton = elements.create('paymentRequestButton', {
            paymentRequest,
            style: {
              paymentRequestButton: {
                theme: 'dark',
                height: '40px',
              },
            },
          });
          elementRef.current = prButton;
          prButton.mount(containerRef.current);
          setMounted(true);

          paymentRequest.on('paymentmethod', async (ev) => {
            try {
              const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: ev.paymentMethod.id,
              }, { handleActions: false });

              if (confirmError) {
                ev.complete('fail');
                onPaymentError(confirmError.message);
                return;
              }

              ev.complete('success');

              if (paymentIntent && paymentIntent.status === 'requires_action') {
                const { error: actionError, paymentIntent: pi } = await stripe.confirmCardPayment(clientSecret);
                if (actionError) {
                  onPaymentError(actionError.message);
                } else if (pi) {
                  onPaymentSuccess(pi.id);
                }
              } else if (paymentIntent) {
                onPaymentSuccess(paymentIntent.id);
              }
            } catch (e) {
              ev.complete('fail');
              onPaymentError(e.message || 'Google Pay payment failed');
            }
          });
        } else {
          setAvailable(false);
        }
      } catch (e) {
        onPaymentError(e.message);
      }
    }
    if (clientSecret && amount) setup();
    return () => {
      cancelled = true;
      if (elementRef.current && mounted) {
        try { elementRef.current.unmount(); } catch {}
      }
    };
  }, [clientSecret, amount, currency, description, mounted, onPaymentError, onPaymentSuccess]);

  if (!available) return null;

  return (
    <div style={{ width: '100%', marginBottom: '10px' }}>
      <div ref={containerRef} aria-label="Google Pay"></div>
    </div>
  );
};

export default GooglePayButton;
