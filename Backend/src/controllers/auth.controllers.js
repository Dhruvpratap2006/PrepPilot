// basically we are going to write all auth releated controllers here

const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs"); // we are going to use this to hash the password before saving it to the db
const tokenBlackListModel = require("../models/blacklist.model"); // we are going to use this to store the logged-out token in a blacklist

// small helper so cookie options are identical everywhere instead of
// being retyped (and possibly mistyped) in every controller
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days — matches expiresIn below
};

/**
 * @name registerUserController
 * @description This controller is responsible for registering a new user. 
 * Excepts the user name , email and password from the request body and creates a new user in the database.
 * @access Public
 * 
 */
async function registerUserController(req, res) {

    try {
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
            $or: [{ username }, { email }] // $or helps us to check multiple condition at the same time and 
            // here we are checking if user exists with the same username or email
            // if any condiiton is true then return that user from the db   
        })

        // if user already exists then send a message to the user that user already exists with the same username or email
        if (isUserExists) {
            return res.status(400).json({
                message: "User already exists with the same username or email"
            })
        }

        // hash the password before saving it to the db
        const hash = await bcrypt.hash(password, 10) // 10 is the salt rounds means how many times
        //  we want to hash the password
        // now this hash password will not directly be saved to the db

        // for this we have to create a new user in the db with the hashed password 
        const user = await userModel.create({
            username,
            email,
            password: hash
        })

        // now to use jwt we have to generate a token for the user
        // after user do a successful registration
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET, // this is the secret key which we will use to sign the token
            { expiresIn: "2d" }
        )

        // now the token which we have create we are going to set in the cookies
        res.cookie("token", token, cookieOptions);

        // now send the response to the user
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })
    } catch (err) {
        res.status(500).json({
            message: "something went wrong while registering the user",
            error: err.message
        })
    }

}


// login controller
/**
 * @name : loginUserController
 * @description : This controller is responsible for logging in a user.
 * excepts the email and password from the request body
 * @acess : public
 */

async function loginUserController(req, res) {

    try {
        // extract the email and password from user req body
        const { email, password } = req.body;

        // now first check in db that user exists with email or not
        const user = await userModel.findOne({ email });

        // if user do not exists then sends a message
        if (!user) {
            return res.status(400).json({
                message: "User does not exists with this email or password"
            })
        }

        // a Google-only account has no password (password field is not
        // required for OAuth users), so we check for that before comparing
        if (!user.password) {
            return res.status(400).json({
                message: "Please login using Google for this account"
            })
        }

        // now if user exists then check that the password is valid or not
        // for this we are going to use the bcrypt.compare function and
        // it will compare both password that come from user req and that 
        // which is store in db
        const isValidPassword = await bcrypt.compare(password, user.password);

        // if password so not valid
        if (!isValidPassword) {
            return res.status(400).json({
                message: "User does not exists with this email or password"
            })
        }

        // once again make token as logIn and signUp are both different session

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        )

        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            message: "user logged-in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })
    } catch (err) {
        res.status(500).json({
            message: "something went wrong while logging in the user",
            error: err.message
        })
    }

}

// logout controller
/**
 @name : logoutUserController
 @description : This controller is responsible for logging out a user.
 @acess : public    
 */

async function logoutUserController(req, res) {
    // for logout we are going to clear the cookie which we have set for the user
    const token = req.cookies.token;

    if (token) {
        await tokenBlackListModel.create({ token }) // we are going to store the logged-out token in a blacklist
    }
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    })
}

//  controller for authMiddleware which is get-me
/**
 * @name getMeController
 * @description get the current logged in user details
 * @acess private
 */

async function getMeController(req, res) {

    try {
        const user = await userModel.findById(req.user.id);
        // now this req.user.id we are getting from the decoded part from authMiddleware

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "user deatils fetch successfully",
            // now here in res we are going to send the current user details
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        res.status(500).json({
            message: "something went wrong while getting the current user details"
        })
    }
}

/**
 * @name googleCallbackController
 * @description Runs after passport has verified the Google login and attached
 * the user to req.user. Issues our own JWT + cookie so the rest of the app
 * (which only knows about our JWT cookie system) works the same way it does
 * for normal email/password login.
 * @access Public
 */
async function googleCallbackController(req, res) {
    try {
        const user = req.user;

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        )

        res.cookie("token", token, cookieOptions);

        res.redirect(process.env.CLIENT_URL);
    } catch (err) {
        res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    googleCallbackController
}