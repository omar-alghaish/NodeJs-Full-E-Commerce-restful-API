const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlwares/validatorMiddleware");
const Review = require("../../models/review.model");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("ratings value required ")
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating value must be between 1 to 5"),
  check("user").optional().isMongoId().withMessage("Invalid user id format"),
  check("product")
    .optional()
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom((value, { req }) =>
      // Check if logged user create review before
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("you already created a review before")
            );
          }
        }
      )
    ),

  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((value, { req }) =>
      // Check review ownership before update
      Review.findById(value).then((review) => {
        if (!review) {
          return Promise.reject(
            new Error(`there is no review with id ${value}`)
          );
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("you are not allowed to perform this action")
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) => {
      // Check review ownership before update
      if (req.user.role === "user") {
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`)
            );
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error(`Your are not allowed to perform this action`)
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
