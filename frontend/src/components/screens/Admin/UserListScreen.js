import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { Helmet } from 'react-helmet-async';
import { Store } from '../../../Store';
import Message from '../../main_components/Message';
import { getError } from '../../main_components/utils';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const reducer = (state, action) => {
  switch (action.type) {
    case 'Fetch_Request':
      return {
        ...state,
        loading: true,
      };

    case 'Fetch_Success':
      return {
        ...state,
        loading: false,
        users: action.payload,
      };
    case 'Fetch_Fail':
      return {
        ...state,
        loading: false,
      };
  }
};

function UserListScreen() {
  const [{ loading, error, users }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);

  const { userInfo } = state;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch({ type: 'Fetch_Request' });
        const { data } = await axios.get('/api/users', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'Fetch_Success', payload: data });
      } catch (err) {
        dispatch({ type: 'Fetch_Fail', payload: getError(err) });
      }
    };

    fetchUsers();
  }, [userInfo]); // when userInfo changes component useEffect will re-run

  return (
    <div>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <h1>Users</h1>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>IS ADMIN</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                  <td>
                    <Button
                      variant="light"
                      onClick={() => {
                        navigate(`/admin/user/${user._id}`);
                      }}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default UserListScreen;
