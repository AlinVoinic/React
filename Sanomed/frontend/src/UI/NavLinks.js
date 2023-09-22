import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../components/shared/context/auth-context";
import classes from "./NavLinks.css";

function NavLinks() {
  const auth = useContext(AuthContext);
  const isDoctor = false; // utilizator DOCTOR

  let nav;
  if (!auth.isAdmin) nav = "Contul meu";
  if (!auth.isLoggedIn) nav = "Autentificare";

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">Acasă</NavLink>
      </li>
      {!isDoctor && (
        <li>
          {" "}
          <NavLink to="/medici">Medici</NavLink>
        </li>
      )}

      <li>
        {auth.isLoggedIn && auth.isAdmin ? (
          <Link onClick={auth.logout} to="/autentificare">
            DELOGARE
          </Link>
        ) : (
          !isDoctor && (
            <NavLink
              to={auth.isLoggedIn ? "/programare" : "/autentificare"}
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Programare
            </NavLink>
          )
        )}
      </li>

      <li>
        <NavLink to={auth.isLoggedIn ? "/user" : "/autentificare"}>
          {nav}
        </NavLink>
      </li>
    </ul>
  );
}

export default NavLinks;
