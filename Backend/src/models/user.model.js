const mongoose = require('mongoose');

// here we are going to create a user model or its schema

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: false,
    },

    username: {
        type: String,
        unique: [true, "This username is already taken. Please choose another one."],
        sparse: true,   // taaki multiple users bina username ke bhi ho sakein (Google users)
    },

    email: {
        type: String,
        unique: [true, "An account with this email already exists."],
        required: true,
    },

    password: {
        type: String,
        required: false,
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true,   // normal (email/password) users ke paas ye field hogi hi nahi
    },

})

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;