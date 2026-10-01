const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        unique: [true, "This username is already taken. Please choose another one."],
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: [true, "An account with this email already exists."],
        required: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;