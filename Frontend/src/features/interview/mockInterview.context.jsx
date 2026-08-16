import { createContext, useState } from "react";

export const MockInterviewContext = createContext()

export const MockInterviewProvider = ({ children }) => {

    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState([])
    const [interviewData, setInterviewData] = useState([])
    const [feedback, setFeedback] = useState(null)
    const [step, setStep] = useState("setup") // "setup" | "interview" | "result"

    return (
        <MockInterviewContext.Provider value={{
            loading, setLoading,
            questions, setQuestions,
            interviewData, setInterviewData,
            feedback, setFeedback,
            step, setStep,
        }}>
            {children}
        </MockInterviewContext.Provider>
    )
}