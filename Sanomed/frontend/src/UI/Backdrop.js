import { createPortal } from "react-dom";
import "./Backdrop.css";

function Backdrop(props) {
  const content = <div className="backdrop" onClick={props.onClick} />;
  return createPortal(content, document.getElementById("backdrop-hook"));
}

export default Backdrop;
