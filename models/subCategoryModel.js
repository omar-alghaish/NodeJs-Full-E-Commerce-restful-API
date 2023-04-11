const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: [true, "SubCategory must be uniqie"],
        minlength: [2, "Too short subCategory name"],
        maxlength: [32, "Too long subCategory name"]
    },
    slug: {
        type: String,
        lowercase: true,
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "category",
        required: [true, "must be belong to parent category"]
    }
}, { timestamp: true })


module.exports = mongoose.model('SubCategory', subCategorySchema)