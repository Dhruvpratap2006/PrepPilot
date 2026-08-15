import "../auth.form.scss"
import { useNavigate, Link } from "react-router"
import { useLocation } from "react-router";
import { useState } from "react"
import { Grid2x2, Eye, EyeOff } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import loginImage from "../../../assets/images/authImages/LOGIN.png"
import { useAuth } from "../hooks/useAuth"

export const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);

    const { loading , handleLogin} = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleGoogleLogin = () => {
    // Direct browser redirect to backend OAuth endpoint
        window.location.href = "http://localhost:3000/api/auth/google";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle login logic
        await handleLogin({ email, password })
        // as user gets succesfully login then we can navigete it to 
        // home page
        // navigate('/');
        const redirectTo = location.state?.from || "/";
        navigate(redirectTo);
    }

    if (loading) {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                <Grid2x2 className="loading-brand-icon" size={32} />
                <div className="loader"></div>
                <p>Logging in...</p>
            </div>
        </div>
    )
}

    return (
        <main className="auth-page">
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

                            {/* <div className="forgot-password">
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </div> */}

                            <button type="submit" className="button primary-button">Log in</button>
                        </form>

                        <div className="divider"><span>Or</span></div>

                        {/* Social Login */}
                        <div className="social-auth-buttons">
                            <button onClick={handleGoogleLogin} type="button" className="btn-social google">
                                <FcGoogle size={18} />
                                <span>Continue with Google</span>
                            </button>
                            
                        </div>

                    </div>
                </div>

            </div>
        </main>
    )
}