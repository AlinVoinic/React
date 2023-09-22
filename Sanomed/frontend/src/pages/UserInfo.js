import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";

import { AuthContext } from "../components/shared/context/auth-context";
// import ImageUpload from "../components/shared/Form/ImageUpload";

import { useHttpHook } from "../components/shared/hooks/http-hook";
import { useForm } from "../components/shared/hooks/form-hook";
import { ImCancelCircle, ImCheckmark2 } from "react-icons/im";
import LoadingSpinner from "../UI/LoadingSpinner";
import Modal from "../UI/Modal";

import {
  VALID_REQUIRE,
  VALID_NAME,
  VALID_PHONE,
  VALID_ZIP,
  VALID_MAXLENGTH,
} from "../utils/validation";
import ReactDatePicker from "react-datepicker";
import getMonth from "date-fns/getMonth";
import getYear from "date-fns/getYear";
import range from "lodash/range";
import Input from "../components/shared/Form/Input";

import "../components/Auth/User.css";
import "react-datepicker/dist/react-datepicker.css";

const years = range(1920, getYear(new Date()) - 3, 1);
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function UserInfo() {
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const [loadedUser, setLoadedUser] = useState();
  const auth = useContext(AuthContext);
  const userID = useParams().userID;
  const navigate = useNavigate();

  const [postCalendar, setpostCalendar] = useState(null);
  const [gender, setGender] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      telefon: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      city: {
        value: "",
        isValid: false,
      },
      zip: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/user/${userID}`
        );
        setLoadedUser(data.user);
        setFormData(
          {
            telefon: {
              value: data.user.telefon,
              isValid: true,
            },
            address: {
              value: data.user.address,
              isValid: true,
            },
            city: {
              value: data.user.city,
              isValid: true,
            },
            zip: {
              value: data.user.zip,
              isValid: true,
            },
            // image: {
            //   value: data.user.image,
            //   isValid: true,
            // },
          },
          true
        );
        setpostCalendar(new Date(data.user.birthday));
        setGender(data.user.gender);
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, userID, setFormData]);

  const dateConverter = (yourDate) => {
    return new Date(
      yourDate.getTime() - yourDate.getTimezoneOffset() * 60000
    ).toISOString();
  };

  const infoUpdateHandler = async (event) => {
    event.preventDefault();

    try {
      // const formData = new FormData();

      // formData.append("birthday", dateConverter(postCalendar));
      // formData.append("gender", gender);
      // formData.append("telefon", formState.inputs.telefon.value);
      // formData.append("address", formState.inputs.nume.value);
      // formData.append("city", formState.inputs.prenume.value);
      // formData.append("zip", formState.inputs.telefon.value);
      // // formData.append("image", formState.inputs.image.value);

      // await sendRequest(
      //   `http://localhost:5000/api/user/${userID}`,
      //   "PATCH",
      //   formData
      // );
      // navigate("/user");

      await sendRequest(
        `http://localhost:5000/api/user/${userID}`,
        "PATCH",
        JSON.stringify({
          birthday: dateConverter(postCalendar),
          gender: gender,
          telefon: formState.inputs.telefon.value,
          address: formState.inputs.address.value,
          city: formState.inputs.city.value,
          zip: formState.inputs.zip.value,
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
        footer={<ImCancelCircle onClick={clearError}></ImCancelCircle>}
      >
        <p>{error}</p>
      </Modal>
      {isLoading && <LoadingSpinner asOverlay />}

      {!isLoading && loadedUser && (
        <>
          .<div id="spacerrr"></div>
          <div className="app-filler">ADĂUGARE INFORMAȚII PERSONALE</div>
          <form id="form1" className="app-form" onSubmit={infoUpdateHandler}>
            <div className="form-divider">
              <div className="stage2">
                {/* CALENDAR PT ANIVERSARE */}
                <label htmlFor="birthday">Aniversare:</label>
                <div className="calendar">
                  <ReactDatePicker
                    placeholderText={
                      postCalendar
                        ? postCalendar.toLocaleString()
                        : "Selectează data din calendar"
                    }
                    renderCustomHeader={({
                      date,
                      changeYear,
                      changeMonth,
                      decreaseMonth,
                      increaseMonth,
                      prevMonthButtonDisabled,
                      nextMonthButtonDisabled,
                    }) => (
                      <div
                        style={{
                          margin: 10,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <button
                          onClick={decreaseMonth}
                          disabled={prevMonthButtonDisabled}
                        >
                          {"<"}
                        </button>
                        <select
                          value={getYear(date)}
                          onChange={({ target: { value } }) =>
                            changeYear(value)
                          }
                        >
                          {years.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        <select
                          value={months[getMonth(date)]}
                          onChange={({ target: { value } }) =>
                            changeMonth(months.indexOf(value))
                          }
                        >
                          {months.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={increaseMonth}
                          disabled={nextMonthButtonDisabled}
                        >
                          {">"}
                        </button>
                      </div>
                    )}
                    required
                    selected={postCalendar}
                    onChange={(date) => setpostCalendar(date)}
                  />
                </div>
              </div>

              <div className="stage2">
                {/* gender  */}
                <label htmlFor="gender">Sex:</label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={gender}
                  validators={[]}
                  onChange={(event) => setGender(event.target.value)}
                >
                  <option value="" hidden>
                    Selectează-ți sexul
                  </option>
                  <option>Masculin</option>
                  <option>Feminin</option>
                </select>
              </div>
            </div>

            <div className="form-divider">
              <div className="stage2">
                {/* TELEFON */}
                <Input
                  id="telefon"
                  type="text"
                  label="Telefon:"
                  placeholder="ex: 0746029660"
                  validators={[VALID_REQUIRE(), VALID_PHONE()]}
                  errorText="Introduceți un număr valid!"
                  onInput={inputHandler}
                  initialValue={loadedUser.telefon}
                  initialValid={loadedUser.telefon ? true : false}
                />
              </div>

              {/* ADRESA */}
              <div className="stage2">
                <Input
                  id="address"
                  type="text"
                  label="Adresă:"
                  validators={[VALID_REQUIRE(), VALID_MAXLENGTH(40)]}
                  errorText="Introduceți o adresă validă!"
                  onInput={inputHandler}
                  initialValue={loadedUser.address}
                  initialValid={loadedUser.address ? true : false}
                />
              </div>
            </div>

            <div className="form-divider">
              <div className="stage2">
                {/* Oras */}
                <Input
                  id="city"
                  type="text"
                  label="Oraș:"
                  validators={[
                    VALID_REQUIRE(),
                    VALID_NAME(),
                    VALID_MAXLENGTH(20),
                  ]}
                  errorText="Introduceți un oraș valid!"
                  onInput={inputHandler}
                  initialValue={loadedUser.city}
                  initialValid={loadedUser.city ? true : false}
                />
              </div>

              <div className="stage2">
                {/* ZIP */}
                <Input
                  id="zip"
                  type="text"
                  label="Cod ZIP:"
                  validators={[VALID_REQUIRE(), VALID_ZIP()]}
                  errorText="Introduceți un cod ZIP valid!"
                  onInput={inputHandler}
                  initialValue={loadedUser.zip}
                  initialValid={loadedUser.zip ? true : false}
                />
              </div>

              {/* <div className="obs-divider1">
                <label htmlFor="image">Poză de profil:</label>
                <ImageUpload id="image" onInput={inputHandler} />
              </div> */}
            </div>

            <button id="revokeInfo">
              <NavLink id="revokeInfo" to="/user">
                <ImCancelCircle />
              </NavLink>
            </button>

            <button
              type="submit"
              id="submitInfo"
              disabled={!formState.isValid || !postCalendar}
            >
              <ImCheckmark2 />
            </button>
          </form>
          <div className="spacerr">.</div>
        </>
      )}
    </>
  );
}

export default UserInfo;
