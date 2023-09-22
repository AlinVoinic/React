import { useEffect, useState } from "react";
import { useHttpHook } from "../components/shared/hooks/http-hook";
import DoctorList from "../components/Doctors/DoctorList";

import LoadingSpinner from "../UI/LoadingSpinner";
import PageContent from "../UI/PageContent";
import Modal from "../UI/Modal";

import { ImCancelCircle } from "react-icons/im";
import "../components/Doctors/DoctorItem.css";

function Doctors() {
  const [loadedDoctors, setLoadedDoctors] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpHook();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await sendRequest("http://localhost:5000/api/medici/");
        setLoadedDoctors(data.doctors);
      } catch (err) {}
    };
    fetchDoctors();
  }, [sendRequest]);

  const doctorDeleteHandler = (deletedDoctorId) => {
    setLoadedDoctors((prevDoctors) =>
      prevDoctors.filter((doctor) => doctor.id !== deletedDoctorId)
    );
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

      <PageContent title="Doctori - SANOMED">
        {!isLoading && loadedDoctors && (
          <DoctorList
            doctors={loadedDoctors}
            onDeleteDoctor={doctorDeleteHandler}
          />
        )}
        {/* <DoctorList doctors={DUMMY_DOCTORS} /> */}
      </PageContent>
    </>
  );
}

export default Doctors;

export const DUMMY_DOCTORS = [
  // {
  //   id: "andreea_andrei",
  //   imageURL:
  //     "https://lisimed.ro/wp-content/uploads/2020/07/26445461-Lisimed-Avatar-Placeholder-EA.jpg",
  //   name: "Andreea Andrei",
  //   category: "Medicină Generală",
  //   rating: (4.41).toFixed(2),
  //   reviews: 3,
  //   competences: "",
  //   experience:
  //     "Septembrie 2022 - prezent: Medic generalist - Spitalul de Urgenţă Năvodari",
  //   education:
  //     "Facultatea de Medicină, Universitatea 'Ovidius' din Constanța (2022)",
  // },
  {
    id: "6489df98c16c25380d02be78",
    imageURL:
      "https://lisimed.ro/wp-content/uploads/2020/07/26445461-Lisimed-Avatar-Placeholder-EL.jpg",
    name: "Florin Popescu",
    category: "Cardiologie",
    rating: (5.0).toFixed(2),
    // rating: (5.0).toPrecision(3),
    competences: "Ecografie cardiacă și vasculară",
    experience:
      "01.2016 - 05.2023: Medic Specialist Cardiologie - Spitalul Municipal Râmnicu Sărat, Buzău",
    education:
      "Universitatea de Medicină și Farmacie Carol Davila - București (2015)",
    appointments: [{}], // fiecarui doctor i se va asigna programari de la pacienti!
    reviewsA: [
      {
        autor: "eu",
        destinatar: "Florin Popescu",
        body: "Un doctor ok!",
        rating: 4,
      },
    ],
  },
  {
    id: "6489e18f3dbc7f48b9979845",
    imageURL:
      "https://lisimed.ro/wp-content/uploads/2020/07/26445461-Lisimed-Avatar-Placeholder-EA.jpg",
    name: "Corina Tomescu",
    category: "Urologie",
    rating: (4.75).toFixed(2),
    reviews: 10,
    competences: "Ultrasonografie generală și Litotriție extracorporală",
    experience:
      "2012 - 2022: Medic primar - Spitalul Clinic de Urgență 'Sfântul Ioan', Corabia",
    education:
      "Universitatea de Vest 'Vasile Goldis', Facultatea de Medicina Generala - Arad (2012)",
    reviewsA: [
      {
        autor: "eu1",
        destinatar: "Corina Tomescu",
        body: "Un doctor ok!",
        rating: 4,
      },
    ],
  },
  {
    id: "6489e1eb3dbc7f48b997984a",
    imageURL:
      "https://lisimed.ro/wp-content/uploads/2020/07/26445461-Lisimed-Avatar-Placeholder-EL.jpg",
    name: "George Alupoaie",
    category: "Ortopedie",
    rating: (4.37).toFixed(2),
    reviews: 4,
    competences: "Artoscopie, Osteosinteză, Artroplastie",
    experience:
      "Februarie 2020 - Mai 2022: Medic Specialist Ortopedie - Amalia Medical Expert Center, Galați",
    education:
      "Universitatea de Medicină și Farmacie Carol Davila - București (2019)",
  },
  {
    id: "6489e2373dbc7f48b9979850",
    imageURL:
      "https://lisimed.ro/wp-content/uploads/2020/07/26445461-Lisimed-Avatar-Placeholder-EL.jpg",
    name: "Ioan Vasilescu",
    category: "Dermatologie",
    rating: (4.85).toFixed(2),
    reviews: 6,
    competences:
      "Dermatologie și medicină generală, cu o experiență de peste 5 ani",
    experience:
      "Decembrie 2017 - Martie 2023: Medic Medicină Generală - Lisimed, Slatina",
    education: "Universitatea de Medicină și Farmacie din Craiova (2017)",
  },
  {
    id: "6489e2cd3dbc7f48b9979857",
    imageURL:
      "https://lisimed.ro/wp-content/uploads/2020/07/26445461-Lisimed-Avatar-Placeholder-EA.jpg",
    name: "Magdalena Topovich",
    category: "Pediatrie",
    rating: (4.45).toFixed(2),
    reviews: 3,
    competences:
      "Peste 7 ani de experiență în sectorul privat și public de sănătate",
    experience:
      "Aprilie 2019 - Octombrie 2022: Medic pediatru rezident - Spitalul Clinic de Urgență București",
    education:
      "Universitatea de Medicină și Farmacie Carol Davila - București (2019)",
  },
  {
    id: "6489e7c03dbc7f48b9979892",
    imageURL:
      "https://lisimed.ro/wp-content/uploads/2020/07/26445461-Lisimed-Avatar-Placeholder-EL.jpg",
    name: "Iulian Dobrescu",
    category: "Ginecologie",
    rating: (4.59).toFixed(2),
    reviews: 8,
    competences:
      "Ultrasonografie obstetricală și ginecologică, Histeroscopie si Colposcopie.",
    experience:
      "Ianuarie 2017 - Februarie 2023: Medic specialist Obstetrică - Ginecologie, Spital Clinic „Prof. Panait Sârbu”",
    education:
      "Facultatea de Medicină, U.M.F. 'Carol Davila', București (2016)",
  },
  {
    id: "6489e6b33dbc7f48b9979868",
    imageURL:
      "https://lisimed.ro/wp-content/uploads/2020/07/26445461-Lisimed-Avatar-Placeholder-EA.jpg",
    name: "Alia Al-Kafijy",
    category: "Medicina muncii",
    rating: (4.7).toFixed(2),
    reviews: 9,
    competences: "consultații și interpretarea rezultatelor",
    experience:
      "Noiembrie 2019 - Mai 2022: Medic generalist Medicina muncii, Sanador",
    education:
      "Universitatea de Medicină și Farmacie Carol Davila - București (2019)",
    appointments: [
      {
        id: 1,
        createdBy: "voinicalin", // ({nume}{prenume}).toLowerCase()
        forDoctor: "alia_al-kafijy", // id DOCTOR
        speciality: "Medicina muncii",
        appData: "2023-05-16T13:30:00.000Z", // va bloca sloturi din calendar | new Date('2022-08-01T17:00:00')
        //          => Mon Aug 01 2022 17:00:00 GMT+0300 (Eastern European Summer Time)
        //             AVEM NEVOIE DOAR DE "2022-09-09T00:00:00"
        numePacient: "Voinic",
        prenumePacient: "Alin",
        telefonPacient: "0746029660",
        emailPacient: "alin.voinic@yahoo.com",
        obsPacient: "daca exista",
      },
      {
        id: 2,
        createdBy: "tudorcatalin",
        forDoctor: "corina_tomescu",
        speciality: "Urologie",
        appData: "2023-05-17T12:30:00.000Z",
        numePacient: "Tudor",
        prenumePacient: "Catalin",
        telefonPacient: "0746029670",
        emailPacient: "tudor.catalin@yahoo.com",
        obsPacient: "daca existaaa",
      },
    ],
  },
  {
    id: "6489f6b6f1090a8c69cdf772",
    imageURL:
      "https://lisimed.ro/wp-content/uploads/2020/07/26445461-Lisimed-Avatar-Placeholder-EA.jpg",
    name: "Diana Strungaru",
    category: "ORL",
    rating: (4.71).toFixed(2),
    reviews: 11,
    competences: "Audiologie",
    experience:
      "Septembrie 2013 - Decembrie 2019: Medic Specialist (clinică privată)",
    education:
      "Universitatea de Medicină și Farmacie Carol Davila - București (2013)",
  },
  // {
  //   id: "6489f716f1090a8c69cdf77e",
  //   imageURL:
  //     "https://lisimed.ro/wp-content/uploads/2020/07/26445461-Lisimed-Avatar-Placeholder-EL.jpg",
  //   name: "Costin Stancu",
  //   category: "Oftalmologie",
  //   rating: (4.71).toFixed(2),
  //   reviews: 6,
  //   competences: "diagnosticul și tratamentul bolilor oftalmologice",
  //   experience:
  //     "Septembrie 2016 - August 2020: Medic rezident oftalmolog - Spitalul Universitar de Urgenţă, Craiova",
  //   education: "Universitatea de Medicină și Farmacie din Craiova (2016)",
  // },
  {
    id: "6489e5853dbc7f48b997985f",
    imageURL:
      "https://lisimed.ro/wp-content/uploads/2020/07/26445461-Lisimed-Avatar-Placeholder-EL.jpg",
    name: "Teodor Canolescu",
    category: "Medicina muncii",
    rating: (4.79).toFixed(2),
    reviews: 7,
    competences: "consultații și interpretarea rezultatelor",
    experience:
      "Noiembrie 2020 - Martie 2023: Medic Medicina muncii, Regina Maria",
    education:
      "Universitatea de Medicină și Farmacie Carol Davila - București (2020)",
  },
];
