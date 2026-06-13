const mockInterviewModel = require("../models/mockInterview.model")
const pdfParse = require("pdf-parse")
const {generateInterviewReport,generateResumePdf,evaluateAnswer} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

async function startMockInterviewController(req, res) {

    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewReportId,
        user: req.user.id
    })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }

    const mockInterview = await mockInterviewModel.create({
        user: req.user.id,
        interviewReport: interviewReport._id,
        currentQuestion: 0,
        answers: [],
        overallScore: 0,
        status: "in-progress"
    })

    const firstQuestion =
        interviewReport.technicalQuestions[0] ||
        interviewReport.behavioralQuestions[0]

    res.status(201).json({
        message: "Mock interview started successfully",
        sessionId: mockInterview._id,
        question: firstQuestion
    })
}

async function submitAnswerController(req, res) {

    const { sessionId, candidateAnswer } = req.body

    const mockInterview = await mockInterviewModel.findById(sessionId)

    if (!mockInterview) {
        return res.status(404).json({
            message: "Mock interview session not found"
        })
    }

    const interviewReport = await interviewReportModel.findById(
        mockInterview.interviewReport
    )

    const allQuestions = [
        ...interviewReport.technicalQuestions,
        ...interviewReport.behavioralQuestions
    ]

    const currentQuestion =
        allQuestions[mockInterview.currentQuestion]

    if (!currentQuestion) {
        return res.status(400).json({
            message: "No more questions left"
        })
    }

    const evaluation = await evaluateAnswer({
        question: currentQuestion.question,
        idealAnswer: currentQuestion.answer,
        candidateAnswer
    })

    mockInterview.answers.push({
        question: currentQuestion.question,
        idealAnswer: currentQuestion.answer,
        candidateAnswer,
        score: evaluation.score,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses
    })

    mockInterview.currentQuestion += 1

    const nextQuestion =
        allQuestions[mockInterview.currentQuestion]

    if (!nextQuestion) {

        mockInterview.status = "completed"

        const totalScore =
            mockInterview.answers.reduce(
                (sum, answer) => sum + answer.score,
                0
            )

        mockInterview.overallScore =
            totalScore / mockInterview.answers.length
    }

    await mockInterview.save()

    res.status(200).json({
        evaluation,
        nextQuestion,
        completed: !nextQuestion
    })
}


async function getMockInterviewResultController(req, res) {

    const { sessionId } = req.params

    const mockInterview = await mockInterviewModel.findById(sessionId)

    if (!mockInterview) {
        return res.status(404).json({
            message: "Mock interview session not found"
        })
    }

    res.status(200).json({
        message: "Mock interview result fetched successfully",
        mockInterview
    })
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController,startMockInterviewController,submitAnswerController,getMockInterviewResultController }