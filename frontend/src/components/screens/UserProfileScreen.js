import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../../Store';
import { getError } from '../main_components/utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'Update_Request': {
      return { ...state, loadingUpdate: true };
    }

    case 'Update_Success': {
      return { ...state, loadingUpdate: false };
    }
    case 'Update_Fail': {
      return { ...state, loadingUpdate: false };
    }

    default: {
      return state;
    }
  }
};

function UserProfileScreen() {
  const { state, dispatch: cxtDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [button, setButton] = useState('Update');

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== cPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      dispatch({ type: 'Update_Request' });
      setButton('Processing...');

      const { data } = await axios.put(
        '/api/users/profile',
        { name, email, password },
        {
          headers: {
            authorization: 'Bearer ' + userInfo.token,
          },
        }
      );

      dispatch({ type: 'Update_Success' });
      setButton('Update');
      cxtDispatch({ type: 'User_SignedIn', payload: data });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setPassword('');
      setCPassword('');

      toast.success('User updated successfully');
    } catch (err) {
      dispatch({ type: 'Update_Fail' });
      toast.error(getError(err));
    }
  };

  return (
    <div>
      <Helmet>
        <title>User Profile</title>
      </Helmet>

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password1">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={cPassword}
            required
            onChange={(e) => {
              setCPassword(e.target.value);
            }}
          />
        </Form.Group>

        <div className="mb-3">
          <Button type="submit">{button}</Button>
        </div>
      </Form>
    </div>
  );
}

export default UserProfileScreen;
