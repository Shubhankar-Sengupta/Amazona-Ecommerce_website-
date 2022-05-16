import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import stripe from 'stripe';
import Order from '../models/order.js';
const stripeRouter = express.Router();

// This is your test secret API key.
const Stripe = stripe(
  'sk_test_51Kjj2QSJxaR9wFZe11FfNgRDeLj3pOdEeJfKCIr4jo5E3CIQjPyg87Z959Yg51HptHmMZFGzq1u7KrpkMRR4wX0700OfZZRQd0'
);

const calculateOrderAmount = ({ order }) => {
  const totalPrice = order.itemsPrice + order.taxPrice;

  if (!totalPrice === order.totalPrice) return;

  return totalPrice;
};

// Payment Intent route.
stripeRouter.post(
  '/create-payment-intent',
  expressAsyncHandler(async (req, res) => {
    const { order } = req.body;

    const newOrder = await Order.findById(order._id);

    if (!newOrder) {
      return res.status(404).send({ message: 'Order not found' });
    }
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await Stripe.paymentIntents.create({
      amount: 1200,
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

export default stripeRouter;
