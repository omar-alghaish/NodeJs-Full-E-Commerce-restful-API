
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const {uploadSingleImage}= require("../middlwares/uploadImageMiddleware")
const Brand = require("../models/brand.model");
const factory = require('./handlerFactory')

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 50 })
    .toFile(`uploads/brands/${filename}`);

    // save image into our db
    req.body.image = filename
  next();
});


// @description      Get list of brands
// @route            CET   /api/v1/brands
// @access           Public

exports.getBrands = factory.getAll(Brand)


// @description      Get specific brand by id
// @route            GET /api/v1/brands/:id
// @access           public

exports.getBrand = factory.getOne(Brand)

// @description      create brand
// @route            POST  /api/v1/brands
// @access           Private

exports.createBrand = factory.createOne(Brand)



// @description      update specific brand
// @route            Put  /api/v1/brands/:id
// @access           Private

exports.updateBrand = factory.updateOne(Brand)


// @description      Delet specific brand
// @route            DELEtE  /api/v1/brands/:id
// @access           Private

exports.deleteBrand = factory.deleteOne(Brand)
