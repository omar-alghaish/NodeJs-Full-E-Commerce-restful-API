const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
    {
        cartItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectID,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                color: String,
                price: Number,
            },
        ],
        totalCartPrice: {
            type: Number,
            default: 0,
        },
        totalPriceAfterDiscount: Number,
        user: {
            type: mongoose.Schema.Types.ObjectID,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
