// basically in our route folder we are going to add all our apis routes
// and the logic of all these routes present in their respective controllers folders
// and in this file we are going to add the all authentication releated apis

// router is a tool of express which allows us or helps in do grouping of apis
// means all authentication releaed one group 
// all other releate apis in one group like this

const { Router } = require('express');
const authController = require('../controllers/auth.controllers');   


const authRouter = Router();

/**
 * @route POST /api/auth/reister means req type post 
 * @description to register a new user
 * @access public 
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



module.exports = authRouter;
