const mongoose = require("mongoose");
const Appointment = require("./programare");
const Review = require("./review");
const Schema = mongoose.Schema;

// obiect care contina logica blueprint-ului unui viitor document
// un doctor are mai multe programari, dar o programare tine DOAR de un doctor si un pacient
const doctorSchema = new Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  competences: { type: String, required: true },
  experience: { type: String, required: true },
  education: { type: String, required: true },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
  reviews: [{ type: mongoose.Types.ObjectId, required: true, ref: "Review" }],
  avgRating: { type: Number },
});

doctorSchema.methods.calculateAvgRating = function () {
  let ratingsTotal = 0;

  if (this.reviews.length) {
    this.reviews.forEach((review) => {
      ratingsTotal += review.rating;
    });
    this.avgRating = ratingsTotal / this.reviews.length;
  } else {
    this.avgRating = ratingsTotal;
  }

  this.save();
  return this.avgRating;
};

// query middleware, va pasa documentul care a fost modificat (post) catre functie
doctorSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
    await Appointment.deleteMany({ _id: { $in: doc.appointments } });
  }
});

// arg1: numele modelului (conventie: singular, cu litera mare) => se va crea colectia 'medici'
module.exports = mongoose.model("Doctor", doctorSchema);
