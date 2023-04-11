const { check, body } = require("express-validator");

const slugify = require("slugify");

const validatorMiddleware = require("../../middlwares/validatorMiddleware");
const Category = require("../../models/category.model");
const SubCategory = require("../../models/subCategoryModel");
exports.createProductValidator = [
    check("title")
        .isLength({ min: 3 })
        .withMessage("must be at least 3 chars")
        .notEmpty()
        .withMessage("Product required"),
    check("description")
        .notEmpty()
        .withMessage("Product description is required")
        .isLength({ max: 2000 })
        .withMessage("Too long description"),
    check("quantity")
        .notEmpty()
        .withMessage("Product quantity is reqired")
        .isNumeric()
        .withMessage("Product quantity must be a number"),
    check("sold")
        .optional()
        .isNumeric()
        .withMessage("product quantity must be a number"),
    check("price")
        .notEmpty()
        .withMessage("Product price is required")
        .isNumeric()
        .withMessage("Product must be a number")
        .isLength({ max: 32 })
        .withMessage("too long price"),
    check("priceAfterDiscount")
        .optional()
        .isNumeric()
        .withMessage("Product price after discount must be a number")
        .toFloat()
        .custom((value, { req }) => {
            if (req.body.price <= value) {
                throw new Error("priceAfterDiscount must be lower than price");
            }
            return true;
        }),
    check("colors")
        .optional()
        .isArray()
        .withMessage("colors should be array of string"),
    check("imageCover").notEmpty().withMessage("Price imae cover is required"),
    check("images")
        .optional()
        .isArray()
        .withMessage("images should be array of string"),
    check("category")
        .notEmpty()
        .withMessage("Product must be belong to a category")
        .isMongoId()
        .withMessage("Invalid ID formate")
        .custom((categoryId) =>
            Category.findById(categoryId).then((category) => {
                if (!category) {
                    return Promise.reject(
                        new Error(`No category for this id: ${categoryId}`)
                    );
                }
            })
        ),
    check("subcategories")
        .optional()
        .isMongoId()
        .withMessage("Invalid ID formate")
        .custom((subcategoriesIds) => {
            SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
                (result) => {
                    if (result.length < 1 || result.length != subcategoriesIds.length) {
                        return Promise.reject(new Error(`invalid subcategories ids`));
                    }
                }
            );
        }),
    check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
    check("ratingsAverage")
        .optional()
        .isNumeric()
        .withMessage("ratings average must be a number")
        .isLength({ min: 1 })
        .withMessage("Rating must be above or equal 1.0")
        .isLength({ max: 5 })
        .withMessage("Rating must be below or equal 5.0"),
    check("ratingsQuantity")
        .optional()
        .isNumeric()
        .withMessage("rating quantity must be a number"),
        body("title").custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

exports.getProductValidator = [
    check("id").isMongoId().withMessage("Invalid ID formate"),
    validatorMiddleware,
];

exports.updateProductValidator = [
    check("id").isMongoId().withMessage("Invalid ID formate"),
    body("title")
        .optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

exports.deleteProductValidator = [
    check("id").isMongoId().withMessage("Invalid ID formate"),
    validatorMiddleware,
];
