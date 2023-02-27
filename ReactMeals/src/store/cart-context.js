import React from "react";
// Managing the overall cart data
const CartContext = React.createContext({
  // dummy data for IDE auto-completion
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
});

export default CartContext;
