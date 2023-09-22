const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // librarie ce ne ajuta sa cream token-uri cu acea cheie unica ?

const HttpError = require("../models/http-error");
const User = require("../models/user");

// afisare useri
const getUsers = async (req, res, next) => {
  let user;

  try {
    user = await User.find({}, "-password").populate("appointments");
  } catch (err) {
    return next(new HttpError("Nu s-au putut afisa utilizatorii!", 500));
  }

  if (!user) {
    return next(new HttpError("Lista utilizatorilor nu a fost gasită!", 404));
  }
  res.json({ user: user.map((d) => d.toObject({ getters: true })) });
};

// afisare user
const getUserById = async (req, res, next) => {
  const userID = req.params.uid;
  let user;

  try {
    user = await User.findById(userID).populate("appointments");
  } catch (err) {
    return next(new HttpError("Userul cu acest ID nu a fost gasit!", 500));
  }

  if (!user) {
    return next(new HttpError("Utilizatorul nu a fost găsit!", 404));
  }

  res.json({ user: user.toObject({ getters: true }) });
};

// inregistrare user
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Input-uri invalide!", 422));
  }

  const { nume, prenume, email, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    return next(new HttpError("Parolele nu corespund!", 404));
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Inregistrare esuata, reincercati!", 500));
  }

  if (existingUser) {
    return next(
      new HttpError("Sunteți deja inregistrat, vă rugăm să vă logați!", 422)
    );
  }

  let hashedPassword;
  // salting, hash etc COLT
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Utilizatorul nu a putut fi creat! hash"), 500);
  }

  const createdUser = new User({
    image: "http://localhost:5000/uploads/images/user-profile.png",
    nume,
    prenume,
    email,
    password: hashedPassword,
    birthday: null,
    gender: "",
    telefon: "",
    address: "",
    city: "",
    zip: "",
    isAdmin:
      email === "admin@admin.admin" && password === "Admin69!" ? true : false,
    appointments: [],
    reviews: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Nu s-a putut crea utilizatorul!", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userID: createdUser.id, email: createdUser.email },
      "supersecret_dont_share",
      { expiresIn: "1d" }
    );
  } catch (err) {
    return next(new HttpError("Logare eșuată, token invalid!", 500));
  }

  res
    .status(201)
    .json({ userID: createdUser.id, email: createdUser.email, token: token });
  // res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

// logare user
const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Logare eșuată!", 500));
  }

  if (!existingUser) {
    return next(new HttpError("Acest cont nu există, înregistrați-vă!", 403));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(new HttpError("Logare eșuată, comparare parole hashed!", 500));
  }

  if (!isValidPassword) {
    return next(new HttpError("Logare eșuată, credențiale invalide!", 403));
  }

  let token;
  try {
    token = jwt.sign(
      { userID: existingUser.id, email: existingUser.email },
      "supersecret_dont_share",
      { expiresIn: "1d" }
    );
  } catch (err) {
    return next(new HttpError("Logare eșuată, token invalid!", 500));
  }

  res.json({
    userID: existingUser.id,
    email: existingUser.email,
    token: token,
    isAdmin: existingUser.isAdmin,
  });
  // res.json({ user: existingUser.toObject({ getters: true }) });
};

// editare date
const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Input-uri invalide!", 422));
  }

  const { birthday, gender, telefon, address, city, zip } = req.body;
  const userID = req.params.uid;
  let user;

  try {
    existingUser = await User.findOne({ telefon: telefon });
  } catch (err) {
    return next(new HttpError("Numar de telefon este inregistrat!!!", 500));
  }

  if (telefon === "0746029660") {
    return next(new HttpError("Numar de telefon este rezervat clinicii!", 422));
  }

  try {
    user = await User.findById(userID);
  } catch (err) {
    return next(new HttpError("Userul cu acest ID nu a fost gasit???", 500));
  }

  if (!user) {
    return next(new HttpError("Utilizator respectiv nu a fost găsit!", 404));
  }

  if (user.id !== req.userData.userID) {
    return next(new HttpError("Nu poți edita acest utilizator!"), 401);
  }

  user.birthday = birthday;
  user.gender = gender;
  user.telefon = telefon;
  user.address = address;
  user.city = city;
  user.zip = zip;
  // user.image = req.file.path;

  try {
    await user.save();
  } catch (err) {
    return next(new HttpError("Nu s-a putut actualiza utilizator!", 500));
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};

// stergem un user
const deleteUser = async (req, res, next) => {
  const userID = req.params.uid;
  let user;

  try {
    user = await User.findByIdAndDelete(userID);
    // .populate("appointments")
    // .populate("reviews");
  } catch (err) {
    return next(new HttpError("Userul cu acest ID nu a fost gasit???", 500));
  }

  if (!user) {
    return next(new HttpError("Utilizator respectiv nu a fost găsit!", 404));
  }

  if (user.id !== req.userData.userID) {
    return next(new HttpError("Nu poți șterge acest utilizator!"), 401);
  }

  // try {
  //   // await User.deleteOne();
  //   const sess = await mongoose.startSession();
  //   sess.startTransaction();
  //   await user.deleteOne({ session: sess });
  //   user.appointments.createdBy.pull(user);
  //   user.reviews.autor.pull(user);
  //   await user.appointments.save({ session: sess });
  //   await user.reviews.save({ session: sess });
  //   await sess.commitTransaction();
  // } catch (err) {
  //   return next(new HttpError("Utilizator nu a putut fi sters!", 500));
  // }

  res.status(200).json({ message: "Utilizator șters!" });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;

// {
//   "nume": "Tudor",
//   "prenume": "Catalin",
//   "email": "da@da.com",
//   "password": "marzia69A!",
//   "passwordConfirm": "marzia69A!"
// }

// {
//   "birthday" : "2000-08-01",
//   "gender" : "Feminin",
//   "telefon" : "0746029660",
//   "address" : "Strada Penisului",
//   "city" : "Slatina",
//   "zip" : "230032"
// }

let DUMMY_USERS = [
  {
    id: "54011",
    imageURL:
      "https://lisimed.ro/wp-content/uploads/2020/07/26445461-Lisimed-Avatar-Placeholder-EL.jpg",
    creator: "voinicgigel-alin",
    nume: "Voinic",
    prenume: "Gigel-Alin",
    email: "alin.voinic@yahoo.com",
    password: "marzia69A!",
    birthday: "August 01 2000", // pe UI, de pe dribbble
    gender: "Masculin", // Femeie / Barbat (input="radio")
    telefon: "0746029660",
    address: "Strada Garofitei nr4",
    city: "Slatina",
    zip: "077042",
    appPAST: 2,
    appFUTURE: 1,
    //UserReviews: [], // vedem ce review a lasat Userilor
  },
  {},
];
