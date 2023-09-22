import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { DUMMY_DOCTORS } from "../../pages/Doctors";

import { useForm } from "../shared/hooks/form-hook";
import { useHttpHook } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";
import { ImCancelCircle } from "react-icons/im";
import LoadingSpinner from "../../UI/LoadingSpinner";
import Modal from "../../UI/Modal";

import {
  VALID_REQUIRE,
  VALID_NAME,
  VALID_PHONE,
  VALID_EMAIL,
} from "../../utils/validation";

import ReactDatePicker from "react-datepicker";
import getDay from "date-fns/getDay";
import addDays from "date-fns/addDays";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import "react-datepicker/dist/react-datepicker.css";

import ImageUpload from "../shared/Form/ImageUpload";
import Input from "../shared/Form/Input";
import "./Programare.css";

function Programare() {
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const [loadedDoctors, setLoadedDoctors] = useState();
  const [loadedDoctor, setLoadedDoctor] = useState();
  const [loadedUser, setLoadedUser] = useState();
  const auth = useContext(AuthContext); // sets a listener to our context
  const medicID = useParams().medicID;
  const navigate = useNavigate();

  const [postCalendar, setpostCalendar] = useState(null);
  const [postObs, setPostObs] = useState("");

  const [appointment, setAppointment] = useState({
    category: loadedDoctor ? loadedDoctor.category : "",
    medic: loadedDoctor ? loadedDoctor.name : "",
  });
  const [category, setCategory] = useState(
    loadedDoctor ? loadedDoctor.category : ""
  );

  // console.log(appointment);
  // console.log("----------");
  // console.log(category);

  const [filteredList, setFilteredList] = useState(DUMMY_DOCTORS);

  const [formState, inputHandler, setFormData] = useForm(
    {
      nume: {
        value: "",
        isValid: false,
      },
      prenume: {
        value: "",
        isValid: false,
      },
      telefon: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      image: {
        value: undefined,
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const dataDs = await sendRequest(`http://localhost:5000/api/medici`);
        setLoadedDoctors(dataDs.doctors);
        // DUMMY_DOCTORS[DUMMY_DOCTORS.length - 1].id < 24 &&
        DUMMY_DOCTORS[DUMMY_DOCTORS.length - 1].id =
          dataDs.doctors[dataDs.doctors.length - 1].id;
      } catch (err) {}
    };
    fetchDoctors();

    //
  }, [sendRequest]);

  useEffect(() => {
    if (medicID !== undefined) {
      const fetchDoctor = async () => {
        try {
          const dataD = await sendRequest(
            `http://localhost:5000/api/medici/${medicID}`
          );
          setLoadedDoctor(dataD.doctor);
          setCategory(dataD.doctor.category);
          setAppointment({
            category: dataD.doctor.category,
            medic: dataD.doctor.name,
          });
        } catch (err) {}
      };
      fetchDoctor();
    }
  }, [sendRequest, medicID]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/user/${auth.userID}`
        );
        setLoadedUser(data.user);
        setFormData(
          {
            nume: {
              value: data.user.nume,
              isValid: true,
            },
            prenume: {
              value: data.user.prenume,
              isValid: true,
            },
            telefon: {
              value: data.user.telefon,
              isValid: true,
            },
            email: {
              value: data.user.email,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, auth, setFormData]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    if (event.target.value === "") {
      setFilteredList(loadedDoctors);
    } else {
      const filteredDoctors = loadedDoctors.filter(
        (doctor) => doctor.category === event.target.value
      );
      setFilteredList(filteredDoctors);
    }
    setAppointment({ ...appointment, medic: "" });
  };

  const handleSpecialityChange = (event) => {
    setAppointment({ ...appointment, medic: event.target.value });
  };

  const isWeekday = (date) => {
    const day = getDay(date);
    return day !== 0 && day !== 6;
  };

  const dateConverter = (yourDate) => {
    return new Date(
      yourDate.getTime() - yourDate.getTimezoneOffset() * 60000
    ).toISOString();
  };

  function getIdByName(objects, name) {
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].name === name) {
        return objects[i].id;
      }
    }
    return null;
  }

  const appointmentHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("createdBy", auth.userID);
      formData.append(
        "forDoctor",
        medicID ? medicID : getIdByName(DUMMY_DOCTORS, appointment.medic)
      );
      formData.append("numeDoctor", appointment.medic);
      formData.append("speciality", category);
      formData.append("appData", dateConverter(postCalendar));
      formData.append("numePacient", formState.inputs.nume.value);
      formData.append("prenumePacient", formState.inputs.prenume.value);
      formData.append("telefonPacient", formState.inputs.telefon.value);
      formData.append("emailPacient", formState.inputs.email.value);
      formData.append("obsPacient", postObs);
      formData.append("image", formState.inputs.image.value);

      await sendRequest(
        "http://localhost:5000/api/programare/",
        "POST",
        formData,
        { Authorization: "Bearer " + auth.token }
      );
      navigate("/user");
    } catch (err) {}

    // try {
    //   await sendRequest(
    //     "http://localhost:5000/api/programare/",
    //     "POST",
    //     JSON.stringify({
    //       createdBy: auth.userID,
    //       forDoctor: medicID ? medicID : "647a252451449e00d09d2bb1",
    //       numeDoctor: appointment.medic,
    //       speciality: category,
    //       appData: dateConverter(postCalendar),
    //       numePacient: formState.inputs.nume.value,
    //       prenumePacient: formState.inputs.prenume.value,
    //       telefonPacient: formState.inputs.telefon.value,
    //       emailPacient: formState.inputs.email.value,
    //       obsPacient: postObs,
    //     }),
    //     { "Content-Type": "application/json" }
    //   );
    //   navigate("/user");
    // } catch (err) {}
  };

  // console.log(DUMMY_DOCTORS);

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

      {!isLoading && loadedUser && (medicID ? loadedDoctor : loadedDoctors) && (
        <>
          <div className="app-filler">PROGRAMARE ONLINE</div>

          <form
            id="form"
            className="app-form"
            onSubmit={appointmentHandler}
            encType="multipart/form-data"
          >
            <div className="form-divider">
              <div className="stage1">
                <label htmlFor="category">Specialitatea: </label>
                <select
                  element="select"
                  id="category"
                  name="category"
                  label="Specialitatea:"
                  required
                  value={category}
                  validators={[]}
                  onChange={handleCategoryChange}
                >
                  <option value="">Selectează specialitatea</option>
                  {medicID
                    ? DUMMY_DOCTORS.map((doctor) => doctor.category)
                        .filter(
                          (category, index, self) =>
                            self.indexOf(category) === index
                        )
                        .sort()
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))
                    : loadedDoctors
                        .map((doctor) => doctor.category)
                        .filter(
                          (category, index, self) =>
                            self.indexOf(category) === index
                        )
                        .sort()
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                </select>
              </div>
              <div className="stage1">
                <label htmlFor="medic">Medicul dorit: </label>
                <select
                  id="medic"
                  name="medic"
                  required
                  value={appointment.medic}
                  onChange={handleSpecialityChange}
                  disabled={category === ""}
                >
                  <option value="" hidden>
                    Selectează un medic
                  </option>
                  {/* {[loadedDoctors].map((doctor) => ( */}
                  {filteredList.sort().map((doctor) => (
                    <option key={doctor.id} value={doctor.name}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CALENDARUL CU PROGRAMARI */}
            <label htmlFor="calendar">Data programării:</label>
            <div className="calendar">
              <ReactDatePicker
                placeholderText={
                  postCalendar
                    ? postCalendar.toLocaleString()
                    : "Selectează o dată din calendar"
                }
                id="calendar"
                element="calendar"
                name="calendar"
                form="form"
                required
                showTimeSelect
                showWeekNumbers
                selected={postCalendar}
                onChange={(date) => setpostCalendar(date)}
                minDate={addDays(new Date(), 1)}
                maxDate={addDays(new Date(), 30)}
                minTime={setHours(setMinutes(new Date(), 0), 9)}
                maxTime={setHours(setMinutes(new Date(), 30), 17)}
                filterDate={isWeekday}
                calendarStartDay={1}
                timeFormat="HH:mm"
                timeIntervals={30}
                timeCaption="Ora"
                dateFormat="d MMMM yyyy, HH:mm aaa"
                //excludeDates={[new Date("2023-05-12T14:00:00.000Z")]} // full days
                excludeTimes={[
                  setHours(setMinutes(new Date(), 0), 13),
                  setHours(setMinutes(new Date(), 30), 13),
                ]}
                popperPlacement="bottom"
              />
            </div>

            {/* NUME */}
            <div className="form-divider">
              <div className="stage1">
                <Input
                  id="nume"
                  type="text"
                  label="Nume:"
                  validators={[VALID_REQUIRE(), VALID_NAME()]}
                  errorText="Introduceți un nume valid!"
                  onInput={inputHandler}
                  initialValue={loadedUser.nume}
                  initialValid={loadedUser.nume ? true : false}
                />
              </div>

              {/* PRENUME */}
              <div className="stage1">
                <Input
                  id="prenume"
                  type="text"
                  label="Prenume:"
                  validators={[VALID_REQUIRE(), VALID_NAME()]}
                  errorText="Introduceți un prenume valid!"
                  onInput={inputHandler}
                  initialValue={loadedUser.prenume}
                  initialValid={loadedUser.prenume ? true : false}
                />
              </div>

              {/* TELEFON */}
              <div className="stage1">
                <Input
                  id="telefon"
                  type="text"
                  label="Telefon:"
                  placeholder="ex: 0746029660"
                  validators={[VALID_REQUIRE(), VALID_PHONE()]}
                  errorText="Introduceți un număr de telefon valid!"
                  onInput={inputHandler}
                  initialValue={loadedUser.telefon}
                  initialValid={loadedUser.telefon ? true : false}
                />
              </div>

              {/* eMAIL */}
              <div className="stage1">
                <Input
                  id="email"
                  type="email"
                  label="E-mail:"
                  validators={[VALID_REQUIRE(), VALID_EMAIL()]}
                  errorText="Introduceți o adresă de e-mail validă!"
                  onInput={inputHandler}
                  initialValue={loadedUser.email}
                  initialValid={loadedUser.email ? true : false}
                />
              </div>
            </div>

            {/* OBSERVATII */}
            <label htmlFor="obs">Observații (opțional):</label>
            <textarea
              id="obs"
              element="textarea"
              rows="5"
              label="Observații:"
              value={postObs}
              placeholder="Oferiți informații adiționale medicului, dacă este cazul"
              onChange={(event) => setPostObs(event.target.value)}
            />

            {/* IMAGINE */}
            <label htmlFor="image">Documente:</label>
            <ImageUpload id="image" onInput={inputHandler} />

            <button id="revokeInfo1">
              <NavLink to="/medici">
                <ImCancelCircle />
              </NavLink>
            </button>
            <button
              className="submitAppointment"
              type="submit"
              disabled={
                !formState.isValid || !postCalendar || !appointment || !category
              }
            >
              Programează-te!
            </button>
          </form>
        </>
      )}
    </>
  );
}

export default Programare;
