import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { isAuth, isAdmin } from '../utils.js';

const orderRouter = express.Router();

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.find().populate({ path: 'user', select: 'name' });
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Orders not found' });
    }
  })
);

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
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.aggregate([
      {
        $group: { _id: null, countUsers: { $sum: 1 } },
      },
    ]);

    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          countOrders: { $sum: 1 },
          totalSales: { $sum: '$totalSales' }, // based on the field of totalSales and returned as totalSales
        },
      },
    ]);

    const dailyOrders = await Order.aggregate([
      // first pipeline as array of objects.
      // orders and sales is returned to the front-end.
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalSales' }, // fields from which we take the aggregate.
        },
      },

      { $sort: { _id: 1 } },
    ]);

    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    if (orders) {
      res.status(201).send(orders);
    }
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
