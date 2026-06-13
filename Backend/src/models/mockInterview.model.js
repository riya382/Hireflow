const mongoose = require("mongoose")

const answerSchema = new mongoose.Schema({
    question: String,

    idealAnswer: String,

    candidateAnswer: String,

    score: Number,

    feedback: String,

    strengths: [String],

    weaknesses: [String]
}, {
    _id: false
})

const mockInterviewSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },

    interviewReport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewReport"
    },

    currentQuestion: {
        type: Number,
        default: 0
    },

    answers: [answerSchema],

    overallScore: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ["in-progress", "completed"],
        default: "in-progress"
    }

}, {
    timestamps: true
})

module.exports = mongoose.model(
    "MockInterview",
    mockInterviewSchema
)