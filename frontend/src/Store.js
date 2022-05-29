// create a  context store to ue for global state.
import { useReducer, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logger from 'use-reducer-logger';

// this gives us a Context Object.
export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  cart: {
    cartItems: localStorage.getItem('cart_items')
      ? JSON.parse(localStorage.getItem('cart_items'))
      : [],
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : 'Stripe',
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
  },

  // special case for Order screen.
  loading: true,
  error: '',
  loadingPay: false,
  successPay: false,
  order: {},
};

// reducer function first takes a state argument and second is the action object which updates the state(UI) using useReducer.
function reducer(state, action) {
  switch (action.type) {
    case 'Cart_Add_item':
      // add to cartItems

      const newItem = action.payload;

      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );

      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      localStorage.setItem('cart_items', JSON.stringify(cartItems));

      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };

    case 'Cart_Remove_item': {
      const cartItems = state.cart.cartItems.filter(
        (item) => action.payload._id !== item._id
      );
      localStorage.setItem('cart_items', JSON.stringify(cartItems));

      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }

    case 'User_SignedIn': {
      return { ...state, userInfo: action.payload };
    }

    case 'User_SignedOut': {
      localStorage.setItem('cart_items', JSON.stringify([]));

      return {
        ...state,
        userInfo: null,
        cart: {
          shippingAddress: {},
          cartItems: [],
          paymentMethod: '',
        },
      };
    }

    case 'shippingAddress': {
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    }

    case 'Save_Payment_method': {
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    }

    case 'Cart_Clear': {
      return {
        ...state,
        cart: { ...state.cart, cartItems: [] },
      };
    }

    case 'Fetch_Request_Order':
      return { ...state, loading: true, error: '' };

    case 'Fetch_Success_Order':
      return { ...state, loading: false, order: action.payload, error: '' };

    case 'Fetch_Fail_Order':
      return { ...state, loading: false, error: action.payload };

    case 'Pay_Request_Order':
      return { ...state, loadingPay: true };

    case 'Pay_Success_Order':
      return {
        ...state,
        successPay: true,
        payment: action.payload,
        loadingPay: false,
      };

    case 'Pay_Fail_Order':
      return {
        ...state,
        successPay: false,
        loadingPay: false,
        error: action.payload,
      };

    case 'Pay_Reset_Order': {
      return { ...state, successPay: false, loadingPay: false, error: '' };
    }

    default:
      return state;
  }
}
// every state& action defined  in the reducer function above updates the state& UI.

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(logger(reducer), initialState); // this takes a reducer function and a initial state
  //and returns a state and dispatch function and is seperate from the Store. which uses context api to give access to this state and dispatch function.

  // this is to be passed to the <Store.Provider/>
  const value = { state, dispatch };

  // this would provide access of the Context store to the entire component tree encapsulated within from it's nearest Provider.
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
