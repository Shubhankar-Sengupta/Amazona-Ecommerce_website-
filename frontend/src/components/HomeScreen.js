import React from 'react'
import data from '../data'
import {Link} from 'react-router-dom'

function HomeScreen() {

// we use JSX fragment
  return (
    <>
    <h1 className="header-featured">Featured products</h1>

        <div className="products">

          {data.products.map((product) => (<div className="product" key={product.slug}> {/** key props given so that react could identify the elements*/}
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
