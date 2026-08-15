const express = require('express');
// we have require d the auth middleware to protect the route from unauthenticated users
const { authMiddleware } = require('../middlewares/auth.middleware');
const interviewController = require('../controllers/interview.controllers');
const upload = require('../middlewares/multer.middleware');

const interviewRouter = express.Router(); // express.router helps to create a new router object

/**
 * @route : POST /api/interview
 * @desc : generate a interview report on the basis of user self description and 
 * the job description provided by the user
 * @access : private means oncer user is logged in then only he can access this route
 */

// so first user should be authenticated and then the resume file should be uploaded and then the controller function should be called to generate the interview report
interviewRouter.post('/', authMiddleware, upload.single("resume"), interviewController.generateInterviewReportController);

/**
 * @route : GET /api/interview/report/:interviewId
 * @desc : get the interview report on the basis of interviewId provided by the user
 * bascially through this api we are going to see the specific interview report of the user
 * @access : private means oncer user is logged in then only he can access this route
 */
interviewRouter.get('/report/:interviewId', authMiddleware, interviewController.getInterviewReportByIdController);

/**
 * @route: GET/api/interview
 * @description: get all the interview reports of the logged in user
 * @access: private 
**/
interviewRouter.get('/', authMiddleware, interviewController.getAllInterviewReportsController);

/**
 * @route: GET/api/interview/resume/pdf
 * @description: generate a PDF of the resume on the basis of the user job, self-description and resume
 * @access: private 
 */
interviewRouter.post('/resume/pdf/:interviewReportId', authMiddleware, interviewController.generateResumePDFController);

/**
 * @route : POST /api/interview/submit-mock-interview
 * @description : submit a mock interview and get feedback on the basis of the user answers and the job description provided by the user
 * @access : private means once user is logged in then only he can access this route 
 */
interviewRouter.post("/submit-mock-interview", authMiddleware, interviewController.submitMockInterviewController);


module.exports = interviewRouter;
