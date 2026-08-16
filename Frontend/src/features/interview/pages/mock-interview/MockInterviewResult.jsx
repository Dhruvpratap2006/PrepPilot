import { useState, useEffect } from "react";
import { useMockInterview } from "../../hooks/useMockInterview";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import "../../styles/mockInterview.scss";

function MockInterviewResult() {

    // feedback object backend se aaya hua hai — humein isko display karna hai bas
    // resetInterview() sab state clear karke wapas "setup" step pe le jayega
    const { feedback, resetInterview } = useMockInterview();

    // yeh score ko 0 se actual value tak animate karne ke liye hai — page load hote hi
    // bar 0% se dhire dhire actual score tak bharega, static dikhne ke bajaye
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        if (!feedback) return;
        const timeout = setTimeout(() => setAnimatedScore(feedback.overallScore), 100);
        return () => clearTimeout(timeout);
    }, [feedback]);

    if (!feedback) {
        return <p>No feedback available.</p>;
    }

    // score ke color decide karne ke liye — low score red, mid yellow, high green
    // isse user ko turant visually pata chal jata hai kaisa perform kiya
    function getScoreColor(score) {
        if (score >= 7) return "#4ade80";
        if (score >= 4) return "#facc15";
        return "#f87171";
    }

    return (
        <div className="home-page">
            <div className="bg-glow bg-glow--top"></div>
            <div className="bg-glow bg-glow--bottom"></div>

            <div className="page-header">
                <span className="eyebrow">MOCK INTERVIEW</span>
                <h1>Your Interview Feedback</h1>
            </div>

            <div className="result-hero">
                <div className="score-ring">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                        <circle
                            cx="80" cy="80" r="65"
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="12"
                        />
                        <circle
                            cx="80" cy="80" r="65"
                            fill="none"
                            stroke={getScoreColor(feedback.overallScore)}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 65}
                            strokeDashoffset={2 * Math.PI * 65 - (animatedScore / 10) * (2 * Math.PI * 65)}
                            transform="rotate(-90 80 80)"
                        />
                    </svg>
                    <div className="score-ring__text">
                        <span className="score-ring__number">{feedback.overallScore}</span>
                        <span className="score-ring__max">/ 10</span>
                    </div>
                </div>

                <div className="result-hero__summary">
                    <span className="badge">Overall Assessment</span>
                    <p>{feedback.summary}</p>
                </div>
            </div>

            <div className="result-section">
                <h2 className="result-section__title">Question-wise Breakdown</h2>

                <div className="question-feedback-list">
                    {feedback.questionWiseFeedback.map((item, index) => (
                        <div className="question-feedback-card" key={index}>
                            <div className="question-feedback-card__top">
                                <p className="question-feedback-card__question">
                                    <span className="question-feedback-card__q-num">Q{index + 1}</span>
                                    {item.question}
                                </p>
                                <span
                                    className="question-feedback-card__score"
                                    style={{ color: getScoreColor(item.score) }}
                                >
                                    {item.score}/10
                                </span>
                            </div>

                            {/* score bar — score jitna zyada, bar utna bhara hua */}
                            <div className="score-bar">
                                <div
                                    className="score-bar__fill"
                                    style={{
                                        width: `${item.score * 10}%`,
                                        background: getScoreColor(item.score),
                                    }}
                                ></div>
                            </div>

                            <p className="question-feedback-card__feedback">{item.feedback}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="result-section">
                <h2 className="result-section__title">Action Plan</h2>

                <div className="action-plan-list">
                    {feedback.finalActionPlan.map((point, index) => (
                        <div className="action-plan-item" key={index}>
                            <CheckCircle2 size={18} className="action-plan-item__icon" />
                            <p>{point}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="result-footer">
                <button className="generate-btn" onClick={resetInterview}>
                    <RotateCcw size={18} />
                    <span>Start New Interview</span>
                </button>
            </div>
        </div>
    );
}

export default MockInterviewResult;