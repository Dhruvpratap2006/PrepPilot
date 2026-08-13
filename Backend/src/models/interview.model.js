// as we have to to store the interview report so we are 
// creating the model for it.

const mongoose = require("mongoose");

/**
 * user provide this information to generate the interview report
 * - Job Description : String
 * - resume text : String
 * - self description : String
 * 
 * AI will generate these and we are going to store these things
 * in DB
 * and this can be the format for this
 * 
 * - matchScore - Number
 * 
 * - Technical questions = will store in the form of an array
 * [{
 *   question,
 *   intention behind that question,
 *   answer
 * }]
 * 
 * - Behavioral questions = will store in the form of an array
 * [{
 *   question,
 *   intention behind that question,
 *   answer
 * }]
 * 
 * - Skill Gaps = will store in the form of an array
 * [{
 *   skills,
 *   severity,
 *   type : String, enum : low, medium, high
 * }]
 * 
 * - Preparation plan = will store in the form of an array of objects
 * as we are going to give the plan day wise
 * [{
 *   day : number,
 *   focusArea : String,
 *   tasks : Array of strings
 * }]
 */

// schema for technicalQuestions Schema
const technicalQuestionSchema = new mongoose.Schema({

    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }

}, {
    // we are going to embedded this schema in interviewReportSchema we don't want to store 
    // it separately so we are going to set _id to false
    _id: false
})


const behavioralQuestionSchema = new mongoose.Schema({
    
    question: {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention: {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required" ]
    }

}, {
    _id: false
})


const skillGapSchema = new mongoose.Schema({

    skill: {
        type: String,
        required: [ true, "Skill is required" ]
    },
    severity: {
        type: String,
        enum: [ "low", "medium", "high" ],
        required: [ true, "Severity is required" ]
    }

}, {
    _id: false
})



const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [ true, "Day is required" ]
    },
    focus: {
        type: String,
        required: [ true, "Focus is required" ]
    },
    tasks: [ {
        type: String,
        required: [ true, "Task is required" ]
    } ]
})



const interviewReportSchema = new mongoose.Schema({

    jobDescription : {
        type : String,
        required: true,
    },

    resume : {
        type : String,
    },

    selfDescription : {
        type : String,
    },

    matchScore : {
        type : Number,
        min : 0,
        max : 100,
    },

    technicalQuestions: [ technicalQuestionSchema ],
    
    behavioralQuestions: [ behavioralQuestionSchema ],
    
    skillGaps: [ skillGapSchema ],
    
    preparationPlan: [ preparationPlanSchema ],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    title: {
        type: String,
        required: [ true, "Job title is required" ]
    }
}, {
    timestamps: true
})


const interviewModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewModel;