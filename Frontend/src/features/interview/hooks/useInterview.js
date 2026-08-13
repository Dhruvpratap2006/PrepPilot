import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from '../services/interview.api'
import { useContext, useEffect } from 'react'
import { InterviewContext } from '../interview.context'
import {useParams} from 'react-router'

export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            console.error("Error generating interview report:", error)
        } finally {
            setLoading(false)
        }

        return response?.interviewReport
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

        return response?.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([response], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()                       
            window.URL.revokeObjectURL(url)     
        }
        catch (error) {
            // agar error response bhi blob hai, usse readable JSON mein convert karo
            if (error.response?.data instanceof Blob) {
                const errorText = await error.response.data.text()
                try {
                    const errorJson = JSON.parse(errorText)
                    console.log(errorJson.message)
                } catch {
                    console.log("Failed to generate resume PDF")
                }
            } else {
                console.log(error)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])


    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }
}