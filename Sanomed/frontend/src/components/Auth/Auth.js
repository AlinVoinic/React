import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  VALID_NAME,
  VALID_EMAIL,
  VALID_PASS,
  VALID_PASSC,
  VALID_REQUIRE,
  VALID_MINLENGTH,
} from "../../utils/validation";

import { useForm } from "../shared/hooks/form-hook";
import { useHttpHook } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";
import { ImCancelCircle } from "react-icons/im";
import LoadingSpinner from "../../UI/LoadingSpinner";
import Modal from "../../UI/Modal";
import Input from "../shared/Form/Input";

import heart from "../../images/heart_logo.png";
import "./Auth.css";

const Auth = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpHook();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      delete formState.inputs.nume;
      delete formState.inputs.prenume;
      delete formState.inputs.passwordConfirm;
      delete formState.inputs.terms;
      setFormData(
        { ...formState.inputs },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          nume: {
            value: "",
            isValid: false,
          },
          prenume: {
            value: "",
            isValid: false,
          },
          passwordConfirm: {
            value: "",
            isValid: false,
          },
          terms: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const data = await sendRequest(
          "http://localhost:5000/api/user/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );

        auth.login(data.userID, data.token, data.isAdmin);
        navigate("/");
      } catch (err) {}
    } else {
      try {
        const data = await sendRequest(
          "http://localhost:5000/api/user/signup",
          "POST",
          JSON.stringify({
            nume: formState.inputs.nume.value,
            prenume: formState.inputs.prenume.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
            passwordConfirm: formState.inputs.passwordConfirm.value,
          }),
          { "Content-Type": "application/json" }
        );
        auth.login(data.userID, data.token, data.isAdmin);
        navigate("/");
      } catch (err) {}
    }
  };

  return (
    <>
      <Modal
        show={!!error}
        onCancel={clearError}
        header="A apărut o eroare!"
        footer={<ImCancelCircle onClick={clearError}></ImCancelCircle>}
      >
        <p>{error}</p>
      </Modal>

      {isLoading && <LoadingSpinner asOverlay />}

      {!isLoading && (
        <>
          <h2 className="app-filler">Bun venit in Contul Meu SANOMED</h2>
          <form onSubmit={authSubmitHandler} className="app-form">
            {!isLoginMode && (
              <div className="form-divider">
                <div className="stage1">
                  <Input
                    id="nume"
                    type="text"
                    label="Nume:"
                    validators={[VALID_MINLENGTH(1), VALID_NAME()]}
                    errorText="Introduceți un nume valid!"
                    onInput={inputHandler}
                  />
                </div>
                <div className="stage1">
                  <Input
                    id="prenume"
                    type="text"
                    label="Prenume:"
                    validators={[VALID_MINLENGTH(1), VALID_NAME()]}
                    errorText="Introduceți un nume valid!"
                    onInput={inputHandler}
                  />
                </div>
              </div>
            )}
            <div className="form-divider">
              <div className="stage1">
                <Input
                  id="email"
                  type="email"
                  label="E-Mail:"
                  validators={[VALID_MINLENGTH(1), VALID_EMAIL()]}
                  errorText="Introduceți o adresă de e-mail validă!"
                  onInput={inputHandler}
                />
              </div>
              {!isLoading && isLoginMode && (
                <img className="login-pic" src={heart} alt="heart-logo" />
              )}
            </div>
            <div className="form-divider">
              <div className="stage1">
                <Input
                  id="password"
                  type="password"
                  label="Parolă:"
                  validators={[VALID_REQUIRE(), VALID_PASS()]}
                  errorText="Introduceți o parolă formată din minim 8 caractere, o majusculă, o cifră și un caracter special!"
                  onInput={inputHandler}
                />
              </div>
              {!isLoginMode && (
                <div className="stage1">
                  <Input
                    id="passwordConfirm"
                    type="password"
                    label="Confirmare parolă:"
                    validators={[VALID_PASSC(formState.inputs.password.value)]}
                    errorText="Parola introdusă trebuie sa fie identică!"
                    onInput={inputHandler}
                  />
                </div>
              )}
            </div>
            {!isLoginMode && (
              <div className="checkbox">
                <Input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  validators={[]}
                  onInput={inputHandler}
                />
                <label htmlFor="terms">
                  Sunt de acord cu{" "}
                  <Link to="/info/termeni" target="_blank">
                    Termenii și Condițiile
                  </Link>{" "}
                  {/* &thinsp; și cu &thinsp; */}
                  si cu{" "}
                  <Link to="/info/confidentialitate" target="_blank">
                    Politica de Confidențialitate
                  </Link>
                </label>
              </div>
            )}
            <button
              className="submitAuth"
              type="submit"
              disabled={!formState.isValid}
            >
              {isLoginMode ? "Loghează-te!" : "Înregistrează-te!"}
            </button>
          </form>

          <div className="auth-bottom">
            <p>
              {isLoginMode
                ? "Nu aveți cont de utilizator?"
                : "Sunteți  înregistrat ca pacient?"}
            </p>
            <button className="switchAuth" onClick={switchModeHandler}>
              {isLoginMode ? "Înregistrează-te" : "Loghează-te"}
            </button>
          </div>

          {isLoginMode && <div className="spacerrr">.</div>}
        </>
      )}
    </>
  );
};

export default Auth;
