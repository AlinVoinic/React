import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../shared/context/auth-context";

import doctor from "../../images/medic_home.png";
import fata1 from "../../images/fata1.jpg";
import "./Home.css";

function Home() {
  const auth = useContext(AuthContext);

  return (
    <>
      <div className="after-navbar">
        <div className="start">
          <h1>CENTRUL MEDICAL SANOMED </h1>
          <h2>Pentru tine și familia ta</h2>
        </div>
        <div className="sidebyside">
          <img className="heart" src={fata1} alt="doctors" />
          <ul className="home-list">
            <li>
              Centrul Medical <span id="sanomed">Sanomed</span> vă întâmpină cu
              o gamă variată de servicii medicale, cu personal medical de
              specialitate calificat și aparatură de ultimă generație.
            </li>
            <br />
            <li>
              În locația amenajată dupa cele mai înalte standarde, veți găsi:
              cabinete de consultații, punct de recoltare, laborator pentru
              analize medicale și medicina muncii.
            </li>
            <br />
            <li>
              Serviciile medicale <span id="sanomed">Sanomed</span> pot fi
              achitate prin plată directă în momentul prezentării la clinică sau
              prin decontare CAS, pe baza unui bilet de trimitere de la medicul
              de familie sau specialist!
            </li>
          </ul>
        </div>
      </div>

      <div className="despartire">
        <h2>De ce să alegi SANOMED</h2>
      </div>
      <div className="pre-footer">
        <img className="doctorz" src={doctor} alt="medic pre footer" />
        <div className="home-list1">
          <p>
            <span id="qa">Dorești rapid o consultație?</span> Programează-te
            acum folosind{" "}
            <Link to={auth.isLoggedIn ? "/programare" : "/autentificare"}>
              formularul de programare online
            </Link>
            .
          </p>
          <br />
          <p>
            <span id="qa">Dorești sa îți cunoști medicul?</span> Poți afla mai
            multe detalii consultând{" "}
            <Link to="/medici">lista medicilor Sanomed</Link>.
          </p>
          <br />
          <p id="final">
            La <span id="sanomed">Sanomed</span> vă oferim servicii medicale
            potrivite vouă și familiei dumneavoastră, iar pacienții noștri fac
            parte din familie. Tocmai de aceea îi tratăm cu demnitate și respect
            atunci când oferim serviciile noastre de calitate la prețuri
            rezonabile.
          </p>
        </div>
      </div>
    </>
  );
}

export default Home;
