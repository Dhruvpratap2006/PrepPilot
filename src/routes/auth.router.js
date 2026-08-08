// basically in our route folder we are going to add all our apis routes
// and the logic of all these routes present in their respective controllers folders
// and in this file we are going to add the all authentication releated apis

// router is a tool of express which allows us or helps in do grouping of apis
// means all authentication releaed one group 
// all other releate apis in one group like this

const { Router } = require('express');
const authController = require('./controllers/auth.controllers');

const authRouter = Router();

/**
 * now info of the apis
 * @route POST /api/auth/reister means req type post 
 * @description to register a new user
 * @access public 
 */

authRouter.post("/register", authController.registerUserController);

module.exports = authRouter;
