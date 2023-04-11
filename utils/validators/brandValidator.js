const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlwares/validatorMiddleware");

exports.getBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Brand id format"),
    validatorMiddleware,
];

exports.createBrandValidator = [
    check("name")
        .notEmpty()
        .withMessage("Brand required")
        .isLength({ min: 3 })
        .withMessage("Too short name")
        .isLength({ max: 32 })
        .withMessage("Too long cagegory name"),
        body("name").custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

exports.updateBrandValidator = [
    check("id").optional().isMongoId().withMessage("Invalid Brand id format"),
    body("name").custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware,
];

exports.deleteBrandValidator = [
    check("id").isMongoId().withMessage("Invalid Brand id format"),
    validatorMiddleware,
];
