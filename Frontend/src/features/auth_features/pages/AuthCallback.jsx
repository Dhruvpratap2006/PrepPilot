// src/features/auth_features/pages/AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../hooks/useAuth";


export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth(); // Agar context mein user state refresh karne ka function hai

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (token) {
      localStorage.setItem("token", token);
      if (checkAuth) checkAuth();
      navigate("/"); // Redirect to home ya dashboard
    } else {
      navigate("/login?error=oauth_failed");
    }
  }, [searchParams, navigate, checkAuth]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p>Logging you in via Google...</p>
    </div>
  );
}