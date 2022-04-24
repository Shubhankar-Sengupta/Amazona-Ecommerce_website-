import React, { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logger from 'use-reducer-logger';


function reducer(state, action) {
  // second option that by default is passed to the reducer is action and the first is initial state.
  switch (action.type) {
    case 'Fetch_Request':
      return {
        ...state,
        loading: true, // we can show the loading box here
      };
    case 'Fetch_Success':
      return {
        ...state,
        loading: false,
        products: action.payload,
      };
    case 'Fetch_Fail':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }

}


function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(process.env.NODE_ENV === 'development' ? logger(reducer): reducer, {
    products: {},
    loading: true,
    error: '',
  });

  // repilcating componentDidMount();
  useEffect(() => {

    try {
      const fetchData = async () => {
        dispatch({ type: 'Fetch_Request', loading: true });
        const result = await axios.get('/api/products');
        dispatch({
          type: 'Fetch_Success',
          loading: false,
          payload: result.data,
          error: '',
        });
      };
        // here we call fetch data.
        fetchData();
    } 

    catch (err) {
      dispatch({type: 'Fetch_Fail', payload: err.message});
      }
  }, []);

  // we use JSX fragment.

  return (
    <>
      <h1 className="header-featured">Featured products</h1>

      <div className="products">

        {loading? <div>Loading....</div> : error?<div>{error}</div>: products.map((product) => (

          <div className="product" key={product.slug}>
            {/** key props given so that react could identify the elements*/}
            <Link to={`/product/${product.slug}`}>
              <img src={product.image} alt={product.name} />
            </Link>
            <div className="product-info">

              <Link to={`/product/${product.slug}`}>
                <p>{product.name}</p>
              </Link>

              <p>
                <strong>${product.price}</strong>
              </p>
              <p>{product.description}</p>

              <button>{`Add to cart`.toUpperCase()}</button>

            </div>

          </div>
        ))}

      </div>

    </>
  );
}

export default HomeScreen;
