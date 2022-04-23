import express from 'express';
import data from './data.js';

const app = express();

app.get('/api/products', (req, res) => {
  res.send(data.products);
});

//port bty default if there is any or else server would be listening at opened port 5000 
const port = process.env.PORT || 5000;

// actual listenning happens here.
app.listen(port, () => {
  console.log(`Server is listening at the port http://localhost:${port}`);
});
