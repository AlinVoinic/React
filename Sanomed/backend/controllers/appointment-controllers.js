const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");

const HttpError = require("../models/http-error");
const Appointment = require("../models/programare");
const Doctor = require("../models/doctor");
const User = require("../models/user");

// afisare programari
const getApps = async (req, res, next) => {
  let app;

  try {
    app = await Appointment.find({});
  } catch (err) {
    return next(new HttpError("Nu s-au putut afișa programările!", 500));
  }

  if (!app) {
    return next(new HttpError("Lista programărilor nu a fost gasită!", 404));
  }
  res.json({ app: app.map((d) => d.toObject({ getters: true })) });
};

// afisare programare
const getAppById = async (req, res, next) => {
  const appID = req.params.aid;
  let app;

  try {
    app = await Appointment.findById(appID);
  } catch (err) {
    return next(new HttpError("Programarea nu a fost gasita APP_ID 1!", 500));
  }

  if (!app) {
    return next(new HttpError("Programarea nu a fost gasită APP_ID 2!", 404));
  }
  res.json({ app: app.toObject({ getters: true }) });
};

// Programarile pacientului
const getAppsByUserId = async (req, res, next) => {
  const userID = req.params.uid;
  let apps;

  try {
    apps = await Appointment.find({ createdBy: userID });
  } catch (err) {
    return next(new HttpError("Programarea nu a fost gasita user_id 1!", 500));
  }

  if (!apps) {
    return next(
      new HttpError("Programările nu au fost gasite user_id 2!", 404)
    );
  }

  let user;
  try {
    user = await User.findById(userID);
  } catch (err) {
    return next(new HttpError("Nu s-a putut crea programarea user_id 3!", 500));
  }

  if (!user) {
    return next(new HttpError("Nu s-a putut găsi utilizatorul!", 404));
  }

  res.json({ apps: apps.map((a) => a.toObject({ getters: true })) });
};

// Programarile doctorului
const getAppsByDoctorId = async (req, res, next) => {
  const doctorID = req.params.did;
  let app;

  try {
    app = await Appointment.find({ forDoctor: doctorID });
  } catch (err) {
    return next(new HttpError("Programarea nu a fost gasita doctor_id!", 500));
  }

  if (!app) {
    return next(new HttpError("Programările nu a fost găsite doctor_id!", 404));
  }

  res.json({ app: app.map((a) => a.toObject({ getters: true })) });
};

// Adaugare programare
const addApp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Input-uri invalide!", 422));
  }

  const {
    createdBy,
    forDoctor,
    speciality,
    numeDoctor,
    appData,
    numePacient,
    prenumePacient,
    telefonPacient,
    emailPacient,
    obsPacient,
  } = req.body;

  if (new Date(appData) < new Date()) {
    return next(new HttpError("Data programării este invalidă!", 404));
  }

  const createdApp = new Appointment({
    createdBy, // ID user
    forDoctor, // ID doctor
    speciality,
    numeDoctor,
    appData,
    numePacient,
    prenumePacient,
    telefonPacient,
    emailPacient,
    obsPacient,
    image: req.file.path,
  });

  let user;
  try {
    user = await User.findById(createdBy);
  } catch (err) {
    return next(new HttpError("Nu s-a putut crea programarea 1!", 500));
  }

  if (!user) {
    return next(new HttpError("Nu s-a putut găsi utilizatorul!", 404));
  }

  if (telefonPacient === "0746029660") {
    return next(new HttpError("Nu folosiți telefonul clinicii!", 404));
  }

  let doctor;
  try {
    doctor = await Doctor.findOne({
      _id: forDoctor,
      category: speciality,
      name: numeDoctor,
    });
  } catch (err) {
    return next(new HttpError("Nu s-a putut crea programarea 2!", 500));
  }

  if (!doctor) {
    return next(new HttpError("Nu s-a putut găsi doctorul!", 404));
  }

  let existingAppointment;
  try {
    existingAppointment = await Appointment.findOne({
      numeDoctor: numeDoctor,
      appData: appData,
    });
  } catch (err) {
    return next(new HttpError("Slot ocupat, selectati alta ora???", 500));
  }

  if (existingAppointment) {
    return next(new HttpError("Slot ocupat, selectați altă oră!", 422));
  }

  try {
    // await createdApp.save();
    // sesiunile si tranzactiile asigura faptul ca o anumita operatie nu va fi intrerupta sau suprascrisa de o alta operatie!
    const sess = await mongoose.startSession(); // sesiunea curenta care porneste in momentul crearii unei noi programari
    sess.startTransaction();
    await createdApp.save({ session: sess }); //creaza App cu tot cu _id
    user.appointments.push(createdApp); // metoda din mongoose care creaza conexiunea intre documente | MongoDB ia id-ul programarii si il adauga in user.appointments
    doctor.appointments.push(createdApp);
    await user.save({ session: sess }); // salvam noul utilizator ce are id-ul programarii
    await doctor.save({ session: sess });
    await sess.commitTransaction(); // tranzactia este comisa de catre sesiune
    // Sessions and corresponding transactions always deal with the ObjectId
    // daca oricare pas ar fi picat, MongoDB ar fi facut rollback automat la toate modificarile
  } catch (err) {
    console.log(err);
    return next(new HttpError("Nu s-a putut crea programarea 3!", 500));
  }

  res.status(201).json({ app: createdApp.toObject({ getters: true }) });
};

// Pentru incarcarea dosarului medical
const editApp = async (req, res, next) => {};

// Pentru userul care sterge o programare
const deleteApp = async (req, res, next) => {
  const appID = req.params.aid;
  let app;

  try {
    app = await Appointment.findById(appID)
      .populate("createdBy")
      .populate("forDoctor");
  } catch (err) {
    return next(new HttpError("Programarea nu a fost gasita?", 500));
  }

  if (!app) {
    return next(new HttpError("Programarea nu a fost găsita!", 404));
  }

  if (app.createdBy.id !== req.userData.userID) {
    return next(new HttpError("Nu poți șterge această programare!"), 401);
  }

  const imagePath = app.image;

  try {
    // await app.deleteOne();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await app.deleteOne({ session: sess });
    app.createdBy.appointments.pull(app);
    app.forDoctor.appointments.pull(app);
    await app.createdBy.save({ session: sess });
    await app.forDoctor.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Programarea nu s-a sters cu sesiune!", 500));
  }

  fs.unlink(imagePath, (err) => {});

  res.status(200).json({ message: "Programare ștearsă!" });
};

exports.getApps = getApps;
exports.getAppById = getAppById;
exports.getAppsByUserId = getAppsByUserId;
exports.getAppsByDoctorId = getAppsByDoctorId;
exports.addApp = addApp;
exports.editApp = editApp;
exports.deleteApp = deleteApp;

// {
//   "createdBy": "",
//   "forDoctor": "",
//   "speciality": "Urologie",
//   "numeDoctor": "Corina Tomescu",
//   "appData": "2023-12-12T12:30:00Z",
//   "numePacient": "Voinic",
//   "prenumePacient": "Alin",
//   "telefonPacient": "0746029660",
//   "emailPacient": "alin@yahoo.com",
//   "obsPacient": ""
// }

let DUMMY_APPOINTMENTS = [
  {
    id: "1",
    createdBy: "54011", // id utilizator
    forDoctor: "alia_al-kafijy", // id DOCTOR
    numeDoctor: "Alia Al-Kafijy", // NUME.replace(" ", "_").toLowerCase()
    speciality: "Medicina muncii",
    appData: "2023-05-16T16:30:00.000Z", // va bloca sloturi din calendar | new Date('2022-08-01T17:00:00')
    //          => Mon Aug 01 2022 17:00:00 GMT+0300 (Eastern European Summer Time)
    //             AVEM NEVOIE DOAR DE "2022-09-09T00:00:00"
    // DatePicker nu diferentiaza orele blocate in zile diferite => hardcodare / mesaj de eroare la selectie!
    numePacient: "Voinic",
    prenumePacient: "Alin",
    telefonPacient: "0746029660",
    emailPacient: "alin.voinic@yahoo.com",
    obsPacient: "daca exista",
  },
  {
    id: "10",
    createdBy: "54011",
    forDoctor: "diana_strungaru",
    numeDoctor: "Diana Strungaru",
    speciality: "ORL",
    appData: " SAU moment ",
    numePacient: "Voinic",
    prenumePacient: "Alin",
    telefonPacient: "0746029660",
    emailPacient: "alin.voinic@yahoo.com",
    obsPacient: "da ma da",
  },
];
