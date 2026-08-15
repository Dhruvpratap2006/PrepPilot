// src/features/interview/pages/Home.jsx
import React, { useState, useRef } from 'react';
import '../styles/home.scss';
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth_features/hooks/useAuth';
import { Briefcase, User, Paperclip, Upload, Info, ArrowRight, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
  const { loading, generateReport, reports } = useInterview();

  const [jobDescription, setJobDescription] = useState(
    () => sessionStorage.getItem("jobDescription") || ""
  );

  const [selfDescription, setSelfDescription] = useState(
    () => sessionStorage.getItem("selfDescription") || ""
  );

  const [selectedFile, setSelectedFile] = useState(null);

  const resumeInputRef = useRef();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file");
      if (resumeInputRef.current) resumeInputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      if (resumeInputRef.current) resumeInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(null);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
  };

  const handleGenerateReport = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    const resumeFile = selectedFile || resumeInputRef.current?.files?.[0];

    if (!jobDescription && !selfDescription && !resumeFile) {
      toast.error("Please provide a job description, self description, or resume");
      return;
    }

    try {
      const data = await generateReport({ jobDescription, selfDescription, resumeFile });

      if (!data || !data._id) {
        toast.error("Failed to generate report. Please try again.");
        return;
      }

      sessionStorage.removeItem("jobDescription");
      sessionStorage.removeItem("selfDescription");

      navigate(`/interview/${data._id}`);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Something went wrong while generating your report.");
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loading-spinner"></div>
        <h1>Generating your interview report...</h1>
        <p className="loading-sub">This usually takes 10–20 seconds</p>
      </main>
    );
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
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                sessionStorage.setItem("jobDescription", e.target.value);
              }}
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

              {/* Hidden file input */}
              <input
                ref={resumeInputRef}
                type="file"
                name="resume"
                id="resume"
                accept=".pdf"
                onChange={handleFileChange}
                hidden
              />

              {!selectedFile ? (
                /* Default Dropzone */
                <label htmlFor="resume" className="dropzone">
                  <span className="dropzone__icon">
                    <Upload size={22} />
                  </span>
                  <p className="dropzone__title">Click or drag PDF to upload</p>
                  <p className="dropzone__subtitle">Max size 5MB</p>
                </label>
              ) : (
                /* Uploaded File Selected Card */
                <div className="selected-pdf-card">
                  <div className="selected-pdf-card__left">
                    <div className="pdf-badge">
                      <FileText size={18} className="pdf-badge__icon" />
                      <span>PDF</span>
                    </div>
                    <div className="pdf-meta">
                      <p className="pdf-meta__name" title={selectedFile.name}>
                        {selectedFile.name}
                      </p>
                      <p className="pdf-meta__sub">
                        PDF • {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="selected-pdf-card__remove"
                    onClick={handleRemoveFile}
                    title="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="or-divider">
              <span>OR</span>
            </div>

            <div className="self-description">
              <div className="section-label">
                <span>Self Description</span>
              </div>
              <textarea
                value={selfDescription}
                onChange={(e) => {
                  setSelfDescription(e.target.value);
                  sessionStorage.setItem("selfDescription", e.target.value);
                }}
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
            className="generate-btn"
          >
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
    </div>
  );
};

export default Home;