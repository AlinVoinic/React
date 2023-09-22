import { Link } from "react-router-dom";

import { MdLocationOn } from "react-icons/md";
import { AiOutlineClockCircle, AiOutlineMail } from "react-icons/ai";
import { SlScreenSmartphone } from "react-icons/sl";
import "./Footer.css";

const MAP =
  "https://www.google.com/maps/place/Strada+Garofi%C8%9Bei+4,+Slatina/@44.4268343,24.3768174,17z/data=!4m6!3m5!1s0x40ad384a549a610b:0x8ffacf69fffbe988!8m2!3d44.4263018!4d24.3792441!16s%2Fg%2F11jn5ks29h";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-div">
        <p>
          <Link className="map" to={MAP} target="_blank">
            <MdLocationOn className="footer-icon" /> Str. Garofitei nr.4,
            Slatina, Olt
          </Link>
        </p>
        <p>
          <SlScreenSmartphone className="footer-icon" /> 023 0108 / +40 746 029
          660
        </p>
        <p>
          <AiOutlineClockCircle className="footer-icon" /> LUNI - VINERI 09:00 -
          18:00
        </p>
        <p>
          <AiOutlineMail className="footer-icon" /> clinica.sanomed@gmail.com
        </p>
      </div>
      {/* <p>@ Copyright 2023 SANOMED SRL. Toate drepturile rezervate.</p> */}
    </footer>
  );
}

export default Footer;
