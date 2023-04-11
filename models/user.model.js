const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "name required"],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        email: {
            type: String,
            required: [true, "email required"],
            unique: true,
            lowercase: true,
        },
        phone: {
            type: String,
        },
        profileImg: {
            type: String,
        },
        password: {
            type: String,
            required: [true, "password required"],
            minlength: [6, "too short password"],
        },
        passwordChangeAt: Date,
        passwordResetCode: String,
        passwordResetExpires:Date,
        passwordResetVerified:false,
        role: {
            type: String,
            enum: ["user", "admin", "manager"],
            default: "user",
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    //hashing password
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
