import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../shared/context/auth-context";
import { useHttpHook } from "../shared/hooks/http-hook";

import { CiStethoscope, CiHospital1 } from "react-icons/ci";
import { ImCancelCircle } from "react-icons/im";
import { FaUserGraduate } from "react-icons/fa";
import {
  RiStarSLine,
  RiUserSearchLine,
  RiSendPlaneFill,
  RiDeleteBin6Line,
} from "react-icons/ri";

import LoadingSpinner from "../../UI/LoadingSpinner";
import Modal from "../../UI/Modal";

import DoctorReviews from "./DoctorReviews";
import "./DoctorItem.css";
import { DUMMY_DOCTORS } from "../../pages/Doctors";

// parinte: /pages/DoctorList
function DoctorItem(props) {
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [reviews, setReviews] = useState(props.reviews);
  const [showDoctor, setShowDoctor] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const toggleDoctorModal = () => {
    setShowDoctor((prevState) => !prevState);
  };
  const toggleReviewModal = () => {
    setShowReview((prevState) => !prevState);
  };
  const toggleDeleteModal = () => {
    setShowDelete((prevState) => !prevState);
  };

  const confirmDeleteHandler = async () => {
    setShowDelete(false);

    try {
      await sendRequest(
        `http://localhost:5000/api/medici/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );

      props.onDelete(props.id);
      removeDoctor(DUMMY_DOCTORS, props.name);
      navigate("/medici");
    } catch (err) {}
  };

  function removeDoctor(objects, name) {
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].name === name) {
        return objects.filter((object) => object.name !== name);
      }
    }
    return null;
  }

  const forDoctorFooter = (
    <span className="modal-buttons">
      <ImCancelCircle onClick={toggleDoctorModal} />
      {!auth.isAdmin && (
        <Link
          to={auth.isLoggedIn ? `/programare/${props.id}` : "/autentificare"}
        >
          <RiSendPlaneFill />
        </Link>
      )}
    </span>
  );
  const forReviewFooter = (
    <span className="modal-buttons">
      <ImCancelCircle onClick={toggleReviewModal} />
    </span>
  );
  const forDeleteFooter = (
    <span className="modal-buttons">
      <ImCancelCircle onClick={toggleDeleteModal} />
      <RiDeleteBin6Line onClick={confirmDeleteHandler} />
    </span>
  );

  const onDeleteReview = (deletedReviewId) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== deletedReviewId)
    );
  };

  return (
    <>
      <Modal
        show={showReview}
        onCancel={toggleReviewModal}
        header={`Review-urile Dr. ${props.name}`}
        footer={forReviewFooter}
      >
        <div className="review-body">
          {reviews.map((review) => (
            <DoctorReviews
              key={review.id}
              id={review.id}
              body={review.body}
              rating={review.rating}
              autor={review.autor}
              destinatar={review.destinatar}
              onDelete={onDeleteReview}
            />
          ))}
        </div>
      </Modal>

      <Modal
        show={showDoctor}
        onCancel={toggleDoctorModal}
        header={`Dr. ${props.name}`}
        footer={forDoctorFooter}
      >
        <div className="modal-body">
          <p>
            <RiUserSearchLine
              className="doctor-star"
              style={{ fontSize: "18px" }}
            />
            <b> Competențe:</b>
          </p>
          <span>{props.competences}</span>
          <p>
            <CiHospital1 className="doctor-star" style={{ fontSize: "20px" }} />
            <b> Experiență:</b>
          </p>
          <span>{props.experience}</span>
          <p style={{ paddingLeft: "0.15rem" }}>
            <FaUserGraduate
              className="doctor-star"
              style={{ fontSize: "17px" }}
            />
            <b style={{ paddingLeft: "0.15rem" }}> Educație:</b>
          </p>
          <span>{props.education}</span>
        </div>
      </Modal>

      <Modal
        show={showDelete}
        onCancel={toggleDeleteModal}
        header={`Ștergere ${props.name}?`}
        footer={forDeleteFooter}
      >
        <p>Sunteți sigur doriți să ștergeți acest doctor? </p>
      </Modal>

      <Modal
        show={!!error}
        onCancel={clearError}
        header="A apărut o eroare!"
        footer={<ImCancelCircle onClick={clearError}></ImCancelCircle>}
      >
        <p>{error}</p>
      </Modal>
      {isLoading && <LoadingSpinner asOverlay />}

      <li className="doctor-item">
        <img
          onClick={toggleDoctorModal}
          className="doctor-image"
          src={`http://localhost:5000/${props.image}`}
          alt={props.name}
        />
        <div className="doctor-info">
          <h3 onClick={toggleDoctorModal}>{`Dr. ${props.name}`}</h3>
          <p>
            <CiStethoscope className="doctor-icon" /> {props.category}
          </p>
          <div>
            <p onClick={toggleReviewModal} className="doctor-review">
              <RiStarSLine className="doctor-star" />{" "}
              {`${props.rating.toFixed(2)}/5 (${props.reviews.length}
            ${props.reviews.length === 1 ? "recenzie" : "recenzii"})`}
            </p>
          </div>
          {!auth.isAdmin && (
            <div className="doctor-appointment">
              <Link
                to={
                  auth.isLoggedIn ? `/programare/${props.id}` : "/autentificare"
                }
              >
                <button>PROGRAMARE CONSULTAȚIE</button>
              </Link>
            </div>
          )}

          {/* PARTEA DE ADMINISTRATOR */}
          {auth.isLoggedIn && auth.isAdmin && (
            <div className="doctor-appointment-admin">
              <Link id="edit" to={`/medici/editare/${props.id}`}>
                EDIT
              </Link>
              <button onClick={toggleDeleteModal} id="delete">
                DELETE
              </button>
            </div>
          )}
        </div>
      </li>
    </>
  );
}

export default DoctorItem;
