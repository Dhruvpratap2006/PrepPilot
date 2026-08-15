// as we have to store the mock interview data (questions, answers, and AI feedback)
// so we are creating the model for it.

const mongoose = require("mongoose");

const mockInterviewSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },

    interviewData: [
        {
            question: {
                type: String,
                required: [true, "Question is required"]
            },
            answer: {
                type: String,
                required: [true, "Answer is required"]
            },
        }
    ],

    feedback: {
        overallScore: Number,
        summary: String,
        questionWiseFeedback: [
            {
                question: String,
                score: Number,
                feedback: String,
            }
        ],
        finalActionPlan: [String],
    }

}, {
    timestamps: true
})

const mockInterviewModel = mongoose.model("MockInterview", mockInterviewSchema);

module.exports = mockInterviewModel;