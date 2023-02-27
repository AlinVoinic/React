import styles from "./Header.module.css";
import meals from "../../assets/meals.jpg";
import CartButton from "./CartButton";

function Header(props) {
  return (
    <>
      <header className={styles.header}>
        <h1>React Meals</h1>
        <CartButton onClick={props.onShowCart}>Your Cart</CartButton>
      </header>
      <div className={styles["main-image"]}>
        <img src={meals} alt="A table full of delicious food!"></img>
      </div>
    </>
  );
}

export default Header;
