import { useState, useEffect } from "react";

// yeh component real progress nahi jaanta (API kitna time lega pata nahi hota),
// isliye hum ek "fake but smooth" percentage badhate hain jab tak response na aa jaye,
// 90% tak khud badhta hai, phir jab loading khatam ho jaye toh 100% pe snap ho jata hai
function LoadingBar({ label = "Loading" }) {
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPercent((prev) => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 8;
            });
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="stripe-loader-overlay">
            <div className="stripe-loader">
                <span className="stripe-loader__label">{label}</span>
                <div className="stripe-loader__track">
                    <div
                        className="stripe-loader__fill"
                        style={{ width: `${Math.min(percent, 90)}%` }}
                    ></div>
                </div>
                <span className="stripe-loader__percent">{Math.round(Math.min(percent, 90))}%</span>
            </div>
        </div>
    );
}

export default LoadingBar;