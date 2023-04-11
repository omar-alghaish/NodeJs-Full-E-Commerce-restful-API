const Category = require("../models/category.model");
const asyncHandler = require("express-async-handler");
const factory = require('./handlerFactory')
const {uploadSingleImage}= require("../middlwares/uploadImageMiddleware")

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 50 })
    .toFile(`uploads/categories/${filename}`);

    // save image into our db
    req.body.image = filename
  next();
});

// @description      Get list of categories
// @route            CET   /api/v1/categories
// @access           Public
exports.getCategories = factory.getAll(Category)

// @description      Get specific category by id
// @route            GET /api/v1/cagegries/:id
// @access           public
exports.getCategory = factory.getOne(Category)

// @description      create category
// @route            POST  /api/v1/categeries
// @access           Private
exports.createCategory = factory.createOne(Category)


// @description      update specific category
// @route            Put  /api/v1/categeries/:id
// @access           Private

exports.updateCategory = factory.updateOne(Category)


// @description      Delet specific category
// @route            DELEtE  /api/v1/categeries/:id
// @access           Private

exports.deleteCategory = factory.deleteOne(Category)