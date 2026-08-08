// basically we are going to write all auth releated controllers here

const userModel = require("../models/user.model")

/**
 * @name registerUserController
 * @description This controller is responsible for registering a new user. 
 * Excepts the user name , email and password from the request body and creates a new user in the database.
 * @access Public
 * 
 */
async function registerUserController(req, res) {

    // extract the user name , email and password from the request body
    const { username, email, password } = req.body;

    // if from req body we do not get any of these then send a message please fill all these fields then 
    // only user can register successfully
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide username, email and password"
        });
    }

    // now if user exists then check that user in db means from user model

    const isUserExists = await userModel.findOne({
        $or: [{}, {}] // $or helps us to check multiple condition at the same time and 
        // here we are checking if user exists with the same username or email
    })

}

module.exports = {
    registerUserController
}