
const Review = require("../models/review.model");
const factory = require('./handlerFactory')
const asyncHandler = require("express-async-handler");


exports.createFilterObj = (req,res,next) =>{
    let filterObject = {};
    if (req.params.productId) filterObject ={product:req.params.productId};
    req.filterObj = filterObject;
    next()
  }

// @description      Get list of reviews
// @route            CET   /api/v1/reviews
// @access           Public

exports.getReviews = factory.getAll(Review)


// @description      Get specific review by id
// @route            GET /api/v1/reviews/:id
// @access           public

exports.getReview = factory.getOne(Review)

// @description      create review
// @route            POST  /api/v1/reviews
// @access           Private/protect/user

exports.createReview = factory.createOne(Review)



// @description      update specific review
// @route            Put  /api/v1/reviews/:id
// @access           Private/protect/user

exports.updateReview = factory.updateOne(Review)


// @description      Delet specific review
// @route            DELEtE  /api/v1/reviews/:id
// @access           Private/protect/user-admin-maneger

exports.deleteReview = factory.deleteOne(Review)
