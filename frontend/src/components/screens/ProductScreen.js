import React, { useReducer, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Rating from '../main_components/Rating';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import Loader from '../main_components/Loader';
import Message from '../main_components/Message';
import { getError } from '../main_components/utils';

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
        product: action.payload,
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

function ProductScreen() {
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  // repilcating componentDidMount(). Used for running side effects();
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'Fetch_Request', loading: true });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({
          type: 'Fetch_Success',
          loading: false,
          payload: result.data,
        });
      } catch (err) {
        // here we call fetch data.
        dispatch({ type: 'Fetch_Fail', payload: getError(err) });
      }
    };

    fetchData();
  }, [slug]); // whenever the slug changes useEffect() will be called and the component will re-render.

  // we use JSX fragment.
  return (
    <>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            <Col md={6}>
              <img
                className="img-large"
                src={product.image}
                alt={product.name}
              />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h1>{product.name}</h1>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  />
                </ListGroup.Item>

                <ListGroup.Item>Price:${product.price}</ListGroup.Item>

                <ListGroup.Item>
                  <p>{product.description}</p>
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Status: </Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button variant="primary">Add to Cart</Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

export default ProductScreen;
