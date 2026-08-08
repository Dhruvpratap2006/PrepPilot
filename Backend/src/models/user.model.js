const mongoose = require('mongoose');

// here we are going to create a user model or its schema

const userSchema = new mongoose.Schema({


    username : {
        type : String,
        unique: [true, "This username is already taken. Please choose another one."],
        required : true,
    },

    email : {
        type : String,
        unique: [true, "An account with this email already exists."]
    },

    password : {
        type : String,
        required : true
    }

})

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;

