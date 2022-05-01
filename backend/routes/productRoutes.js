import express from 'express';
import Product from '../models/Product.js';
const productsRoutes = express.Router();

productsRoutes.get('/', async (req, res) => {

  const products = await Product.find({});
  if (products) {
    res.send(products);
  }

  else {
    res.status(404).send({message: 'No Products to display'});
  }
  
});

productsRoutes.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Oops!! Product Not Found' });
  }
});

productsRoutes.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Oops!! Product Not Found' });
  }
});

export default productsRoutes;