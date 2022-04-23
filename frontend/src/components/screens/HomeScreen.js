import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios";

function HomeScreen() {

  const [products, setProducts] = useState([]);

  // imitating componentDidMount() // -it only runs once;
  useEffect(() => {

    const fetchData = async() => {
      const result = await axios.get('/api/products');
      setProducts(result.data);
    }

    fetchData();

  }, [])



// we use JSX fragment
  return (
    <>
    <h1 className="header-featured">Featured products</h1>

        <div className="products">

          {products.map((product) => (<div className="product" key={product.slug}> {/** key props given so that react could identify the elements*/}
            <Link to={`/product/${product.slug}`}>
              <img src={product.image} alt={product.name}/>
            </Link>


            <div className="product-info">

              <Link to={`/product/${product.slug}`}>
                <p>{product.name}</p>
              </Link>

              <p><strong>${product.price}</strong></p>
              <p>{product.description}</p>

              <button>{`Add to cart`.toUpperCase()}</button>

            </div>

          </div>
          ))}

        </div>

    </>
    
  )
}

export default HomeScreen
