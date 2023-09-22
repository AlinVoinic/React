import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ImCancelCircle } from "react-icons/im";

import { AuthContext } from "../shared/context/auth-context";
import { useHttpHook } from "../shared/hooks/http-hook";

import LoadingSpinner from "../../UI/LoadingSpinner";
import Modal from "../../UI/Modal";
import "./DoctorReviews.css";

function DoctorReviews(props) {
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const [loadedAutor, setLoadedAutor] = useState();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAutor = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/user/${props.autor}`
        );
        setLoadedAutor(data.user);
      } catch (err) {}
    };
    fetchAutor();
  }, [sendRequest, props]);

  const deleteReviewHandler = async () => {
    try {
      await sendRequest(
        `http://localhost:5000/api/reviews/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );

      props.onDelete(props.id);
      navigate("/");
    } catch (err) {}
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

      {!isLoading && loadedAutor && (
        <div className="reviewCell">
          <div className="reviewUp">
            <div className="upperL">
              <p id="daaa">
                <b>Autor:</b> {loadedAutor.nume} {loadedAutor.prenume}
              </p>
            </div>

            <div className="upperR">
              <p id="daa">
                <b>Notă:</b>
                <span
                  className="starability-result"
                  data-rating={props.rating}
                ></span>
              </p>
            </div>
          </div>

          <div className="reviewUp">
            <div className="lowerL">
              <p id="nu">
                <b>Review:</b> {props.body}
              </p>
            </div>

            <div className="lowerR">
              {props.autor === auth.userID && (
                <button onClick={deleteReviewHandler} id="delete">
                  DELETE
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DoctorReviews;
