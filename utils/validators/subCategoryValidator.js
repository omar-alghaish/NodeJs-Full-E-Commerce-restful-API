const { check, body } = require("express-validator");
const validatorMiddleware = require('../../middlwares/validatorMiddleware')
const slugify = require("slugify");

exports.getsubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid subCategory id format"),
    validatorMiddleware
]

exports.createsubCategoryValidator = [
    check("name").notEmpty()
        .withMessage("subCategory required")
        .isLength({ min: 2 })
        .withMessage("Too short name")
        .isLength({ max: 32 })
        .withMessage("Too long cagegory name"),
        check('category').notEmpty()
        .withMessage("must belong to category")
        .isMongoId()
        .withMessage('invaled id'),
        body("name").custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
]

exports.updatesubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid subCategory id format"),
    body("name").custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware
]

exports.deletesubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid subCategory id format"),
    validatorMiddleware
]