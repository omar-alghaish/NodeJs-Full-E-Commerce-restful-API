const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Brand required"],
            unique: [true, "Brand must be unique"],
            minlength: [3, "Too short Brand name"],
            maxlength: [32, "Too long Brand name"],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

const setImageUrl = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
};

// will work with getOne, getAll, updateOne
brandSchema.post("init", function (doc) {
    setImageUrl(doc);
});


// will work with createOne 
brandSchema.post("save", function (doc) {
    //return image base url + image name
    setImageUrl(doc);
});


const BrandModel = mongoose.model("Brand", brandSchema);

module.exports = BrandModel;
