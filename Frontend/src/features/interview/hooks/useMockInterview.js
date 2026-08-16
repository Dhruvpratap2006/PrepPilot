import { generateMockQuestions, submitMockInterview } from '../services/mockInterview.api'
import { useContext } from 'react'
import { MockInterviewContext } from '../mockInterview.context'

export const useMockInterview = () => {

    const context = useContext(MockInterviewContext)

    if (!context) {
        throw new Error("useMockInterview must be used within a MockInterviewProvider")
    }

    const {
        loading, setLoading,
        questions, setQuestions,
        interviewData, setInterviewData,
        feedback, setFeedback,
        step, setStep,
    } = context

    const startInterview = async (formData) => {
        setLoading(true)
        try {
            const response = await generateMockQuestions(formData)
            setQuestions(response.questions)
            setInterviewData(response.questions.map(q => ({ question: q, answer: "" })))
            setStep("interview")
        } catch (error) {
            console.error("Error generating mock interview questions:", error)
        } finally {
            setLoading(false)
        }
    }

    const submitInterview = async () => {
        setLoading(true)
        try {
            const response = await submitMockInterview({ interviewData })
            setFeedback(response.interview.feedback)
            setStep("result")
        } catch (error) {
            console.error("Error submitting mock interview:", error)
        } finally {
            setLoading(false)
        }
    }

    const updateAnswer = (index, answer) => {
        setInterviewData(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], answer }
            return updated
        })
    }

    const resetInterview = () => {
        setQuestions([])
        setInterviewData([])
        setFeedback(null)
        setStep("setup")
    }

    return {
        loading, questions, interviewData, feedback, step,
        startInterview, submitInterview, updateAnswer, resetInterview,
    }
}