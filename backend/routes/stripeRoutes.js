import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import stripe from 'stripe';
import Order from '../models/order.js';
import { isAuth } from '../utils.js';

const stripeRouter = express.Router();

// This is your test secret API key.
const Stripe = stripe(
  'sk_test_51Kjj2QSJxaR9wFZe11FfNgRDeLj3pOdEeJfKCIr4jo5E3CIQjPyg87Z959Yg51HptHmMZFGzq1u7KrpkMRR4wX0700OfZZRQd0'
);

const calculateOrderItems = async (items) => {
  const result = await Order.findById(items._id);
  const itemsPrice = result.orderItems.reduce(
    (a, c) => a + c.price * c.quantity,
    0
  );

  const totalPrice = itemsPrice + items.shippingPrice + items.taxPrice;
  const round = Math.ceil(totalPrice);

  return round;
};

// Payment Intent route.
stripeRouter.post(
  '/create-payment-intent',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { order } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await Stripe.paymentIntents.create({
      amount: await calculateOrderItems(order),
      currency: 'INR',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  })
);

// Stripe Webhook

const endpointSecret =
  'whsec_898a62374f4fcf5244083126392911716aa42e0e43f94e0ac4b860ec414737f7';

stripeRouter.use((req, res, next) => {
  const data_stream = '';

  // Readable streams emit 'data' events once a listener is added.
  req
    .setEncoding('utf-8')
    .on('data', function (data) {
      data_stream += data; // reading data in chunks.
    })
    .on('end', function () {
      req.rawBody; // attach a raw body property to the req object
      req.rawBody = data_stream;
      next();
    });
});

stripeRouter.post('/webhook', (req, res) => {
  let event = req.rawBody;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse.

  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
  }
  // Return a 200 res to acknowledge receipt of the event
  res.send(200);
});

export default stripeRouter;
