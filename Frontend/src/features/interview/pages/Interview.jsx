import React, { useState, useEffect } from 'react'
import '../styles/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams, Link } from 'react-router'
import { FileText, ChevronDown, ArrowLeft, Home, Mic } from 'lucide-react'
import { createPortal } from 'react-dom'
import LoadingBar from "../components/LoadingBar.jsx"

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical' },
    { id: 'behavioral', label: 'Behavioral' },
    { id: 'roadmap', label: 'Road Map' },
]

const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <ChevronDown size={18} />
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const [ showFloatBtn, setShowFloatBtn ] = useState(false)
    const { report, getReportById, loading, pdfLoading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])

    useEffect(() => {
    const handleScroll = (e) => {
        const target = e.target === document ? document.documentElement : e.target
        const scrollTop = target.scrollTop ?? window.scrollY
        setShowFloatBtn(scrollTop > 20)
    }
    document.addEventListener('scroll', handleScroll, true)
    return () => document.removeEventListener('scroll', handleScroll, true)
}, [])

    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <div className="loading-spinner"></div>
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'

    return (
        <div className='interview-page'>
            {pdfLoading && <LoadingBar label="Downloading your resume" />}

            <div className='interview-top-actions'>
                <Link to="/" className='top-action-btn'>
                    <Home size={17} />
                    <span>Home</span>
                </Link>

                <Link to="/mock-interview" className='top-action-btn top-action-btn--glow'>
                    <Mic size={17} />
                    <span>Mock Interview</span>
                </Link>
            </div>
            <div className='interview-layout'>
                <aside className='interview-sidebar'>
                    <div className='sidebar-card match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className='match-score__header'>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <div className='equalizer-bars'>
                            {Array.from({ length: 10 }).map((_, index) => {
                                const activeThreshold = (index + 1) * 10;
                                const isActive = report.matchScore >= activeThreshold;
                                return (
                                    <div 
                                        key={index} 
                                        className={`equalizer-bar ${isActive ? 'equalizer-bar--active' : ''}`}
                                        style={{ height: `${35 + (index % 4) * 15}%` }}
                                    />
                                );
                            })}
                        </div>
                        <p className='match-score__sub'>Strong match for this role</p>
                    </div>

                    <div className='sidebar-card skill-gaps'>
                        <p className='skill-gaps__label'>Top Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps.map((gap, i) => (
                                <span key={i} className='skill-tag'>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>

                <nav className='interview-nav'>
                    <div className="nav-content">
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="nav-actions">
                    </div>
                </nav>


                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{report.technicalQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{report.behavioralQuestions.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{report.preparationPlan.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                <button
                    onClick={() => { getResumePdf(interviewId) }}
                    className={`primary-floating-btn ${showFloatBtn ? 'primary-floating-btn--visible' : ''}`}>
                    <FileText size={18} />
                    <span>Download Resume</span>
                </button>

            </div>
        </div>
    )
}

export default Interview