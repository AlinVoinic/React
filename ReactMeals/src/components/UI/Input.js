import React from "react";
import styles from "./Input.module.css";

const Input = React.forwardRef((props, ref) => {
  return (
    <div className={styles.input}>
      <label htmlFor={props.input.id}>{props.label}</label>
      {/* <input type="number" id="amount" min={1}></input> */}
      <input ref={ref} {...props.input}></input>
    </div>
  );
});

export default Input;
