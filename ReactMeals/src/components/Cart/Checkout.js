import { useRef, useState } from "react";
import styles from "./Checkout.module.css";

const isEmpty = (value) => value.trim() === "";
const isSixDigits = (value) => value.trim().length === 6;

const Checkout = (props) => {
  const [formInputsValidity, setFormInputsValidity] = useState({
    name: true,
    street: true,
    city: true,
    zipCode: true,
  });

  const nameRef = useRef();
  const streetRef = useRef();
  const zipRef = useRef();
  const cityRef = useRef();

  const confirmHandler = (e) => {
    e.preventDefault();

    const enteredName = nameRef.current.value;
    const enteredStreet = streetRef.current.value;
    const enteredZip = zipRef.current.value;
    const enteredCity = cityRef.current.value;

    const enteredNameIsValid = !isEmpty(enteredName);
    const enteredStreetIsValid = !isEmpty(enteredStreet);
    const enteredCityIsValid = !isEmpty(enteredCity);
    const enteredZipIsValid = isSixDigits(enteredZip);

    setFormInputsValidity({
      name: enteredNameIsValid,
      street: enteredStreetIsValid,
      city: enteredCityIsValid,
      zipCode: enteredZipIsValid,
    });

    const formIsValid =
      enteredNameIsValid &&
      enteredStreetIsValid &&
      enteredCityIsValid &&
      enteredZipIsValid;

    if (!formIsValid) return;

    props.onConfirm({
      // pass data from Checkout to Cart
      name: enteredName,
      street: enteredStreet,
      zipCode: enteredZip,
      city: enteredCity,
    });
  };

  const nameStyle = `${styles.control} ${
    formInputsValidity.name ? "" : styles.invalid
  }`;
  const streetStyle = `${styles.control} ${
    formInputsValidity.street ? "" : styles.invalid
  }`;
  const cityStyle = `${styles.control} ${
    formInputsValidity.city ? "" : styles.invalid
  }`;
  const zipCodeStyle = `${styles.control} ${
    formInputsValidity.zipCode ? "" : styles.invalid
  }`;

  return (
    <form className={styles.form} onSubmit={confirmHandler}>
      <div className={nameStyle}>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" ref={nameRef} />
        {!formInputsValidity.name && <p>Enter a valid name.</p>}
      </div>
      <div className={streetStyle}>
        <label htmlFor="street">Street</label>
        <input type="text" id="street" ref={streetRef} />
        {!formInputsValidity.street && <p>Enter a valid street.</p>}
      </div>
      <div className={zipCodeStyle}>
        <label htmlFor="postal">ZIP Code</label>
        <input type="text" id="postal" ref={zipRef} />
        {!formInputsValidity.zipCode && <p>Enter a valid, 6 digit code.</p>}
      </div>
      <div className={cityStyle}>
        <label htmlFor="city">City</label>
        <input type="text" id="city" ref={cityRef} />
        {!formInputsValidity.city && <p>Enter a valid city.</p>}
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={props.onCancel}>
          Cancel
        </button>
        <button className={styles.submit}>Confirm</button>
      </div>
    </form>
  );
};

export default Checkout;
