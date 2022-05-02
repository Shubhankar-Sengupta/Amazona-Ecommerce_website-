import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Product from '../main_components/Product';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Helmet } from 'react-helmet-async';
import Loader from '../main_components/Loader';
import Message from '../main_components/Message';
import { getError } from '../main_components/utils.js';

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
  const [{ loading, error, products }, dispatch] = useReducer(
    process.env.NODE_ENV === 'development' ? logger(reducer) : reducer,
    {
      products: [],
      loading: true,
      error: '',
    }
  );

  // repilcating componentDidMount();
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'Fetch_Request', loading: true });

      try {
        const {data} = await axios.get('/api/products');

        dispatch({
          type: 'Fetch_Success',
          loading: false,
          payload: data,
          error: '',
        });
      } catch (err) {
        dispatch({ type: 'Fetch_Fail', payload: getError(err) });
      }
    };
    // here we call fetch data.
    fetchData();
  }, []);

  // we use JSX fragment.

  return (
    <>
      <Helmet>
        <title>Amazona</title>
      </Helmet>

      <h1>Featured products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
}

export default HomeScreen;
