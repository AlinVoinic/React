if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const fs = require("fs"); // NodeJS core module, file system module | ne ajuta sa interactionam cu fisierele (verificare, stergere etc)
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const appointmentRoutes = require("./routes/appointment-routes");
const reviewRoutes = require("./routes/review-routes");
const doctorRoutes = require("./routes/doctor-routes");
const userRoutes = require("./routes/user-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  // seteaza un header pe response; setam 3 headere: 1 = (specifica domeniile care pot avea acces si care pot trimite request-uri) | nume, valoare
  res.setHeader("Access-Control-Allow-Origin", "*");
  // 2 = specifica ce headere contin request-urile care vin catre backend | seteaza/specifica ce headere pot avea aceste request-uri trimise din browser
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Accept, Content-Type, Authorization"
  );
  // 3 = specifica ce metode HTTP pot fi folosite pe front-end
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  next();
});

app.use("/api/programare", appointmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/medici", doctorRoutes);
app.use("/api/user", userRoutes);

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  // executa daca nu s-a gasit niciun response pentru un request anterior
  const error = new HttpError("Această rută nu a putut fi gasită!", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://alin09:Ethereal01@cluster0.nnazxkw.mongodb.net/sanomed?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
