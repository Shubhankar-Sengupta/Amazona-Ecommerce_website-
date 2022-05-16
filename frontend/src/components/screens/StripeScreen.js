import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import CheckoutFormScreen from './CheckoutFormScreen';
import { getError } from '../main_components/utils';
import { toast } from 'react-toastify';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.

function StripeScreen({ stripePromise, order }) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    try {
      const fetchIntent = async () => {
        const { data: clientSecret } = await axios.post(
          '/api/stripe/create-payment-intent',
          { order },
          { headers: { 'Content-Type': 'application/json' } }
        );

        setClientSecret(clientSecret.clientSecret);
      };
      fetchIntent();

    } catch (err) {
      toast.error(getError(err));
    }
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutFormScreen order={order} />
        </Elements>
      )}
    </div>
  );
}

export default StripeScreen;
