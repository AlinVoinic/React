const HttpError = require("../models/http-error");

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  // verificam daca avem un token valid
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN' -> conventie
    if (!token) {
      throw new Error("Authentication failed!");
    }
    // odata extras, token-ul poate fi invalid => VERIFICAM
    const decodedToken = jwt.verify(token, "supersecret_dont_share");
    req.userData = { userID: decodedToken.userID };
    next();
  } catch (err) {
    return next(new HttpError("Autentificare eșuată!", 403));
  }
};

/* query params sunt informatiile din URL care se afla dupa ? 
  headers sunt mai bune, deci vom encoda token-urile in header-ul request-ului
  req.headers = obiect JS in care se afla chei (headers) si valori | extragem authorization
  */
