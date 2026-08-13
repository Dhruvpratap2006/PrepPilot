// this is the home page for the interview feature
// here only user provide the job description, self description and the resume pdf

import React, { useState, useRef } from 'react'
import '../styles/home.scss'
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from 'react-router'

const Home = () => {

  const { loading, generateReport, reports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];

    if (!jobDescription && !selfDescription && !resumeFile) {
      alert("Please provide a job description, self description, or resume");
      return;
    }

    try {
      const data = await generateReport({ jobDescription, selfDescription, resumeFile });

      if (!data || !data._id) {
        alert("Failed to generate report. Please try again.");
        return;
      }

      navigate(`/interview/${data._id}`);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Something went wrong while generating your report.");
    }
  }

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Generating your interview report...</h1>
      </main>
    )
  }

  return (
    <div className="home-page">

      {/* page header */}
      <div className="page-header">
        <h1>Interview Prep</h1>
        <p>
          Get an AI-generated <span className="highlight">interview report</span> based on your resume, job description, and self description.
        </p>
      </div>

      {/* main card */}
      <div className="interview-card">
        <div className="interview-card__body">

          {/* left panel — job description */}
          <div className="panel panel--left">
            <div className="panel__header">
              <span className="panel__icon">📄</span>
              <h2>Job Description</h2>
              <span className="badge badge--required">Required</span>
            </div>
            <textarea
              onChange={(e) => (setJobDescription(e.target.value))}
              className="panel__textarea"
              name="jobDescription"
              id="jobDescription"
              placeholder="Paste the job description here..."
            ></textarea>
            <span className="char-counter">0 / 2000</span>
          </div>

          <div className="panel-divider"></div>

          {/* right panel — resume + self description */}
          <div className="panel panel--right">

            <div className="upload-section">
              <div className="section-label">
                <span>📎</span>
                <span>Upload Resume (PDF)</span>
                <span className="badge badge--best">Best</span>
              </div>
              <label htmlFor="resume" className="dropzone">
                <span className="dropzone__icon">⬆️</span>
                <p className="dropzone__title">Click or drag PDF to upload</p>
                <p className="dropzone__subtitle">Max size 5MB</p>
              </label>
              <input
                ref={resumeInputRef}
                type="file"
                name="resume"
                id="resume"
                accept=".pdf"
                hidden
              />
            </div>

            <div className="or-divider">
              <span>OR</span>
            </div>

            <div className="self-description">
              <div className="section-label">
                <span>✍️</span>
                <span>Self Description</span>
              </div>
              <textarea
                onChange={(e) => (setSelfDescription(e.target.value))}
                className="panel__textarea panel__textarea--short"
                name="selfDescription"
                id="selfDescription"
                placeholder="Briefly describe your skills and experience..."
              ></textarea>
            </div>

            <div className="info-box">
              <span className="info-box__icon">ℹ️</span>
              <p>
                <strong>Tip:</strong> Upload a resume or write a self description — at least one is required.
              </p>
            </div>

          </div>
        </div>

        <div className="interview-card__footer">
          <span className="footer-info">Your data is used only to generate this report.</span>
          <button
            onClick={handleGenerateReport}
            className="generate-btn">
            Generate Report
          </button>
        </div>
      </div>

       {/* Recent Reports List */}
            {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

      <div className="page-footer">
        <a href="/about">About</a>
        <a href="/privacy">Privacy</a>
      </div>

    </div>
  )
}

export default Home