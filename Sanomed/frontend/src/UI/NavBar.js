import { useState } from "react";
import { Link } from "react-router-dom";

import Header from "./Header";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "./Backdrop";

import logo from "../images/sanomed.png";
import "./NavBar.css";

function NavBar() {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerIsOpen((prevState) => !prevState);
  };

  return (
    <>
      {drawerIsOpen && <Backdrop onClick={toggleDrawer} />}
      <SideDrawer show={drawerIsOpen} onClick={toggleDrawer}>
        <nav className="drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <Header className="header">
        <button className="menu-btn" onClick={toggleDrawer}>
          <span />
          <span />
          <span />
        </button>
        <Link to="/">
          <img src={logo} alt="" className="logo" />
        </Link>
        <nav className="header-nav">
          <NavLinks />
        </nav>
      </Header>
    </>
  );
}

export default NavBar;
