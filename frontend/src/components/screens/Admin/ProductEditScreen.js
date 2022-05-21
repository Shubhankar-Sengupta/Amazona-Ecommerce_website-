import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../../../Store';
import Loader from '../../main_components/Loader';
import Message from '../../main_components/Message';
import { getError } from '../../main_components/utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'Fetch_Request': {
      return { ...state, loading: true, error: '' };
    }

    case 'Fetch_Success': {
      return {
        ...state,
        loading: false,
        error: '',
        product: action.payload,
      };
    }

    case 'Fetch_Fail': {
      return { ...state, error: action.payload, loading: false };
    }
    case 'Update_Request': {
      return { ...state, loading: true, loadingUpdate: true };
    }
    case 'Update_Success': {
      return { ...state, loading: false, loadingUpdate: false };
    }
    case 'Update_Fail': {
      return {
        ...state,
        error: action.payload,
        loading: false,
        loadingUpdate: false,
      };
    }

    default: {
      return state;
    }
  }
};

function ProductEditScreen() {
  const params = useParams();
  const { id: productId } = params;

  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'Fetch_Request' });
        const { data } = await axios.get(`/api/products/${productId}`);
        dispatch({ type: 'Fetch_Success', payload: data });
        setName(data.name);
        setSlug(data.slug);
        setCategory(data.category);
        setImage(data.image);
        setPrice(data.price);
        setCountInStock(data.countInStock);
        setBrand(data.brand);
        setRating(data.rating);
        setNumReviews(data.numReviews);
        setDescription(data.description);
      } catch (err) {
        dispatch({ type: 'Fetch_Fail', payload: err });
        toast.error(getError(err));
      }
    };

    fetchData();
  }, [productId]); // this side effect runs conditionally when productId changes

  const [{ loading, error, product, loadingUpdate }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
    }
  );

  const updateHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch({ type: 'Update_Request' });
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
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
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );

      dispatch({ type: 'Update_Success' });
      toast.success('Data updated successfully');
      navigate('/admin/products');
    } catch (err) {
      dispatch({ type: 'Update_Fail', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [brand, setBrand] = useState('');
  const [rating, setRating] = useState('');
  const [numReviews, setNumReviews] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Container className="container small-container">
      <Helmet>
        <title>Edit Product {productId}</title>
      </Helmet>
      <h1>Edit Product {productId}</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <Form>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => {
                setImage(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>CountInStock</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => {
                setCountInStock(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="rating">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              value={rating}
              onChange={(e) => {
                setRating(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="numReviews">
            <Form.Label>Reviews</Form.Label>
            <Form.Control
              value={numReviews}
              onChange={(e) => {
                setNumReviews(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>

          <div className="mb-3">
            <Button type="submit" onClick={updateHandler}>
              Update
            </Button>
            {loadingUpdate && <Loader />}
          </div>
        </Form>
      )}
    </Container>
  );
}

export default ProductEditScreen;
