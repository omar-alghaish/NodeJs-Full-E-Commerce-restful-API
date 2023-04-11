const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const factory = require("./handlerFactory");
const ApiError = require("../utils/apiErrors");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middlwares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");
const createToken = require('../utils/createToken')

exports.uploadUserImage = uploadSingleImage("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 50 })
      .toFile(`uploads/users/${filename}`);

    // save image into our db
    req.body.profileImg = filename;
  }

  next();
});

// @description      Get list of Users
// @route            CET   /api/v1/users
// @access           Public

exports.getUsers = factory.getAll(User);

// @description      Get specific User by id
// @route            GET /api/v1/users/:id
// @access           public

exports.getUser = factory.getOne(User);

// @description      create User
// @route            POST  /api/v1/users
// @access           Private

exports.createUser = factory.createOne(User);

// @description      update specific User
// @route            Put  /api/v1/users/:id
// @access           Private

exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No ${Model} for this id ${req.params.id}`), 404);
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No ${Model} for this id ${req.params.id}`), 404);
  }
  res.status(200).json({ data: document });
});

// @description      Delet specific User
// @route            DELEtE  /api/v1/users/:id
// @access           Private

exports.deleteUser = factory.deleteOne(User);


// @description      Get logged user data 
// @route            GET  /api/v1/users/profile
// @access           Private/protect

exports.getLoggedUserData = asyncHandler(async (req,res,next)=>{
  req.params.id = req.user._id;
  next()
})

// @description     Update logged user password
// @route            PUT  /api/v1/users/updateMyPassword
// @access           Private/protect

exports.updateLoggedUserPassword = asyncHandler(async (req,res,next)=>{
  // 1) update user password based user payload (req.user._id)
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangeAt: Date.now(),
    },
    {
      new: true,
    }
  );
  // 2) cenerate token
  const token = createToken(user._id);
  res.status(200).json({data:user,token})
})

// @description     Update logged user data (without password, role)
// @route            PUT  /api/v1/users/updateMe
// @access           Private/protect
exports.updateLoggedUserData = asyncHandler(async (req,res,next)=>{
  const updatedUser = await User.findByIdAndUpdate(req.user._id,{
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone,
  },{new:true});
  res.status(200).json({data:updatedUser})
})

// @description      Deactivete logged user data (without password, role)
// @route            Delete  /api/v1/users/deleteMe
// @access           Private/protect
exports.deleteLoggedUserData = asyncHandler(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user._id,{active:false});
  res.status(200).json({status:"success"})
})
exports.activeUser = asyncHandler(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user._id,{active:true});
  res.status(200).json({status:"success"})
})