const mockInterviewModel = require("../models/mockInterview.model");
const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf, evaluateAnswer } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        const { selfDescription, jobDescription } = req.body;

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });
    } catch (error) {
        console.error("Error in generateInterViewReportController:", error);
        res.status(500).json({ message: "Failed to generate interview report." });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });
    } catch (error) {
        console.error("Error in getInterviewReportByIdController:", error);
        res.status(500).json({ message: "Failed to fetch interview report." });
    }
}

/** * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });
    } catch (error) {
        console.error("Error in getAllInterviewReportsController:", error);
        res.status(500).json({ message: "Failed to fetch interview reports." });
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;
        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;
        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error in generateResumePdfController:", error);
        res.status(500).json({ message: "Failed to generate resume PDF." });
    }
}

/**
 * @description Controller to initialize and start the mock interview session.
 */
async function startMockInterviewController(req, res) {
    try {
        const { interviewReportId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        // Technical aur Behavioral questions dono ko aapas mein jod kar total count nikalna
        const totalQuestionsCount = (interviewReport.technicalQuestions?.length || 0) + (interviewReport.behavioralQuestions?.length || 0);

        const mockInterview = await mockInterviewModel.create({
            user: req.user.id,
            interviewReport: interviewReport._id,
            currentQuestion: 0,
            answers: [],
            overallScore: 0,
            status: "in-progress"
        });

        const firstQuestion = interviewReport.technicalQuestions[0] || interviewReport.behavioralQuestions[0];

        res.status(201).json({
            message: "Mock interview started successfully",
            sessionId: mockInterview._id,
            question: firstQuestion,
            totalQuestions: totalQuestionsCount // ✨ Frontend ko exact total length bhej di
        });
    } catch (error) {
        console.error("Error in startMockInterviewController:", error);
        res.status(500).json({ message: "Failed to start mock interview session." });
    }
}

/**
 * @description Controller to handle answer submission and dynamic evaluation queue.
 */
async function submitAnswerController(req, res) {
    try {
        const { sessionId, candidateAnswer } = req.body;

        const mockInterview = await mockInterviewModel.findById(sessionId);
        if (!mockInterview) {
            return res.status(404).json({
                message: "Mock interview session not found"
            });
        }

        const interviewReport = await interviewReportModel.findById(mockInterview.interviewReport);

        // Dono arrays ko merge karke pure pool ki list nikalna
        const allQuestions = [
            ...interviewReport.technicalQuestions,
            ...interviewReport.behavioralQuestions
        ];

        const totalQuestionsCount = allQuestions.length;
        const currentQuestion = allQuestions[mockInterview.currentQuestion];

        if (!currentQuestion) {
            return res.status(400).json({
                message: "No more questions left"
            });
        }

        // Gemini API dynamic evaluation route
        const evaluation = await evaluateAnswer({
            question: currentQuestion.question,
            idealAnswer: currentQuestion.answer,
            candidateAnswer
        });

        mockInterview.answers.push({
            question: currentQuestion.question,
            idealAnswer: currentQuestion.answer,
            candidateAnswer,
            score: evaluation.score,
            feedback: evaluation.feedback,
            strengths: evaluation.strengths,
            weaknesses: evaluation.weaknesses
        });

        // Pointer index to go to next question
        mockInterview.currentQuestion += 1;
        const nextQuestion = allQuestions[mockInterview.currentQuestion];

        // ✨ Agar koi naya sawal nahi bacha hai, toh session complete set karein
        if (!nextQuestion) {
            mockInterview.status = "completed";
            const totalScore = mockInterview.answers.reduce((sum, answer) => sum + answer.score, 0);
            mockInterview.overallScore = totalScore / mockInterview.answers.length;
        }

        await mockInterview.save();

        res.status(200).json({
            evaluation,
            nextQuestion,
            completed: !nextQuestion,
            totalQuestions: totalQuestionsCount // ✨ Dynamic count update on submission loop
        });
    } catch (error) {
        console.error("Error in submitAnswerController:", error);
        res.status(500).json({ message: "Failed to evaluate answer." });
    }
}

/**
 * @description Controller to get final scorecard results of completed mock interview session.
 */
async function getMockInterviewResultController(req, res) {
    try {
        const { sessionId } = req.params;
        const mockInterview = await mockInterviewModel.findById(sessionId);

        if (!mockInterview) {
            return res.status(404).json({
                message: "Mock interview session not found"
            });
        }

        res.status(200).json({
            message: "Mock interview result fetched successfully",
            mockInterview
        });
    } catch (error) {
        console.error("Error in getMockInterviewResultController:", error);
        res.status(500).json({ message: "Failed to fetch mock interview results." });
    }
}

module.exports = { 
    generateInterViewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    generateResumePdfController,
    startMockInterviewController,
    submitAnswerController,
    getMockInterviewResultController 
};