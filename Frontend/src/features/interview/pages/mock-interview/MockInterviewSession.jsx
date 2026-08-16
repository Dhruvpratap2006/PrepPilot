// here we are going to write the code for mock interview session

// IMPORTANT
// SpeechRecognition ek built-in browser API which allows us to convert spoken words into text.
// so for our mock interview feature we are going to use this API

import { useState, useRef } from "react";
import { useMockInterview } from "../../hooks/useMockInterview";
import { Mic, Square, ArrowRight, Send } from "lucide-react";
import toast from "react-hot-toast";
import LoadingBar from "../../components/LoadingBar";
import "../../styles/mockInterview.scss";


function MockInterviewSession() {

    // yeh sab hook se aa raha hai — questions already Setup step mein generate ho chuke hain
    // interviewData mein har question ka { question, answer } object hai (answer abhi khali hai)
    // updateAnswer function ek specific index ka answer update karta hai
    // submitInterview poora interviewData backend ko bhejta hai feedback ke liye
    const { questions, interviewData, updateAnswer, submitInterview, loading } = useMockInterview();

    // now currentIndex will show which question is present on the screen 
    // and we are going to start the index from 0
    const [currentIndex, setCurrentIndex] = useState(0);

    // isRecording will tell that mic is on or off
    const [isRecording, setIsRecording] = useState(false);

     // liveTranscript woh text hai jo abhi-abhi bola ja raha hai, real-time mein dikhane ke liye
    const [liveTranscript, setLiveTranscript] = useState("");

    // useRef React ka ek hook hai jo humein koi value store karne deta hai, 
    // aur us value ke change hone par component re-render nahi hota.

    // useRef isliye use kiya kyunki humein SpeechRecognition ka wahi ek object
    // baar baar chahiye (start/stop karne ke liye) bina re-render trigger kiye
    const recognitionRef = useRef(null);

    // now this function will start the microphone and start recording the answer
    function startRecording() {

        // now this speech recognition API is not supported in all browsers, 
        // so we are going to check that in current browser which speech recognition API is available
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            toast.error(
                "Your browser does not support voice recognition. Please use Chrome."
            );
            return;
        }

        const recognition = new SpeechRecognition(); // create a new instance of SpeechRecognition

        recognition.continuous = true; // if user speaks by taking some pause also then also it will listen
        recognition.interimResults = true; // this will give us the live transcript of what user is speaking
        recognition.lang = "en-US"; // language of the speech recognition is English

        // now this event will be worktill user speaks and browser is listening to the user
        recognition.onresult = (event) => {
            let transcript = "";
            // event.results mein saare parts hote hain jo ab tak sune gaye
            // hum sabko jodke ek poora text bana rahe hain
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            setLiveTranscript(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error); // here we are logging the error in console
        };

        recognitionRef.current = recognition; // store the recognition object in the ref so that we can access it later for stopping the recording
        recognition.start(); // start the speech recognition
        setIsRecording(true); // set the isRecording state to true so that we can show the stop button on the screen
    }

    // yeh function microphone band karta hai aur jo bhi text capture hua use save karta hai
    function stopRecording() {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);

        // liveTranscript jo bhi tha, usko is current question ke answer mein save kar do
        updateAnswer(currentIndex, liveTranscript);
    }

    function goToNextQuestion() {
        if (isRecording) {
            stopRecording(); // agar recording chal rahi hai, pehle usse save karo
        }
        if (!interviewData[currentIndex]?.answer) {
            toast.error("Please answer the question before moving to the next one.");
            return;
        }
        setLiveTranscript("");
        setCurrentIndex((prev) => prev + 1);
    }

    async function handleSubmit() {
        if (isRecording) {
            stopRecording();
        }
        if (!interviewData[currentIndex]?.answer) {
            toast.error("Please answer the question before submitting.");
            return;
        }
        await submitInterview();
    }

    // yeh check karta hai ki hum last question pe hain ya nahi
    const isLastQuestion = currentIndex === questions.length - 1;

    return (
        // pura page ka single wrapper — ismein hi loading overlay, background glow,
        // header, aur session-card sab kuch andar aata hai (pehle galti se yeh
        // div aur uske andar ke bg-glow/page-header do baar likh gaye the, ab
        // sirf ek hi baar hai)
        <div className="home-page session-page">

            {/* jab submit ke baad AI se feedback aane ka wait ho raha ho,
                yeh full-screen striped loading bar dikhega upar se */}
            {loading && <LoadingBar label="Analyzing your answers" />}

            {/* background glow — same theme wala background effect jo Home page pe bhi hai */}
            <div className="bg-glow bg-glow--top"></div>
            <div className="bg-glow bg-glow--bottom"></div>

            <div className="page-header">
                <span className="eyebrow">MOCK INTERVIEW</span>
                <h1>Question {currentIndex + 1} of {questions.length}</h1>
            </div>

            <div className="session-card">

                {/* progress dots — har question ke liye ek dot, current wala bada/highlighted,
                    already-answered wale solid cyan */}
                <div className="progress-dots">
                    {questions.map((_, idx) => (
                        <span
                            key={idx}
                            className={`progress-dots__dot ${idx < currentIndex ? "done" : ""} ${idx === currentIndex ? "active" : ""}`}
                        ></span>
                    ))}
                </div>

                <div className="question-box">
                    <p>{questions[currentIndex]}</p>
                </div>

                {/* live captions / saved answer — teen states handle karta hai:
                    1) abhi bol raha hai (live text)
                    2) bol chuka hai, recording band hai (saved answer, dim color mein)
                    3) kuch nahi bola abhi tak (placeholder text) */}
                <div className="transcript-box">
                    {liveTranscript ? (
                        <p className="transcript-box__live">{liveTranscript}</p>
                    ) : !isRecording && interviewData[currentIndex]?.answer ? (
                        <p className="transcript-box__saved">{interviewData[currentIndex].answer}</p>
                    ) : (
                        <p className="transcript-box__placeholder">Your answer will appear here as you speak...</p>
                    )}
                </div>

                {/* bada circular mic button — recording ke time laal ho jata hai aur pulse
                    (ripple) animation chalti hai, taaki clearly dikhe ki abhi record ho raha hai */}
                <div className="mic-section">
                    <button
                        className={`mic-btn ${isRecording ? "mic-btn--recording" : ""}`}
                        onClick={isRecording ? stopRecording : startRecording}
                    >
                        {isRecording ? <Square size={22} /> : <Mic size={26} />}
                    </button>
                    <span className="mic-section__label">
                        {isRecording ? "Recording... tap to stop" : "Tap to start answering"}
                    </span>
                </div>

                <div className="session-footer">
                    {!isLastQuestion ? (
                        <button className="generate-btn" onClick={goToNextQuestion} disabled={isRecording}>
                            <span>Next Question</span>
                            <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button className="generate-btn" onClick={handleSubmit} disabled={isRecording || loading}>
                            <span>{loading ? "Generating Feedback..." : "Submit Interview"}</span>
                            <Send size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

}

export default MockInterviewSession;