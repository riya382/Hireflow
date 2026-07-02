import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,   // ye line change ki
    withCredentials: true,
})


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data

}




/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}


/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return response.data
}


/**
 * @description Start mock interview session
 */
export const startMockInterview = async (interviewReportId) => {
    const response = await api.post(
        `/api/interview/mock/start/${interviewReportId}`
    )

    return response.data
}


export const submitMockAnswer = async ({
    sessionId,
    candidateAnswer
}) => {
    const response = await api.post(
        "/api/interview/mock/answer",
        {
            sessionId,
            candidateAnswer
        }
    )

    return response.data
}

export const getMockInterviewResult = async (sessionId) => {
    const response = await api.get(
        `/api/interview/mock/result/${sessionId}`
    )

    return response.data
}