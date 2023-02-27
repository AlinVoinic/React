import { useContext } from "react";
import styles from "./Meal.module.css";
import MealForm from "./MealForm";
import CartContext from "../../../store/cart-context";

function Meal(props) {
  const cartCtx = useContext(CartContext);

  const price = `$${props.price.toFixed(2)}`; //pret afisat cu 2 zecimale

  const addToCartHandler = (amount) => {
    // adaugam meal-ul care ulterior va fi dus in reducer
    cartCtx.addItem({
      id: props.id,
      // key: props.id,
      name: props.name,
      amount: amount,
      price: props.price,
    });
  };

  return (
    <li className={styles.meal}>
      <div>
        <h3>{props.name}</h3>
        <div className={styles.description}>{props.description}</div>
        <div className={styles.price}>{price}</div>
      </div>
      <div>
        <MealForm id={props.id} onAddToCart={addToCartHandler} />
      </div>
    </li>
  );
}

export default Meal;
