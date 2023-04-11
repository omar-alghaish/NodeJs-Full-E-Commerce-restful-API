const Coupon = require("../models/coupon.model");
const asyncHandler = require("express-async-handler");
const factory = require('./handlerFactory')


// @description      Get list of coupons
// @route            CET   /api/v1/coupons
// @access           Privete/ Admin | manager
exports.getCoupons = factory.getAll(Coupon)

// @description      Get specific Coupon by id
// @route            GET /api/v1/coupons/:id
// @access           Privete/ Admin | manager
exports.getCoupon = factory.getOne(Coupon)

// @description      create Coupon
// @route            POST  /api/v1/coupons
// @access           Privete/ Admin | manager
exports.createCoupon = factory.createOne(Coupon)


// @description      update specific Coupon
// @route            Put  /api/v1/coupons/:id
// @access           Privete/ Admin | manager

exports.updateCoupon = factory.updateOne(Coupon)


// @description      Delet specific coupon
// @route            DELEtE  /api/v1/coupon/:id
// @access           Privete/ Admin | manager

exports.deleteCoupon = factory.deleteOne(Coupon)