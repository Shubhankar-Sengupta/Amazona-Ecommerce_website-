import express from 'express';
import data from './data.js';

const app = express();

app.get('/api/products', (req, res) => {
  res.send(data.products);
});

app.get('/api/products/slug/:slug', (req, res) => {
  const product= data.products.find((x) => x.slug === req.params.slug);

  if (product) {
    res.send( product );
  }

  else {
    res.send({ message: "Product Not Found" });
  }

});

//port bty default if there is any or else server would be listening at opened port 5000.
const port = process.env.PORT || 5000;

// actual listenning happens here.
app.listen(port, () => {
  console.log(`Server is listening at the port http://localhost:${port}`);
});
