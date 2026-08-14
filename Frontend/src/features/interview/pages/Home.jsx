// this is the home page for the interview feature
// here only user provide the job description, self description and the resume pdf

import React, { useState, useRef } from 'react'
import '../styles/home.scss'
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from 'react-router';
import { Briefcase, User, Paperclip, Upload, Info, ArrowRight } from 'lucide-react';

const Home = () => {

  const { loading, generateReport, reports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files[0];

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
        <div className="loading-spinner"></div>
        <h1>Generating your interview report...</h1>
        <p className="loading-sub">This usually takes 10–20 seconds</p>
      </main>
    )
  }

  return (
    <div className="home-page">

      {/* background glow */}
      <div className="bg-glow bg-glow--top"></div>
      <div className="bg-glow bg-glow--bottom"></div>

      {/* page header */}
      <div className="page-header">
        <span className="eyebrow">AI-Powered Interview Prep</span>
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
              <span className="step-number">1</span>
              <span className="panel__icon">
                <Briefcase size={20} />
              </span>
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
            <span className="char-counter">{jobDescription.length} / 2000</span>
          </div>

          <div className="panel-divider"></div>

          {/* right panel — resume + self description */}
          <div className="panel panel--right">

            <div className="panel__header panel__header--sub">
              <span className="step-number">2</span>
              <span className="panel__icon">
                <User size={20} />
              </span>
              <h2>About You</h2>
            </div>

            <div className="upload-section">
              <div className="section-label">
                <Paperclip size={15} />
                <span>Upload Resume (PDF)</span>
                <span className="badge badge--best">Best</span>
              </div>
              <label htmlFor="resume" className="dropzone">
                <span className="dropzone__icon">
                  <Upload size={22} />
                </span>
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
              <Info size={16} className="info-box__icon" />
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
            <span>Generate Report</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Recent Reports List */}
      {reports && reports.length > 0 && (
        <section className='recent-reports'>
          <h2>My Recent Interview Plans</h2>
          <ul className='reports-list'>
            {reports.map(report => (
              <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                <div className="report-item__top">
                  <h3>{report.title || 'Untitled Position'}</h3>
                  <span className={`score-pill ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                    {report.matchScore}%
                  </span>
                </div>
                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
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