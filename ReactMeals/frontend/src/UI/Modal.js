import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import Backdrop from "./Backdrop";
import "./Modal.css";

const ModalOverlay = (props) => {
  const content = (
    <div className="modal">
      <header className="modal-header">
        <h2>{props.header}</h2>
      </header>
      <div className="modal-content">{props.children}</div>
      <footer className="modal-footer">{props.footer}</footer>
    </div>
  );
  return createPortal(content, document.getElementById("modal-hook"));
};

const Modal = (props) => {
  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={250}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </>
  );
};

export default Modal;
