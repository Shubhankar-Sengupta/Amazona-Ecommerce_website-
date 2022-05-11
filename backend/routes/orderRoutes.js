import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/order.js';
import { isAuth } from '../utils.js';

const orderRouter = express.Router();

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {
      shippingAddress,
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    const newOrder = new Order({
      orderItems: orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      user: req.user._id,
    });

    const order = await newOrder.save();

    res.status(201).send({ message: 'New Order Created', order });
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order not Found' });
    }
  })
);

export default orderRouter;
