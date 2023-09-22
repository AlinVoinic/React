const express = require("express");
const { check } = require("express-validator");

const reviewControllers = require("../controllers/review-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", reviewControllers.getReviews);

router.get("/:uid", reviewControllers.getReviewsByUserId);

router.get("/:did", reviewControllers.getReviewsByDoctorId);

router.use(checkAuth);

router.post(
  "/",
  [
    check("body")
      .matches(/^[a-zA-Z0-9!? '-.,]{20,500}$|^$/)
      .escape(),
    check("rating").isInt({ min: 1, max: 5 }).escape(),
  ],
  reviewControllers.createReview
);

router.delete("/:rid", reviewControllers.deleteReview);

module.exports = router;
