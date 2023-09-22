import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { AuthContext } from "../components/shared/context/auth-context";
import { useHttpHook } from "../components/shared/hooks/http-hook";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ImCancelCircle } from "react-icons/im";

import LoadingSpinner from "../UI/LoadingSpinner";
import PageContent from "../UI/PageContent";
import Modal from "../UI/Modal";

import "../components/Auth/Programari.css";

function AppointmentInfo() {
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const auth = useContext(AuthContext);
  const appID = useParams().appID;
  const navigate = useNavigate();

  const [showDeleteApp, setShowDeleteApp] = useState(false);
  const [loadedApp, setLoadedApp] = useState();

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/programare/${appID}`
        );
        setLoadedApp(data.app);
      } catch (err) {}
    };
    fetchApp();
  }, [sendRequest, appID]);

  const toggleDeleteAppModal = () => {
    setShowDeleteApp((prevState) => !prevState);
  };

  const confirmDeleteHandler = async () => {
    setShowDeleteApp(false);

    try {
      await sendRequest(
        `http://localhost:5000/api/programare/${loadedApp.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );

      navigate("/user");
    } catch (err) {}
  };

  const forDeleteFooter = (
    <span className="modal-buttons">
      <ImCancelCircle onClick={toggleDeleteAppModal} />
      <RiDeleteBin6Line onClick={confirmDeleteHandler} />
    </span>
  );

  function convertDate(inputFormat) {
    function pad(s) {
      return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);

    const data = [
      pad(d.getDate()),
      pad(d.getMonth() + 1),
      d.getFullYear(),
    ].join(".");

    const time = inputFormat.split("T")[1].slice(0, 5);

    return `${data} | ${time}`;
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

      {!isLoading && loadedApp && (
        <PageContent title="Programarea mea - SANOMED">
          <>
            <Modal
              key={loadedApp.appData}
              show={showDeleteApp}
              onCancel={toggleDeleteAppModal}
              header={`Anulare programare?`}
              footer={forDeleteFooter}
            >
              <p>Sunteți sigur că doriți să anulați această programare?</p>
              {/* <p>
                <b>Data:</b> {convertDate(loadedApp.appData)}
              </p>
              <p>
                <b>Pacient:</b> {loadedApp.numePacient}{" "}
                {loadedApp.prenumePacient}
              </p>
              <p>
                <b>Doctor:</b> {loadedApp.numeDoctor}
              </p>
              <p>
                <b>Specializare:</b> {loadedApp.speciality}
              </p> */}
            </Modal>

            <div className="app-filler">PROGRAMAREA #{loadedApp.id}</div>
            <div className="info-divider">
              <div className="row-divider">
                <div className="stage3">
                  <label>Doctorul: </label>
                  <p>{loadedApp.numeDoctor}</p>
                </div>

                <div className="stage3">
                  <label>Data programării: </label>
                  <p>{convertDate(loadedApp.appData)}</p>
                </div>
              </div>

              <div className="row-divider">
                <div className="stage3">
                  <label>Pacientul: </label>
                  <p>
                    {loadedApp.numePacient} {loadedApp.prenumePacient}
                  </p>
                </div>

                <div className="stage3">
                  <label>Adresă E-mail: </label>
                  <p>{loadedApp.emailPacient}</p>
                </div>
              </div>

              <div className="row-divider">
                <div className="stage3">
                  <label>Specialitatea: </label>
                  <p>{loadedApp.speciality}</p>
                </div>

                <div className="stage3">
                  <label>Număr telefon: </label>
                  <p>{loadedApp.telefonPacient}</p>
                </div>
              </div>

              <div className="obs-divider">
                <label>Observații: </label>
                <p>
                  {loadedApp.obsPacient
                    ? loadedApp.obsPacient
                    : "-------------"}
                </p>
              </div>

              <div className="obs-divider">
                <label>Fișier atașat: </label>
                <img
                  className="appPic"
                  src={`http://localhost:5000/${loadedApp.image}`}
                  alt={"Niciun fișier atașat!"}
                ></img>
              </div>

              {new Date(loadedApp.appData.slice(0, -1)) > new Date() && (
                <button id="deleteP" onClick={toggleDeleteAppModal}>
                  ANULEAZĂ PROGRAMAREA
                </button>
              )}
            </div>
          </>
        </PageContent>
      )}
    </>
  );
}

export default AppointmentInfo;
