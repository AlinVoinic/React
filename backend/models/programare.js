const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  createdBy: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  forDoctor: { type: mongoose.Types.ObjectId, required: true, ref: "Doctor" },
  numeDoctor: { type: String, required: true },
  speciality: { type: String, required: true },
  appData: { type: Date, required: true },
  numePacient: { type: String, required: true },
  prenumePacient: { type: String, required: true },
  telefonPacient: { type: String, required: true },
  emailPacient: { type: String, required: true },
  obsPacient: { type: String },
  image: { type: String },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
