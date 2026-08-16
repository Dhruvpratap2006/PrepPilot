import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})

export const generateMockQuestions = async ({ role, domain, experienceLevel, techStack, jobDescription, numQuestions, category }) => {
    const response = await api.post("/api/interview/generate-mock-questions", {
        role,
        domain,
        experienceLevel,
        techStack,
        jobDescription,
        numQuestions,
        category,
    })

    return response.data
}

export const submitMockInterview = async ({ interviewData }) => {
    const response = await api.post("/api/interview/submit-mock-interview", { interviewData })

    return response.data
}