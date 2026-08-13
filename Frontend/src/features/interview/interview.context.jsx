import { createContext, useState } from "react";

export const InterviewContext = createContext()

export const InterviewerProvider = ( {children} ) => {

    const [loading, setLoading] = useState(false)

    const [report, setReport] = useState(null)

    const [reports, setReports] = useState([])

    return (
        <InterviewContext.Provider value={ {loading, setLoading, report, setReport, reports, setReports} }>
            {children}
        </InterviewContext.Provider>
    )
}