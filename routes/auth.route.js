const express = require("express");
const {
  signUp, login, forgotPassword, verifyPassResetCode, resetPassword
} = require("../services/auth.services");
const {
  signUpValidator,
  loginValidator
} = require("../utils/validators/authValidator");

const router = express.Router();

router
  .route("/signup")
  .post( signUpValidator, signUp);

  router
  .route("/login")
  .post( loginValidator, login);

  router
  .route("/forgotpassword")
  .post( forgotPassword);

  router
  .route("/verifyResetCode")
  .post( verifyPassResetCode);

  router
  .route("/ResetPassword")
  .put( resetPassword);


module.exports = router;
