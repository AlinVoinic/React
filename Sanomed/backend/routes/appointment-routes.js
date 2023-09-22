const express = require("express");
const { check } = require("express-validator");

const appointmentControllers = require("../controllers/appointment-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

// const multer = require("multer");
// const { storage } = require("../cloudinary");
// const upload = multer({ storage });

const router = express.Router();

router.get("/", appointmentControllers.getApps);

router.get("/:aid", appointmentControllers.getAppById);

router.get("/user/:uid", appointmentControllers.getAppsByUserId);

router.get("/medic/:did", appointmentControllers.getAppsByDoctorId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("speciality")
      .matches(/^[A-Z][a-zA-Z '-.,]{2,32}$|^$/)
      .escape(),
    check("numeDoctor")
      .matches(/^[A-Z][a-zA-Z '-.,]{2,32}$|^$/)
      .escape(),
    check("appData").isISO8601().toDate().escape(),
    check("numePacient")
      .matches(/^[A-Z][a-zA-Z '-.,]{2,32}$|^$/)
      .escape(),
    check("prenumePacient")
      .matches(/^[A-Z][a-zA-Z '-.,]{2,32}$|^$/)
      .escape(),
    check("telefonPacient")
      .matches(
        /^(?:(?:(?:00\s?|\+)40\s?|0)(?:7\d{2}\s?\d{3}\s?\d{3}|(21|31)\d{1}\s?\d{3}\s?\d{3}|((2|3)[3-7]\d{1})\s?\d{3}\s?\d{3}|(8|9)0\d{1}\s?\d{3}\s?\d{3}))$/
      )
      .escape(),
    check("emailPacient").normalizeEmail().isEmail().escape(),
    check("obsPacient").escape(),
  ],
  appointmentControllers.addApp
);

// Pentru incarcarea dosarului medical!
router.patch("/addFile/:aid", appointmentControllers.editApp);

router.delete("/:aid", appointmentControllers.deleteApp);

module.exports = router;

/*
    DATE: Din FRONTEND primim data cu 3 ore inainte (toISOString), trebuie scapat de 'Z' sau sa facem o conversie
    (new Date()).toString().slice(4,15) => 'May 13 2023' pentru aniversarea userului
*/
