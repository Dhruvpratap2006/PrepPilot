// basically in our route folder we are going to add all our apis routes
// and the logic of all these routes present in their respective controllers folders
// and in this file we are going to add the all authentication releated apis

// router is a tool of express which allows us or helps in do grouping of apis
// means all authentication releaed one group 
// all other releate apis in one group like this

const { Router } = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controllers');
const { authMiddleware } = require('../middlewares/auth.middleware');

const authRouter = Router();

/**
 * @route POST /api/auth/reister means req type post 
 * @description to register a new user
 * @access public 
 *
 */
authRouter.post("/register", authController.registerUserController);

/**
    * @route POST /api/auth/login 
    * @description to login a user
    * @access public 
*/
authRouter.post("/login", authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description to logout a user and to clear the token  from the browser and add the token in blacklist
 * @access public 
 */
authRouter.get("/logout", authController.logoutUserController);

// now we are going to setup one middleware to get-me which will tell the current user info
/**
 * @route GET/api/auth/get-me 
 * @description to get current user info
 * @access private
 */

authRouter.get("/get-me", authMiddleware, authController.getMeController)

// these all are google authentication routes which we are going to use for google authentication

/**
 * @route : GET => /api/auth/google
 * @description: this route will take the user to google authentication page
 * @access: public
 */

// here in passport.authenticate "google" means that we are using the google strategy 
// which we make in passport.js and in scope we are saying that gave me the excess of user
// profile and email and nothng else
// session fale as we are saying to passport do not make any session as we are going to use the JWT
authRouter.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
)

/**
 * @route : GET => /api/auth/google/callback
 * @description: this route will take the user to google authentication page and after that it will redirect to the callback url
 * @access: public
 */

authRouter.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    authController.googleCallbackController
);

module.exports = authRouter;