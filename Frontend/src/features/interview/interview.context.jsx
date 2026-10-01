// import { createContext, useState } from "react";

// export const InterviewContext = createContext()

// export const InterviewerProvider = ( {children} ) => {

//     const [loading, setLoading] = useState(false)

//     const [pdfLoading, setPdfLoading] = useState(false)

//     const [report, setReport] = useState(null)

//     const [reports, setReports] = useState([])

//     return (
//         <InterviewContext.Provider value={ {loading, setLoading, pdfLoading, setPdfLoading, report, setReport, reports, setReports} }>
//             {children}
//         </InterviewContext.Provider>
//     )
// }


import { createContext, useState } from "react";

export const InterviewContext = createContext()

export const InterviewerProvider = ( {children} ) => {

    const [loading, setLoading] = useState(false)

    const [generatingReport, setGeneratingReport] = useState(false)

    const [pdfLoading, setPdfLoading] = useState(false)

    const [report, setReport] = useState(null)

    const [reports, setReports] = useState([])

    return (
        <InterviewContext.Provider value={ {loading, setLoading, generatingReport, setGeneratingReport, pdfLoading, setPdfLoading, report, setReport, reports, setReports} }>
            {children}
        </InterviewContext.Provider>
    )
}