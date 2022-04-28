// create a  context store to ue for global state.
import { useReducer, createContext } from 'react';
import logger from 'use-reducer-logger';

// this gives us a Context Object.
export const Store = createContext();

const initialState = {
  cart: {
    cartItems: localStorage.getItem('cart_items')? JSON.parse(localStorage.getItem('cart_items')):[]
  },
};

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

      const cartItems = state.cart.cartItems.filter((item)=> action.payload._id !== item._id);
      localStorage.setItem('cart_items', JSON.stringify(cartItems));

      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(logger(reducer), initialState);

  // this is to be passed to the <Store.Provider/>
  const value = { state, dispatch };

  // this would provide access of the Context store to the entire component tree encapsulated within from it's nearest Provider.
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
