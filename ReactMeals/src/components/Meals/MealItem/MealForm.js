import { useRef, useState } from "react";
import Input from "../../UI/Input";
import styles from "./MealForm.module.css";

function MealForm(props) {
  const [amountIsValid, setAmountIsValid] = useState(true);
  const amountInputRef = useRef(); // SAU useState + two-way binding

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredAmount = amountInputRef.current.value; // === event.target.value
    // amountInputRef.current pointeaza la elementul input stocat in ref
    const enteredAmountNo = +enteredAmount; // enteredAmount initial este String

    if (
      enteredAmount.trim().length === 0 ||
      enteredAmountNo < 1 ||
      enteredAmountNo > 5
    ) {
      setAmountIsValid = false;
      return;
    }

    props.onAddToCart(enteredAmountNo);
  };

  return (
    // Pentru ref pe Componente custom, folosim React.forwardRef()
    <form className={styles.form} onSubmit={submitHandler}>
      <div>
        <Input
          ref={amountInputRef}
          label="Amount"
          input={{
            type: "number",
            id: "amount_" + props.id,
            min: "1",
            max: "5",
            step: "1",
            defaultValue: "1",
          }}
        />
      </div>
      <button>+ Add</button>
      {!amountIsValid && <p>Enter a valid amount (1-5)</p>}
    </form>
  );
}

export default MealForm;
