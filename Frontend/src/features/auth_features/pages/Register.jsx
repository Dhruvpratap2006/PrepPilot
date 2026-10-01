import "../auth.form.scss"
import { useNavigate, Link } from "react-router"
import { useAuth } from "../hooks/useAuth"
import { useState } from "react"
import { Grid2x2, Eye, EyeOff } from "lucide-react"
import registerImage from "../../../assets/images/authImages/register.png"
import LoadingBar from "../../interview/components/LoadingBar"
import toast from "react-hot-toast"

export const Register = () => {
    const navigate = useNavigate();

    const { loading, error, handleRegister } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const registeredUser = await handleRegister({ username, email, password });
        if (registeredUser) {
            toast.success("Account created successfully!");
            navigate("/");
        } else {
            toast.error(error || "Registration failed. Please try again.");
        }
    };

    return (
        <main className="auth-page">
            {loading && <LoadingBar label="Creating your account" />}
            <div className="auth-card">

                {/* Left side - visual + tagline */}
                    <div className="branding-panel">
                        <div className="visual-blob"></div>

                        {/* illustration placeholder - apna mascot/image yaha daal sakte ho */}
                        <div className="mascot-wrapper">
                            <img src={registerImage} alt="PrepPilot AI Assistant" className="mascot-img" />
                        </div>

                        <div className="branding-text">
                            <h2>Your AI interview coach that gets you hired faster.</h2>
                            <p>PrepPilot analyzes your resume, closes your skill gaps, and preps you with real interview questions — one session at a time.</p>
                        </div>
                    </div>

                {/* Right side - form */}
                <div className="form-panel">
                    <div className="form-container">

                        <Grid2x2 className="brand-icon" size={28} />

                        <h1>Welcome to PrepPilot</h1>
                        <p className="subtitle">
                            Already have an account? <Link to="/login">Login here</Link>
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
                            {/* Username */}
                            <div className="input-group">
                                <input 
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="text" 
                                    id="username" 
                                    name="username" 
                                    placeholder="Enter your username" 
                                    required 
                                />
                            </div>

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

                            <button type="submit" className="button primary-button">Create Account</button>
                        </form>

                    </div>
                </div>

            </div>
        </main>
    )
}