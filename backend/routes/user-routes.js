const express = require("express");
const { check } = require("express-validator");

const userControllers = require("../controllers/user-controllers");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post(
  "/signup",
  [
    check("nume")
      .matches(/^[A-Z][a-zA-Z '-.,]{2,32}$|^$/)
      .escape(),
    check("prenume")
      .matches(/^[A-Z][a-zA-Z '-.,]{2,32}$|^$/)
      .escape(),
    check("email").normalizeEmail().isEmail().escape(),
    check("password")
      .matches(
        /(?=^.{8,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/
      )
      .escape(),
  ],
  userControllers.signup
);

router.post(
  "/login",
  [check("email").normalizeEmail().isEmail().escape()],
  userControllers.login
);

router.get("/", userControllers.getUsers);

router.get("/:uid", userControllers.getUserById);

router.use(checkAuth);

router.patch(
  "/:uid",
  // fileUpload.single("image"),
  [
    check("birthday").isISO8601().toDate().escape(), // 2000-08-01T16:30:00.000Z
    check("gender").isIn(["Masculin", "Feminin"]).escape(),
    check("telefon")
      .matches(
        /^(?:(?:(?:00\s?|\+)40\s?|0)(?:7\d{2}\s?\d{3}\s?\d{3}|(21|31)\d{1}\s?\d{3}\s?\d{3}|((2|3)[3-7]\d{1})\s?\d{3}\s?\d{3}|(8|9)0\d{1}\s?\d{3}\s?\d{3}))$/
      )
      .escape(),
    check("address").not().isEmpty().escape(),
    check("city")
      .matches(/^[A-Z][a-zA-Z '-.,]{2,32}$|^$/)
      .escape(),
    check("zip")
      .matches(/^[0-9]{6,6}$/)
      .escape(),
  ],
  userControllers.updateUser
);

router.delete("/:uid", userControllers.deleteUser);

module.exports = router;
