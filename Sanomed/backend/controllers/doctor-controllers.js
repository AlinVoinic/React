const { validationResult } = require("express-validator");
const fs = require("fs");

const HttpError = require("../models/http-error");
const Doctor = require("../models/doctor");

// extragem toti doctorii
const getDoctors = async (req, res, next) => {
  let doctors;
  try {
    doctors = await Doctor.find({})
      .populate("appointments")
      .populate("reviews");
  } catch (err) {
    const error = new HttpError("Nu s-au putut afisa doctorii!", 500);
    return next(error);
  }

  if (!doctors) {
    return next(new HttpError("Lista doctorilor nu a fost gasită!", 404));
  }

  doctors.forEach((doctor) => {
    doctor.calculateAvgRating();
  });

  res.json({ doctors: doctors.map((d) => d.toObject({ getters: true })) });
};

// extrag doctorul dupa ID
const getDoctorById = async (req, res, next) => {
  const medicID = req.params.did;
  let doctor;

  try {
    doctor = await Doctor.findById(medicID)
      .populate("appointments")
      .populate("reviews");
  } catch (err) {
    const error = new HttpError("Doctorul cu acest ID nu a fost gasit!", 500);
    return next(error);
  }

  if (!doctor) {
    return next(new HttpError("Doctorul respectiv nu a fost găsit!", 404));
  }

  res.json({ doctor: doctor.toObject({ getters: true }) });
};

// cream un doctor
const createDoctor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Input-uri invalide!", 422));
  }

  const { name, category, competences, experience, education } = req.body;
  const createdDoctor = new Doctor({
    name,
    category,
    competences,
    experience,
    education,
    image: req.file.path,
    appointments: [],
    reviews: [],
    avgRating: 0,
  });

  try {
    await createdDoctor.save(); // va stoca documentul in colectie, iar save() a crea acel id unic; ESTE PROMISE!
  } catch (err) {
    const error = new HttpError("Nu s-a putut crea doctorul!", 500);
    return next(error);
  }
  res.status(201).json({ doctor: createdDoctor.toObject({ getters: true }) });

  //   {
  //     "name": "Corina Tomescu",
  //     "category": "Urologie",
  //     "competences": "Stie multe",
  //     "experience": "la vasi la firma 2 ani",
  //     "education": "Carol Davila"
  // }
};

// actualizare un doctor
const updateDoctor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Input-uri invalide!", 422));
  }

  const { name, category, competences, experience, education } = req.body;
  const medicID = req.params.did;
  let doctor;

  try {
    doctor = await Doctor.findById(medicID);
  } catch (err) {
    const error = new HttpError("Doctorul cu acest ID nu a fost gasit???", 500);
    return next(error);
  }

  if (!doctor) {
    return next(new HttpError("Doctorul respectiv nu a fost găsit!", 404));
  }

  doctor.name = name;
  doctor.category = category;
  doctor.competences = competences;
  doctor.experience = experience;
  doctor.education = education;
  doctor.image = req.file.path;

  try {
    await doctor.save();
  } catch (err) {
    const error = new HttpError("Nu s-a putut actualiza doctorul!", 500);
    return next(error);
  }

  res.status(200).json({ doctor: doctor.toObject({ getters: true }) });
};

// stergem un doctor
const deleteDoctor = async (req, res, next) => {
  const medicID = req.params.did;

  let doctor;
  try {
    doctor = await Doctor.findByIdAndDelete(medicID);
    // .populate("appointments")
    // .populate("reviews");
  } catch (err) {
    const error = new HttpError("Doctorul cu acest ID nu a fost gasit???", 500);
    return next(error);
  }

  if (!doctor) {
    return next(new HttpError("Doctorul respectiv nu a fost găsit!", 404));
  }

  const imagePath = doctor.image;
  fs.unlink(imagePath, (err) => {});

  // try {
  //   // await doctor.deleteOne();
  //   const sess = await mongoose.startSession();
  //   sess.startTransaction();
  //   await doctor.deleteOne({ session: sess });
  //   doctor.appointments.forDoctor.pull(doctor);
  //   doctor.reviews.destinatar.pull(doctor);
  //   await doctor.appointments.save({ session: sess });
  //   await doctor.reviews.save({ session: sess });
  //   await sess.commitTransaction();
  // } catch (err) {
  //   return next(new HttpError("Doctorul nu a putut fi sters!", 500));
  // }

  res.status(200).json({ message: "Medic șters!" });
};

exports.getDoctors = getDoctors;
exports.getDoctorById = getDoctorById;
exports.createDoctor = createDoctor;
exports.updateDoctor = updateDoctor;
exports.deleteDoctor = deleteDoctor;
