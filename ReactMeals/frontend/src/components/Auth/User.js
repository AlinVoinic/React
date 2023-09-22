import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../shared/context/auth-context";
import { useHttpHook } from "../shared/hooks/http-hook";
import { ImCancelCircle } from "react-icons/im";
import Programari from "./Programari";
import LoadingSpinner from "../../UI/LoadingSpinner";
import Modal from "../../UI/Modal";
import "./User.css";

function User(props) {
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const [loadedApps, setLoadedApps] = useState();
  const [loadedPastApps, setLoadedPastApps] = useState();
  const [loadedFutureApps, setLoadedFutureApps] = useState();
  const auth = useContext(AuthContext);
  const user = props.info;

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/programare/user/${user.id}`
        );
        setLoadedApps(data.apps);
        setLoadedPastApps(pastApps(data.apps));
        setLoadedFutureApps(futureApps(data.apps));
      } catch (err) {}
    };
    fetchApps();
  }, [sendRequest, user]);

  // console.log(loadedApps);

  function convertDate(inputFormat) {
    function pad(s) {
      return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join(".");
  }

  function pastApps(appArray) {
    const pastApp = appArray.filter(
      (app) => new Date(app.appData.slice(0, -1)) < new Date()
    );
    return pastApp.length;
  }

  function futureApps(appArray) {
    const pastApp = appArray.filter(
      (app) => new Date(app.appData.slice(0, -1)) > new Date()
    );
    return pastApp.length;
  }

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

      {!isLoading && loadedApps && (
        <>
          <div className="user-page">
            <div className="left-info">
              <img
                className="user-image"
                src={`http://localhost:5000/uploads/images/user_image.png`}
                alt="profil_user"
              />
              <h3 className="user-name">
                {user.nume} {user.prenume}
              </h3>
              <p className="user-mail">{user.email}</p>
              <p id="prgmr">
                <b>PROGRAMĂRI</b>
              </p>
              <div className="apps">
                <div className="left">
                  <span>{loadedPastApps}</span>
                  <p>Anterioare</p>
                </div>
                <div className="right">
                  <span>{loadedFutureApps}</span>
                  <p>Următoare</p>
                </div>
              </div>
            </div>

            <div className="right-info">
              <div className="right-left">
                <div className="sectiune">
                  <p>
                    <b>Adresă:</b>
                  </p>
                  <p>{user.address === "" ? "---------" : user.address}</p>
                </div>
                <div className="sectiune">
                  <p>
                    <b>Oraș:</b>
                  </p>
                  <p>{user.city === "" ? "------" : user.city}</p>
                </div>
                <div className="sectiune">
                  <p>
                    <b>ZIP:</b>
                  </p>
                  <p>{user.zip === "" ? "------" : user.zip}</p>
                </div>
                <Link id="navInfo" to={`/user/${user.id}`}>
                  <button className="Info">Informații</button>
                </Link>
              </div>
              <div className="right-right">
                <div className="sectiune">
                  <p>
                    <b>Aniversare:</b>
                  </p>
                  <p>
                    {user.birthday === null
                      ? "DD/MM/YYYY"
                      : convertDate(user.birthday)}
                  </p>
                </div>
                <div className="sectiune">
                  <p>
                    <b>Telefon:</b>
                  </p>
                  <p>{user.telefon === "" ? "----------" : user.telefon}</p>
                </div>
                <div className="sectiune">
                  <p>
                    <b>Gen:</b>
                  </p>
                  <p>{user.gender === "" ? "-------" : user.gender}</p>
                </div>
                <Link to="/autentificare">
                  <button className="logout" onClick={auth.logout}>
                    Delogare
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="appointment-layout">
            <Programari apps={loadedApps} />
          </div>
        </>
      )}
    </>
  );
}

export default User;
