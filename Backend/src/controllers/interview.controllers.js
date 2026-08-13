const { generateInterviewReport, generateResumePDF, generatePdfFromHtml } = require('../services/ai.services');

const interviewReportModel = require('../models/interview.model');

/**
 * @desc : generate a interview report on the basis of user self description and the job description provided by the user
 * @access : private means once user is logged in then only he can access this route 
 */
async function generateInterviewReportController(req, res) {
    try {
        const resumeFile = req.file;

        if (!resumeFile && !req.body.selfDescription) {
            return res.status(400).json({ message: "Please provide a resume or self description" });
        }

        let resumeText = "";
        if (resumeFile) {
            const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
            resumeText = resumeContent.text;
        }

        const { jobDescription, selfDescription } = req.body;

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({ message: "Failed to generate interview report. Please try again." });
    }
}

/**
 * @desc : get the interview report of specific interview on the basis of interviewId.
 * @access : private
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        if (!interviewId || !interviewId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid interview ID" });
        }

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" });
        }

        res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReport
        });

    } catch (error) {
        console.error("Error fetching interview report:", error);
        res.status(500).json({ message: "Failed to fetch interview report" });
    }
}

/**
 * @description : get all the interview reports of the logged in user
 * @access : private
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });

    } catch (error) {
        console.error("Error fetching interview reports:", error);
        res.status(500).json({ message: "Failed to fetch interview reports" });
    }
}

/**
 * @description : generate a pdf of the interview report on the basis of ressume, self description and job description provided by the user
 */

async function generateResumePDFController(req, res) {
    try {
        const { interviewReportId } = req.params;

        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" });
        }

        const { html } = await generateResumePDF({
            resume: interviewReport.resume,
            selfDescription: interviewReport.selfDescription,
            jobDescription: interviewReport.jobDescription
        });

        const pdfBuffer = await generatePdfFromHtml(html);  // tumhara already-bana helper use kiya

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=resume-${interviewReportId}.pdf`
        });
        res.send(pdfBuffer);

    } catch (err) {
        console.error("Error generating resume PDF:", err);
        res.status(500).json({ message: "Failed to generate resume PDF" });
    }
}

module.exports = { generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePDFController };