const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
dotenv.config({
  path: "config.env",
});
const rateLimit = require("express-rate-limit");

const ApiError = require("./utils/apiErrors");
const globalError = require("./middlwares/errorMiddlware");
const dbConnection = require("./config/database");
const mountRoutes = require("./routes");

// Connect with db
dbConnection();

const app = express();
var cors = require("cors");

app.use(cors());
// MiddleWares
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

// Apply the rate limiting middleware to all requests
app.use("/api", limiter);

// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  //Create error and send it to error handling middleware
  // const err = new Error(`Can not find this route: ${req.originalUrl}`);
  // next(err.message);
  next(new ApiError(`Can not find this route: ${req.originalUrl}`, 400));
});

// global error in express code

app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, (err) => {
  console.log(`App running on port ${PORT}`);
});

//global error without express code

process.on("unhandledRejection", (err) => {
  console.error(
    `unhandledRejection Eroors:${err}| ${err.name} | ${err.message}`
  );
  server.close(() => {
    console.error(`shutting down ....`);
    process.exit(1);
  });
});
