// create a  context store to ue for global state.
import { useReducer, createContext } from 'react';
import logger from 'use-reducer-logger';

// this gives us a Context Object.
export const Store = createContext();

const initialState = {
  cart: {
    cartItems: [],
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'Cart_Add_item':
      // add to cartItems
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [...state.cart.cartItems, action.payload],
        },
      };

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
