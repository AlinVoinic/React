import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";

import Input from "../shared/Form/Input";
import ImageUpload from "../shared/Form/ImageUpload";
import { useForm } from "../shared/hooks/form-hook";
import { useHttpHook } from "../shared/hooks/http-hook";
import { AuthContext } from "../shared/context/auth-context";

import { ImCancelCircle } from "react-icons/im";
import LoadingSpinner from "../../UI/LoadingSpinner";
import Modal from "../../UI/Modal";

import {
  VALID_REQUIRE,
  VALID_MINLENGTH,
  VALID_NAME,
} from "../../utils/validation";

import PageContent from "../../UI/PageContent";
import "../Appointment/Programare.css";

function DoctorEdit() {
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const [loadedDoctor, setLoadedDoctor] = useState();
  const auth = useContext(AuthContext);
  const medicID = useParams().medicID;
  const navigate = useNavigate();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      category: {
        value: "",
        isValid: false,
      },
      competences: {
        value: "",
        isValid: false,
      },
      experience: {
        value: "",
        isValid: false,
      },
      education: {
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
    const fetchDoctor = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/medici/${medicID}`
        );
        setLoadedDoctor(data.doctor);
        setFormData(
          {
            name: {
              value: data.doctor.name,
              isValid: true,
            },
            category: {
              value: data.doctor.category,
              isValid: true,
            },
            competences: {
              value: data.doctor.competences,
              isValid: true,
            },
            experience: {
              value: data.doctor.experience,
              isValid: true,
            },
            education: {
              value: data.doctor.education,
              isValid: true,
            },
            // image: {
            //   value: data.doctor.image,
            //   isValid: true,
            // },
          },
          true
        );
      } catch (err) {}
    };
    fetchDoctor();
  }, [sendRequest, medicID, setFormData]);

  const doctorEditHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("category", formState.inputs.category.value);
      formData.append("competences", formState.inputs.competences.value);
      formData.append("experience", formState.inputs.experience.value);
      formData.append("education", formState.inputs.education.value);
      formData.append("image", formState.inputs.image.value);

      await sendRequest(
        `http://localhost:5000/api/medici/${medicID}`,
        "PATCH",
        formData,
        { Authorization: "Bearer " + auth.token }
      );
      navigate("/medici");

      // await sendRequest(
      //   `http://localhost:5000/api/medici/${medicID}`,
      //   "PATCH",
      //   JSON.stringify({
      //     name: formState.inputs.name.value,
      //     category: formState.inputs.category.value,
      //     competences: formState.inputs.competences.value,
      //     experience: formState.inputs.experience.value,
      //     education: formState.inputs.education.value,
      //   }),
      //   {
      //     "Content-Type": "application/json",
      //     Authorization: "Bearer " + auth.token,
      //   }
      // );
      // navigate("/medici");
    } catch (err) {
      // console.log(err);
    }
  };

  if (!loadedDoctor && !error && !isLoading) {
    return (
      <div className="center">
        <PageContent>
          <div className="spacer">
            <h1>Medicul nu a fost găsit!</h1>
          </div>
        </PageContent>
      </div>
    );
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

      {!isLoading && loadedDoctor && (
        <>
          <div className="app-filler">EDITARE MEDIC</div>
          <form className="app-form">
            <Input
              id="name"
              type="text"
              label="Nume medic:"
              placeholder="ex: Dr. Nume Prenume"
              validators={[VALID_REQUIRE(), VALID_NAME()]}
              errorText="Introdu numele medicului!"
              onInput={inputHandler}
              initialValue={loadedDoctor.name}
              initialValid={true}
            />

            <Input
              id="category"
              type="text"
              label="Specialitatea:"
              placeholder="ex: Cardiologie"
              validators={[VALID_REQUIRE(), VALID_MINLENGTH(3)]}
              errorText="Introdu specialitatea medicului!"
              onInput={inputHandler}
              initialValue={loadedDoctor.category}
              initialValid={true}
            />

            <Input
              id="competences"
              type="text"
              label="Competențe:"
              placeholder="ex: 2 ani experiență cu EKG"
              validators={[VALID_REQUIRE()]}
              errorText="Introdu competențele medicului!"
              onInput={inputHandler}
              initialValue={loadedDoctor.competences}
              initialValid={true}
            />

            <Input
              id="experience"
              type="text"
              label="Experiență:"
              placeholder="ex: 2021 - prezent: Medic cardiolog - Spitalul Clinic de Urgenta Slatina"
              validators={[VALID_REQUIRE()]}
              errorText="Introdu experiența medicului!"
              onInput={inputHandler}
              initialValue={loadedDoctor.experience}
              initialValid={true}
            />

            <Input
              id="education"
              type="text"
              label="Educație:"
              placeholder="ex: Universitatea de Medicina si Farmacie din Craiova (2021)"
              validators={[VALID_REQUIRE()]}
              errorText="Introdu educația medicului!"
              onInput={inputHandler}
              initialValue={loadedDoctor.education}
              initialValid={true}
            />

            <label htmlFor="image">Poza de profil (opțional):</label>
            <ImageUpload id="image" onInput={inputHandler} />

            <button id="revokeInfo1">
              <NavLink to="/medici">
                <ImCancelCircle />
              </NavLink>
            </button>

            <button
              className="submitAppointment"
              type="submit"
              onClick={doctorEditHandler}
              disabled={!formState.isValid}
            >
              Editează doctorul!
            </button>
          </form>
        </>
      )}
    </>
  );
}

export default DoctorEdit;
