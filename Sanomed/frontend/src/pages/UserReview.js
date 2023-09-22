import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { ImCheckmark2 } from "react-icons/im";

import { AuthContext } from "../components/shared/context/auth-context";
import { useHttpHook } from "../components/shared/hooks/http-hook";
import { ImCancelCircle } from "react-icons/im";
import LoadingSpinner from "../UI/LoadingSpinner";
import PageContent from "../UI/PageContent";
import Modal from "../UI/Modal";

import {
  VALID_REQUIRE,
  VALID_MINLENGTH,
  VALID_MAXLENGTH,
} from "../utils/validation";

function UserReview() {
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const auth = useContext(AuthContext);
  const medicID = useParams().medicID;
  const navigate = useNavigate();

  const [loadedDoctor, setLoadedDoctor] = useState();
  const [rating, setRating] = useState();
  const [body, setBody] = useState();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/medici/${medicID}`
        );
        setLoadedDoctor(data.doctor);
      } catch (err) {}
    };
    fetchDoctor();
  }, [sendRequest, medicID]);

  const createReviewHandler = async (event) => {
    event.preventDefault();

    try {
      await sendRequest(
        `http://localhost:5000/api/reviews/`,
        "POST",
        JSON.stringify({
          body: body,
          rating: rating,
          autor: auth.userID,
          destinatar: medicID,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      navigate("/user");
    } catch (err) {}
  };

  return (
    <>
      <Modal
        show={!!error}
        onCancel={clearError}
        header="A apărut o eroare!"
        footer={<ImCancelCircle onClick={clearError} />}
      >
        <p>{error}</p>
      </Modal>

      {isLoading && <LoadingSpinner asOverlay />}

      {!isLoading && loadedDoctor && (
        <PageContent title="Contul meu - SANOMED">
          .
          <div className="app-filler">
            Oferiți un review Dr. {loadedDoctor.name}
          </div>
          <form id="form1" className="app-form" onSubmit={createReviewHandler}>
            <div className="reviewR">
              <fieldset
                className="starability-basic"
                required
                onChange={(event) => setRating(event.target.value)}
              >
                <legend>
                  <label>Nota oferită:</label>
                </legend>
                <input
                  type="radio"
                  id="no-rate"
                  className="input-no-rate"
                  name="rating"
                  value="-1"
                  defaultChecked
                  aria-label="No rating."
                />
                <input type="radio" id="first-rate1" name="rating" value="1" />
                <label htmlFor="first-rate1" title="Nu recomand!">
                  1 stea
                </label>
                <input type="radio" id="first-rate2" name="rating" value="2" />
                <label htmlFor="first-rate2" title="Not good">
                  2 stele
                </label>
                <input type="radio" id="first-rate3" name="rating" value="3" />
                <label htmlFor="first-rate3" title="OK">
                  3 stele
                </label>
                <input type="radio" id="first-rate4" name="rating" value="4" />
                <label htmlFor="first-rate4" title="Very good">
                  4 stele
                </label>
                <input type="radio" id="first-rate5" name="rating" value="5" />
                <label htmlFor="first-rate5" title="Recomand!">
                  5 stele
                </label>
              </fieldset>

              <br></br>
              <label htmlFor="comm">Comentariu:</label>
              <textarea
                required
                minLength={20}
                maxLength={500}
                id="comm"
                element="textarea"
                name="comm"
                rows="5"
                value={body}
                placeholder={`Atenție, recenzia este unică! \nDescrieți, folosind între 20 și 500 de caractere, experiența oferită de doctorul ${loadedDoctor.name}`}
                validators={[
                  VALID_REQUIRE(),
                  VALID_MINLENGTH(20),
                  VALID_MAXLENGTH(500),
                ]}
                onChange={(event) => setBody(event.target.value)}
              />
            </div>
            <button id="revokeInfo">
              <NavLink id="revokeInfo" to="/user">
                <ImCancelCircle />
              </NavLink>
            </button>
            <button
              type="submit"
              id="submitInfo"
              disabled={!rating || !body || (body.length < 20 ? true : false)}
            >
              <ImCheckmark2 />
            </button>
          </form>
          <div className="spacerrrr">.</div>
        </PageContent>
      )}
    </>
  );
}

export default UserReview;
