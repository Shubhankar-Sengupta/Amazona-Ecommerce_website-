import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productsRoutes from './routes/productRoutes.js';
import userRouter from './routes/usersRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import path from 'path';

// dotenv configuration. To Load Environment Variables from the process object and env object.
dotenv.config();

// connecting to the database.
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`Connected to db.`);
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api/seed', seedRouter);

app.use('/api/products', productsRoutes);

app.use('/api/orders', orderRouter);

app.use('/api/users', userRouter);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, '/frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'));
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

//port bty default if there is any or else server would be listening at opened port 5000.
const port = process.env.PORT || 5000;

// actual listenning happens here.
app.listen(port, () => {
  console.log(`Server is listening at the port http://localhost:${port}`);
});
