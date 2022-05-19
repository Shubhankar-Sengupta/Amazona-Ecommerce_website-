import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
      };
    }

    case 'Fetch_Fail': {
      return { ...state, error: action.payload, loading: false };
    }

    default: {
      return state;
    }
  }
};

function ProductListScreen() {
  const [{ loading, products, error, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const { search } = useLocation();

  const sp = new URLSearchParams(search);

  const page = sp.get('page') || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'Fetch_Request' });
        const { data } = await axios.get(`/api/products/admin?page=${page}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'Fetch_Success', payload: data });
      } catch (err) {
        dispatch({ type: 'Fetch_Fail', payload: getError(err) });
      }
    };

    fetchData();
  }, [userInfo, page]); // consitionally run the effect which re-renders the component.

  return (
    <div>
      <h1>Products</h1>

      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={Number(page) === x + 1 ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductListScreen;
