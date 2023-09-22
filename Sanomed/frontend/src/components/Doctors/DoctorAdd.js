import { useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";

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

import "../Appointment/Programare.css";
import { DUMMY_DOCTORS } from "../../pages/Doctors";

function DoctorAdd() {
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [formState, inputHandler] = useForm(
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

  const doctorAddHandler = async (event) => {
    event.preventDefault();

    DUMMY_DOCTORS.push({
      id: formState.inputs.name.value,
      imageURL:
        "https://lisimed.ro/wp-content/uploads/2020/07/26445461-Lisimed-Avatar-Placeholder-EA.jpg",
      name: formState.inputs.name.value,
      category: formState.inputs.category.value,
      rating: 0,
      reviews: 0,
      competences: formState.inputs.competences.value,
      experience: formState.inputs.experience.value,
      education: formState.inputs.education.value,
    });

    try {
      const formData = new FormData();
      formData.append("name", formState.inputs.name.value);
      formData.append("category", formState.inputs.category.value);
      formData.append("competences", formState.inputs.competences.value);
      formData.append("experience", formState.inputs.experience.value);
      formData.append("education", formState.inputs.education.value);
      formData.append("image", formState.inputs.image.value);

      await sendRequest("http://localhost:5000/api/medici/", "POST", formData, {
        Authorization: "Bearer " + auth.token,
      });
      navigate("/medici");

      // const data = await sendRequest(
      //   "http://localhost:5000/api/medici/",
      //   "POST",
      //   JSON.stringify({
      //     name: formState.inputs.name.value,
      //     category: formState.inputs.category.value,
      //     competences: formState.inputs.competences.value,
      //     experience: formState.inputs.experience.value,
      //     education: formState.inputs.education.value,
      //   }),
      //   { "Content-Type": "application/json" }
      // );
      // navigate("/medici");
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

      <div className="app-filler">ADĂUGARE MEDIC</div>
      <form className="app-form" onSubmit={doctorAddHandler}>
        <Input
          id="name"
          type="text"
          label="Nume medic:"
          placeholder="ex: Dr. Nume Prenume"
          validators={[VALID_REQUIRE(), VALID_NAME()]}
          errorText="Introdu numele medicului!"
          onInput={inputHandler}
        />
        <Input
          id="category"
          type="text"
          label="Specialitatea:"
          placeholder="ex: Cardiologie"
          validators={[VALID_REQUIRE(), VALID_MINLENGTH(3)]}
          errorText="Introdu specialitatea medicului!"
          onInput={inputHandler}
        />
        <Input
          id="competences"
          type="text"
          label="Competențe:"
          placeholder="ex: 2 ani experiență cu EKG"
          validators={[VALID_REQUIRE()]}
          errorText="Introdu competențele medicului!"
          onInput={inputHandler}
        />
        <Input
          id="experience"
          type="text"
          label="Experiență:"
          placeholder="ex: 2021 - prezent: Medic cardiolog - Spitalul Clinic de Urgenta Slatina"
          validators={[VALID_REQUIRE()]}
          errorText="Introdu experiența medicului!"
          onInput={inputHandler}
        />
        <Input
          id="education"
          type="text"
          label="Educație:"
          placeholder="ex: Universitatea de Medicina si Farmacie din Craiova (2021)"
          validators={[VALID_REQUIRE()]}
          errorText="Introdu educația medicului!"
          onInput={inputHandler}
        />

        <label htmlFor="image">Poza de profil:</label>
        <ImageUpload id="image" onInput={inputHandler} required />

        <button id="revokeInfo1">
          <NavLink to="/medici">
            <ImCancelCircle />
          </NavLink>
        </button>
        <button
          className="submitAppointment"
          type="submit"
          disabled={!formState.isValid}
        >
          Adaugă doctorul!
        </button>
      </form>
    </>
  );
}

export default DoctorAdd;
