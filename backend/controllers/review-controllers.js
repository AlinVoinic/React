const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Review = require("../models/review");
const Doctor = require("../models/doctor");
const User = require("../models/user");

// extragem TOT
const getReviews = async (req, res, next) => {
  let review;
  try {
    review = await Review.find({});
  } catch (err) {
    const error = new HttpError("Nu s-au putut afisa review-urile!", 500);
    return next(error);
  }

  if (!review) {
    return next(new HttpError("Lista de reviews nu a fost gasită!", 404));
  }
  res.json({ review: review.map((d) => d.toObject({ getters: true })) });
};

// review-urile DOCTORULUI
const getReviewsByDoctorId = async (req, res, next) => {
  const doctorId = req.params.did;
  let review;

  try {
    review = await Review.find({ destinatar: doctorId });
  } catch (err) {
    const error = new HttpError("Nu putem afisa doctor's reviews!", 500);
    return next(error);
  }

  if (!review) {
    return next(new HttpError("Lista de reviews nu a fost gasită U!", 404));
  }
  res.json({ review: review.map((d) => d.toObject({ getters: true })) });
};

// review-urile DOCTORULUI
const getReviewsByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let review;

  try {
    review = await Review.find({ autor: userId });
  } catch (err) {
    const error = new HttpError("Nu putem afisa user's reviews!", 500);
    return next(error);
  }

  if (!review) {
    return next(new HttpError("Lista de reviews nu a fost gasită D!", 404));
  }
  res.json({ review: review.map((d) => d.toObject({ getters: true })) });
};

// cream un review
const createReview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Input-uri invalide!", 422));
  }

  const { body, rating, autor, destinatar } = req.body;
  const createdReview = new Review({ body, rating, autor, destinatar });

  let user;
  try {
    user = await User.findById(autor);
  } catch (err) {
    return next(new HttpError("Nu s-a creat review-ul, nu avem user!", 500));
  }

  if (!user) {
    return next(new HttpError("Nu s-a putut gasi utilizatorul!", 404));
  }

  let existingDoctor;
  try {
    existingDoctor = await Doctor.findById(destinatar);
  } catch (err) {
    return next(new HttpError("Nu s-a creat review-ul, nu avem doctor!", 500));
  }

  if (!existingDoctor) {
    return next(new HttpError("Nu s-a putut gasi doctorul!", 404));
  }

  let existingReview;
  try {
    existingReview = await Review.findOne({
      autor: autor,
      destinatar: destinatar,
    });
  } catch (err) {
    return next(new HttpError("Ai lasat deja un review medicului!", 500));
  }

  if (existingReview) {
    return next(new HttpError("Ați oferit deja un review acestui medic!", 422));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdReview.save({ session: sess });
    existingDoctor.reviews.push(createdReview);
    user.reviews.push(createdReview);
    await user.save({ session: sess });
    await existingDoctor.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Nu s-a putut crea review-ul, SESIUNE!", 500);
    return next(error);
  }

  res.status(201).json({ review: createdReview.toObject({ getters: true }) });
};

// stergem un review
const deleteReview = async (req, res, next) => {
  const reviewID = req.params.rid;
  let review;

  try {
    review = await Review.findById(reviewID)
      .populate("destinatar")
      .populate("autor");
  } catch (err) {
    const error = new HttpError("Review-ul cu acest ID nu a fost gasit", 500);
    return next(error);
  }

  if (!review) {
    return next(new HttpError("Review-ul respectiv nu a fost găsit!", 404));
  }

  try {
    // await Review.deleteOne();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await review.deleteOne({ session: sess });
    review.destinatar.reviews.pull(review);
    review.autor.reviews.pull(review);
    await review.destinatar.save({ session: sess });
    await review.autor.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Review-ul nu a putut fi șters!", 500);
    return next(error);
  }

  res.status(200).json({ message: "Review șters!" });
};

exports.getReviews = getReviews;
exports.getReviewsByDoctorId = getReviewsByDoctorId;
exports.getReviewsByUserId = getReviewsByUserId;
exports.createReview = createReview;
exports.deleteReview = deleteReview;

let DUMMY_REVIEWS = [
  {
    "body": "Un medic profesionist!",
    "rating": 4,
    "autor": "",
    "destinatar": "",
  },
];
