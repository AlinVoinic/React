import { useContext, useState } from "react";
import CartContext from "../../store/cart-context";

import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import styles from "./Cart.module.css";
import Checkout from "./Checkout";

function Cart(props) {
  const [formIsVisible, setFormIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${Math.abs(cartCtx.totalAmount).toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
    // -> addItemToCartHandler din CartProvider
  };
  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const orderHandler = () => {
    setFormIsVisible(true);
  };

  const submitOrderHandler = async (userData) => {
    // cart and inputs data will be submitted to the server
    setIsSubmitting(true);
    await fetch(
      "https://react-http-ae5cd-default-rtdb.europe-west1.firebasedatabase.app/orders.json",
      {
        method: "POST",
        body: JSON.stringify({
          user: userData,
          orderedItems: cartCtx.items,
        }),
      }
    );

    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={styles["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onAdd={cartItemAddHandler.bind(null, item)}
          onRemove={() => cartItemRemoveHandler(item.id)}
        />
        // cu bind(null, item) preconfiguram o functie cu argumente pentru executie
        // null === this | item va fi dus in argumentul Handler-ului
      ))}
    </ul>
  );

  const modalActions = (
    <div className={styles.actions}>
      <button className={styles["button--alt"]} onClick={props.onCloseCart}>
        Close
      </button>
      {hasItems && (
        <button className={styles.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <>
      {cartItems}
      <div className={styles.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {formIsVisible && (
        <Checkout onConfirm={submitOrderHandler} onCancel={props.onCloseCart} />
      )}
      {!formIsVisible && modalActions}
    </>
  );

  const isSubmittingModalContent = <p>Sending order data...</p>;

  const didSubmitModalContent = (
    <>
      <p>Successfully sent the order!</p>
      <div className={styles.actions}>
        <button className={styles.button} onClick={props.onCloseCart}>
          Close
        </button>
      </div>
    </>
  );

  return (
    // onCloseCart pe Modal pentru Backdrop
    <Modal onCloseCart={props.onCloseCart}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
}

export default Cart;
