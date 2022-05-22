import express from 'express';
import Product from '../models/Product.js';
import expressAsyncHandler from 'express-async-handler';
import { isAdmin, isAuth } from '../utils.js';
const productsRoutes = express.Router();

productsRoutes.get('/', async (req, res) => {
  const products = await Product.find({});
  if (products) {
    res.send(products);
  } else {
    res.status(404).send({
      message: 'No Products to display',
    });
  }
});

productsRoutes.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const {
      name,
      slug,
      category,
      image,
      price,
      countInStock,
      brand,
      rating,
      numReviews,
      description,
    } = req.body;

    const checkProduct = await Product.findById(id);

    if (checkProduct) {
      checkProduct.name = name;
      checkProduct.slug = slug;
      checkProduct.category = category;
      checkProduct.image = image;
      checkProduct.price = price;
      checkProduct.countInStock = countInStock;
      checkProduct.brand = brand;
      checkProduct.rating = rating;
      checkProduct.numReviews = numReviews;
      checkProduct.description = description;

      await checkProduct.save();
      res.send({
        message: 'Product updated successfully',
      });
    } else {
      res.send({
        message: 'Product not found',
      });
    }
  })
);

productsRoutes.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (product) {
      await product.remove();
      res.send({ message: 'Product deleted successfully' });
    } else {
      res.status(404).send({ message: 'Product not found' });
    }
  })
);

productsRoutes.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = await Product.create({
      name: 'sample name ' + Date.now(),
      slug: 'sample-slug- ' + Date.now(),
      category: 'Unknown',
      image: '/images/p2.jpg',
      price: 0,
      countInStock: 0,
      brand: 'Unknown',
      rating: 0,
      numReviews: 0,
      description: 'Sample Description',
    });

    const product = await newProduct.save();

    res.send({
      message: 'Product Created successfully',
      product,
    });
  })
);

productsRoutes.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productsRoutes.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const PAGE_SIZE = 3;

    const { query } = req;

    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
    const searchQuery = query.query || '';
    const order = query.order || '';
    const rating = query.rating || '';

    // filter starting.
    const queryFilters =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};

    const categoryFilter =
      category && category !== 'all'
        ? {
            category,
          }
        : {};

    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};

    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};

    const sortOrder =
      order === 'featured'
        ? {
            featured: -1,
          }
        : order === 'toprated'
        ? {
            rating: -1,
          }
        : order === 'highest'
        ? {
            price: -1,
          }
        : order === 'lowest'
        ? {
            price: 1,
          }
        : order === 'newest'
        ? {
            createdAt: -1,
          }
        : {
            _id: -1,
          };

    // filter end

    const products = await Product.find({
      ...queryFilters,
      ...priceFilter,
      ...categoryFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilters,
      ...priceFilter,
      ...categoryFilter,
      ...ratingFilter,
    });

    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productsRoutes.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = 3;
    const page = query.page || 1;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments();

    res.send({
      products,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productsRoutes.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
  });

  if (product) {
    res.send(product);
  } else {
    res.status(404).send({
      message: 'Oops!! Product Not Found',
    });
  }
});

productsRoutes.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.send(product);
  } else {
    res.status(404).send({
      message: 'Oops!! Product Not Found',
    });
  }
});

export default productsRoutes;
