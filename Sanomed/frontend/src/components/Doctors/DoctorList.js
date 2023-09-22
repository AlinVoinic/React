import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../shared/context/auth-context";
import "./DoctorList.css";

import DoctorItem from "./DoctorItem";

// parinte: /pages/Doctors
function DoctorList(props) {
  const auth = useContext(AuthContext);
  const [sortValue, setSortValue] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const handleSortChange = (event) => {
    setSortValue(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  let filteredDoctors = [...props.doctors];
  if (filterValue) {
    filteredDoctors = filteredDoctors.filter(
      (doctor) => doctor.category === filterValue
    );
  }

  // console.log(filteredDoctors);

  if (sortValue === "rating+")
    filteredDoctors.sort((a, b) => a.avgRating - b.avgRating);
  else if (sortValue === "rating-")
    filteredDoctors.sort((a, b) => b.avgRating - a.avgRating);
  else if (sortValue === "review+")
    filteredDoctors.sort((a, b) => a.reviews.length - b.reviews.length);
  else if (sortValue === "review-")
    filteredDoctors.sort((a, b) => b.reviews.length - a.reviews.length);

  const uniqueCategories = [...props.doctors]
    .map((doctor) => doctor.category)
    .filter((category, index, self) => self.indexOf(category) === index)
    .sort();

  return (
    <div>
      <div className="divider">
        <div className="doctor-filler">DOCTORII SANOMED</div>
        <div className="app-form2 form-divider">
          <div className="stage2">
            <label htmlFor="sort-select">Ordonare:</label>
            <select
              id="sort-select"
              value={sortValue}
              onChange={handleSortChange}
            >
              <option value="">Ordonare</option>
              {/* <option value="rating+">Rating (crescător)</option> */}
              <option value="rating-">Rating total </option>
              {/* <option value="review+">Recenzii (crescător)</option> */}
              <option value="review-">Număr recenzii </option>
            </select>
          </div>
          <div className="stage2">
            <label htmlFor="filter-select">Specialitate: </label>
            <select
              id="filter-select"
              value={filterValue}
              onChange={handleFilterChange}
            >
              <option value="">Toate</option>
              {/* {DUMMY_DOCTORS.map((doctor) => (
                <option key={doctor.id} value={doctor.category}>
                  {doctor.category}
                </option>
              ))} */}
              {uniqueCategories.sort().map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {auth.isLoggedIn && auth.isAdmin && (
        <Link className="addDoctor" to="/medici/adaugare">
          Adaugă un doctor
        </Link>
      )}

      <div className="doctor-list">
        {filteredDoctors.map((doctor) => (
          <DoctorItem
            key={doctor.id}
            id={doctor.id}
            image={doctor.image}
            name={doctor.name}
            category={doctor.category}
            competences={doctor.competences}
            experience={doctor.experience}
            education={doctor.education}
            appointments={doctor.appointments}
            rating={doctor.avgRating}
            reviews={doctor.reviews}
            onDelete={props.onDeleteDoctor}
          />
        ))}
      </div>
      <div className="emptySpace"></div>
    </div>
  );
}
export default DoctorList;
