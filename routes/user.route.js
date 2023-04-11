const express = require("express");
const {
  resizeImage,
  uploadUserImage,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
  activeUser
} = require("../services/user.services");
const {
  changeUserPasswordValidator,
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updateLogedUserValidator,
} = require("../utils/validators/userValidator");

const AuthService = require("../services/auth.services");

const router = express.Router();

router.use(AuthService.protect)

router.put(
  "/changepassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router.get("/profile",  getLoggedUserData, getUser);
router.put("/changeMyPassword",  updateLoggedUserPassword);
router.put(
  "/updateMe",
  updateLogedUserValidator,
  updateLoggedUserData
);
router.delete(
  "/unActiveMe",
 deleteLoggedUserData
);
router.put(
  "/activeMe",
 activeUser
);


// admin
router.use(AuthService.allowedTo("admin", "manager"))
router
  .route("/")
  .get(AuthService.protect, getUsers)
  .post(
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(
    getUserValidator,
    getUser
  )
  .put(
    
    
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    deleteUserValidator,
    deleteUser
  );

module.exports = router;
