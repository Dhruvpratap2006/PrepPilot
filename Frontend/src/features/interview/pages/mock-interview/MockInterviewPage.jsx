// this is the parent/orchestrator component for the whole mock interview feature
// it decides which screen to show — Setup, Session, or Result — based on the
// current "step" stored in our mock interview context

import { useNavigate } from "react-router";
import { Home } from "lucide-react";
import { useMockInterview } from "../../hooks/useMockInterview";
import MockInterviewSetup from "./MockInterviewSetup";
import MockInterviewSession from "./MockInterviewSession";
import MockInterviewResult from "./MockInterviewResult";
import "../../styles/mockInterview.scss";

function MockInterviewPage() {

    // step tells us which stage we are in right now — "setup", "interview", or "result"
    // this is already managed inside useMockInterview hook, we just read it here
    const { step } = useMockInterview();

    // navigate function lets us programmatically move to another route (like "/")
    const navigate = useNavigate();

    return (
        <div className="mock-interview-wrapper">

            {/* home button — fixed at top-left corner, visible on every step
                (setup, interview, result) because it lives here in the parent
                and doesn't get removed when the step changes */}
            <button className="home-nav-btn" onClick={() => navigate("/")}>
                <Home size={18} />
                <span>Home</span>
            </button>

            {/* only ONE of these three will ever render at a time,
                because "step" can only hold one value at once */}
            {step === "setup" && <MockInterviewSetup />}
            {step === "interview" && <MockInterviewSession />}
            {step === "result" && <MockInterviewResult />}
        </div>
    );
}

export default MockInterviewPage;