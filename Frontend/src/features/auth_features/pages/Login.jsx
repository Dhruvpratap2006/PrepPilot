import "../auth.form.scss"
import { useNavigate, Link } from "react-router"
import { useLocation } from "react-router";
import { useState } from "react"
import { Grid2x2, Eye, EyeOff } from "lucide-react"
import loginImage from "../../../assets/images/authImages/LOGIN.png"
import { useAuth } from "../hooks/useAuth"
import LoadingBar from "../../interview/components/LoadingBar";
import toast from "react-hot-toast";

export const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);

    const { loading, error, handleLogin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loggedInUser = await handleLogin({ email, password });
        if (loggedInUser) {
            toast.success("Welcome back!");
            const redirectTo = location.state?.from || "/";
            navigate(redirectTo);
        } else {
            toast.error(error || "Invalid email or password");
        }
    };

    return (
        <main className="auth-page">
            {loading && <LoadingBar label="Logging you in" />}
            <div className="auth-card">

                {/* Left side - visual + tagline */}
                <div className="branding-panel">
                    <div className="visual-blob"></div>

                    <div className="mascot-wrapper">
                        <img src={loginImage} alt="PrepPilot AI Assistant" className="mascot-img" />
                    </div>

                    <div className="branding-text">
                        <h2>Pick up right where you left off.</h2>
                        <p>Your saved progress, resume insights, and mock interviews are waiting for you.</p>
                    </div>
                </div>

                {/* Right side - form */}
                <div className="form-panel">
                    <div className="form-container">

                        <Grid2x2 className="brand-icon" size={28} />

                        <h1>Welcome back</h1>
                        <p className="subtitle">
                            Don't have an account? <Link to="/register">Register here</Link>
                        </p>

                        {error && (
                            <div style={{
                                color: "#f87171",
                                background: "rgba(248, 113, 113, 0.1)",
                                border: "1px solid rgba(248, 113, 113, 0.3)",
                                borderRadius: "8px",
                                padding: "10px 14px",
                                marginBottom: "16px",
                                fontSize: "0.88rem"
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Email */}
                            <div className="input-group">
                                <input 
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    placeholder="Enter your email" 
                                    required 
                                />
                            </div>

                            {/* Password */}
                            <div className="input-group">
                                <div className="password-wrapper">
                                    <input 
                                        onChange={(e) => setPassword(e.target.value)}
                                        type={showPassword ? "text" : "password"} 
                                        id="password" 
                                        name="password" 
                                        placeholder="Input Password" 
                                        required 
                                    />
                                    <button 
                                        type="button" 
                                        className="toggle-pw" 
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="button primary-button">Log in</button>
                        </form>

                    </div>
                </div>

            </div>
        </main>
    )
}