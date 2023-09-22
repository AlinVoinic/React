const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: { type: String, required: true },
  rating: { type: Number, required: true },
  autor: { type: Schema.Types.ObjectId, ref: "User" },
  destinatar: { type: Schema.Types.ObjectId, ref: "Doctor" },
});

module.exports = mongoose.model("Review", reviewSchema);
