import { useContext, useEffect, useState } from "react";
import CartContext from "../../store/cart-context";
import CartIcon from "../Cart/CartIcon";
import styles from "./CartButton.module.css";

function CartButton(props) {
  const [btnIsHighlighted, setBtnIsHighlighted] = useState(false);

  const { items } = useContext(CartContext); // context filled object  |  La fiecare modificare a contextului, CartButton va fi reevaluat

  const numberOfCartItems = items.reduce((current, item) => {
    // Actualizam numarul intrarilor fiecarui obiect adaugat in Cart | Contextul curent se bazeaza pe obiectele 'cartItems' din Cart.js
    return current + item.amount; // de aici si item.amount!
  }, 0);

  const btnStyles = `${styles.button} ${btnIsHighlighted ? styles.bump : " "}`;

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    setBtnIsHighlighted(true);

    const timer = setTimeout(() => {
      setBtnIsHighlighted(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [items]);

  return (
    <button className={btnStyles} onClick={props.onClick}>
      <span className={styles.icon}>
        <CartIcon />
      </span>
      <span>{props.children}</span>
      <span className={styles.badge}>{numberOfCartItems}</span>
    </button>
  );
}

export default CartButton;
