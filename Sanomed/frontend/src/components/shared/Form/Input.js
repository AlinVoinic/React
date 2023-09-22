import { useReducer, useEffect } from "react";

import { validate } from "../../../utils/validation";
import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  let element;
  switch (props.element) {
    case "textarea":
      element = (
        <textarea
          id={props.id}
          rows="5"
          placeholder={props.placeholder}
          onChange={changeHandler}
          // onBlur={touchHandler}
          value={inputState.value}
        />
      );
      break;
    default:
      element = (
        <input
          id={props.id}
          type={props.type}
          required
          placeholder={props.placeholder}
          onChange={changeHandler} // functie apelata la fiecare keystroke
          onBlur={touchHandler} // apelat cand utilizatorul iese din input
          value={inputState.value}
        />
      );
  }

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
