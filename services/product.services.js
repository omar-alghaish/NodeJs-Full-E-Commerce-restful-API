const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadMixOfImages } = require("../middlwares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");

const Product = require("../models/product.model");
const factory = require("./handlerFactory");

exports.uploadProductImages = uploadMixOfImages([
    {
        name: "imageCover",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 5,
    },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
    // 1-Image processing for imageCover
    if (req.files.imageCover) {
        const filename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${filename}`);

        // save image into our db
        req.body.imageCover = filename;
    }
    //2- Image processing for images
    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (img, index) => {
                const filename = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
                await sharp(img.buffer)
                    .resize(2000, 1333)
                    .toFormat("jpeg")
                    .jpeg({ quality: 95 })
                    .toFile(`uploads/products/${filename}`);

                // save image into our db
                req.body.images.push(filename);
            })
        );
        
    }
    next();
});

// @description      Get list of products
// @route            CET   /api/v1/products
// @access           Public

exports.getProducts = factory.getAll(Product);

// @description      Get specific product by id
// @route            GET /api/v1/products/:id
// @access           public

exports.getProduct = factory.getOne(Product, 'reviews');

// @description      create product
// @route            POST  /api/v1/products
// @access           Private
exports.createProduct = factory.createOne(Product);

// @description      update specific product
// @route            Put  /api/v1/products/:id
// @access           Private

exports.updateProduct = exports.updateCategory = factory.updateOne(Product);

// @description      Delet specific product
// @route            DELEtE  /api/v1/products/:id
// @access           Private

exports.deleteProduct = factory.deleteOne(Product);
