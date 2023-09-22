const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Appointment = require("./programare");
const Review = require("./review");

const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  nume: { type: String, required: true },
  prenume: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // unique creaza un index care creste viteza de interogare | mongoose-unique-validator il face unic!
  password: { type: String, required: true, minlength: 8 },
  image: { type: String },
  birthday: { type: Date },
  gender: { type: String },
  telefon: { type: String },
  address: { type: String },
  city: { type: String },
  zip: { type: String },
  isAdmin: { type: Boolean },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
});

userSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
    await Appointment.deleteMany({ _id: { $in: doc.appointments } });
  }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
