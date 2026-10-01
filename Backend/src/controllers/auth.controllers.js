// basically we are going to write all auth releated controllers here

const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs"); // we are going to use this to hash the password before saving it to the db
const tokenBlackListModel = require("../models/blacklist.model"); // we are going to use this to store the logged-out token in a blacklist

// small helper so cookie options are identical everywhere instead of
// being retyped (and possibly mistyped) in every controller
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
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

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedUsername = username.trim();

        // now if user exists then check that user in db means from user model
        const isUserExists = await userModel.findOne({
            $or: [{ username: normalizedUsername }, { email: normalizedEmail }]
        });

        // if user already exists then send a message to the user that user already exists with the same username or email
        if (isUserExists) {
            return res.status(400).json({
                message: "User already exists with the same username or email"
            });
        }

        // hash the password before saving it to the db
        const hash = await bcrypt.hash(password, 10);

        // for this we have to create a new user in the db with the hashed password 
        const user = await userModel.create({
            username: normalizedUsername,
            email: normalizedEmail,
            password: hash
        });

        // now to use jwt we have to generate a token for the user
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        // set token in cookies (for same-site/local dev)
        res.cookie("token", token, cookieOptions);

        // send the response with token (so frontend can also store in localStorage for cross-origin deployments)
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "something went wrong while registering the user",
            error: err.message
        });
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

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide both email and password"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // now first check in db that user exists with email or not
        const user = await userModel.findOne({ email: normalizedEmail });

        // if user do not exists then sends a message
        if (!user) {
            return res.status(400).json({
                message: "User does not exists with this email or password"
            });
        }

        if (!user.password) {
            return res.status(400).json({
                message: "User does not exists with this email or password"
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({
                message: "User does not exists with this email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            message: "user logged-in successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "something went wrong while logging in the user",
            error: err.message
        });
    }

}

// logout controller
/**
 @name : logoutUserController
 @description : This controller is responsible for logging out a user.
 @acess : public    
 */

async function logoutUserController(req, res) {
    try {
        let token = req.cookies?.token;
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (token) {
            await tokenBlackListModel.create({ token });
        }
        res.clearCookie("token", cookieOptions);
        res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Logout failed", error: err.message });
    }
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

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "user deatils fetch successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "something went wrong while getting the current user details"
        });
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}