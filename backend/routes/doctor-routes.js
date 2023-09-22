const express = require("express");
const { check } = require("express-validator");

const doctorControllers = require("../controllers/doctor-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", doctorControllers.getDoctors);

router.get("/:did", doctorControllers.getDoctorById);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("name").matches(/^[A-Z][a-zA-Z '-.,]{2,32}$|^$/),
    check("category").matches(/^[a-zA-Z '-.,]{2,32}$|^$/),
    check("competences").not().isEmpty(),
    check("experience").not().isEmpty(),
    check("education").not().isEmpty(),
  ],
  doctorControllers.createDoctor
);

router.patch(
  "/:did",
  fileUpload.single("image"),
  [
    check("name").matches(/^[A-Z][a-zA-Z '-.,]{2,32}$|^$/),
    check("category").matches(/^[A-Z][a-zA-Z '-.,]{2,32}$|^$/),
    check("competences").not().isEmpty(),
    check("experience").not().isEmpty(),
    check("education").not().isEmpty(),
  ],
  doctorControllers.updateDoctor
);

router.delete("/:did", doctorControllers.deleteDoctor);

module.exports = router;
