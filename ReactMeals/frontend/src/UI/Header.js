import "./Header.css";

function MainHeader(props) {
  return <header className="header">{props.children}</header>;
}

export default MainHeader;
