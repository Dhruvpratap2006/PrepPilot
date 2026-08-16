import { useState } from "react";
import { useMockInterview } from "../../hooks/useMockInterview";
import LoadingBar from "../../components/LoadingBar";
import { Briefcase, Layers, GraduationCap, Code2, FileText, Hash, ListFilter, ArrowRight } from "lucide-react";
import "../../styles/mockInterview.scss";

function MockInterviewSetup() {

    const { startInterview, loading } = useMockInterview();

    const [formData, setFormData] = useState({
        role: "",
        domain: "",
        experienceLevel: "Fresher",
        techStack: "",
        jobDescription: "",
        numQuestions: 5,
        category: "Mixed",
    });

    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!formData.role || !formData.domain) {
            setError("Please fill in role and domain");
            return;
        }

        await startInterview(formData);
    }

    return (
        <div className="home-page">
            {loading && <LoadingBar label="Generating your questions" />}
            <div className="bg-glow bg-glow--top"></div>
            <div className="bg-glow bg-glow--bottom"></div>

            <a href="/mock-interview"></a>
            <div className="page-header">
                <span className="eyebrow">MOCK INTERVIEW</span>
                <h1>Set up your practice round</h1>
                <p>
                    Tell us who you're interviewing as — we'll build a
                    <span className="highlight"> tailored question set</span> for you to answer out loud.
                </p>
            </div>

            <form className="interview-card" onSubmit={handleSubmit}>
                {error && <p className="form-error">{error}</p>}

                <div className="interview-card__body">

                    <div className="panel">
                        <div className="panel__header">
                            <span className="step-number">1</span>
                            <span className="panel__icon"><Briefcase size={20} /></span>
                            <h2>Role Details</h2>
                            <span className="badge badge--required">Required</span>
                        </div>

                        <div className="field">
                            <label><Layers size={14} /> Target Role</label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="e.g. Frontend Developer"
                            />
                        </div>

                        <div className="field">
                            <label><Briefcase size={14} /> Domain</label>
                            <input
                                type="text"
                                name="domain"
                                value={formData.domain}
                                onChange={handleChange}
                                placeholder="e.g. Web Development"
                            />
                        </div>

                        <div className="field">
                            <label><GraduationCap size={14} /> Experience Level</label>
                            <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                                <option value="Fresher">Fresher</option>
                                <option value="Mid-Level">Mid-Level (2-4 yrs)</option>
                                <option value="Senior">Senior/Lead</option>
                            </select>
                        </div>

                        <div className="field">
                            <label><ListFilter size={14} /> Question Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                <option value="Technical">Technical</option>
                                <option value="Behavioral">Behavioral</option>
                                <option value="Mixed">Mixed</option>
                            </select>
                        </div>
                    </div>

                    <div className="panel panel--right">
                        <div className="panel__header">
                            <span className="step-number">2</span>
                            <span className="panel__icon"><Code2 size={20} /></span>
                            <h2>Add Context</h2>
                            <span className="badge">Optional</span>
                        </div>

                        <div className="field">
                            <label><Code2 size={14} /> Tech Stack</label>
                            <input
                                type="text"
                                name="techStack"
                                value={formData.techStack}
                                onChange={handleChange}
                                placeholder="e.g. React, Node.js, MongoDB"
                            />
                        </div>

                        <div className="field self-description">
                            <label><FileText size={14} /> Job Description</label>
                            <textarea
                                className="panel__textarea panel__textarea--short"
                                name="jobDescription"
                                value={formData.jobDescription}
                                onChange={handleChange}
                                placeholder="Paste a JD here for more tailored questions"
                            />
                        </div>

                        <div className="field">
                            <label><Hash size={14} /> Number of Questions</label>
                            <select name="numQuestions" value={formData.numQuestions} onChange={handleChange}>
                                <option value={3}>3</option>
                                <option value={5}>5</option>
                                <option value={7}>7</option>
                                <option value={10}>10</option>
                            </select>
                        </div>

                        <div className="info-box">
                            <span className="info-box__icon">i</span>
                            <p><strong>Tip:</strong> more context means sharper, more relevant questions.</p>
                        </div>
                    </div>
                </div>

                <div className="interview-card__footer">
                    <span className="footer-info">You'll answer these out loud once the interview begins</span>
                    <button type="submit" className="generate-btn" disabled={loading}>
                        <span>{loading ? "Generating Questions..." : "Start Interview"}</span>
                        <ArrowRight size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default MockInterviewSetup;