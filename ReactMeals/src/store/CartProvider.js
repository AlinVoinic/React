import { useReducer } from "react";
import CartContext from "./cart-context";
// Manage the cart context data | provides the data to all components that want access to it
const defaultState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const updatedState = { ...state };
      updatedState.totalAmount += action.payload.amount * action.payload.price;
      console.log(updatedState);

      const itemIndex = updatedState.items.findIndex(
        // returneaza indexul itemului din cart
        (item) => item.id === action.payload.id
      );

      if (itemIndex >= 0) {
        updatedState.items[itemIndex].amount += action.payload.amount;
      } else {
        updatedState.items.push(action.payload);
      }

      return updatedState; // returnam noul state}
    }

    case "REMOVE_ITEM": {
      let updatedItems;
      const itemIndex = state.items.findIndex((item) => item.id === action.id);
      const updatedAmount = state.totalAmount - state.items[itemIndex].price;

      if (state.items[itemIndex].amount === 1) {
        // elimiman item-ul din array
        updatedItems = state.items.filter((item) => item.id !== action.id);
      } else {
        // doar updatam amount
        updatedItems = [...state.items];
        updatedItems[itemIndex].amount -= 1;
      }

      return {
        items: updatedItems,
        totalAmount: updatedAmount,
      };
    }

    case "CLEAR": {
      return defaultState;
    }

    default:
      return defaultState;
  }
};

function CartProvider(props) {
  const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultState);

  const addItemToCartHandler = (item) => {
    // trimit item-ul primit in functie catre reducer
    dispatchCartAction({ type: "ADD_ITEM", payload: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE_ITEM", id });
  };

  const clearCartHandler = () => {
    dispatchCartAction({ type: "CLEAR" });
  };

  const cartContext = {
    // object containing context data management logic
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
    clearCart: clearCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
}

export default CartProvider;
