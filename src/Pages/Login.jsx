import { useState } from "react";
import '../App.css'; 

function Login({ goToRegister, goToDashboard }) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = () => {
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please fill all fields");
      return;
    }

    const savedUser = localStorage.getItem("username");
    const savedPass = localStorage.getItem("password");

    if (username !== savedUser || password !== savedPass) {
      setError("Invalid username or password");
      return;
    }

    setSuccess("Login Successful!");
    setTimeout(() => {
        goToDashboard();
    }, 1000);
  };

  return (
    <div className="app module-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="module-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 className="main-title" style={{ textAlign: 'center' }}>Welcome Back!</h1>
        <p className="hero-subtitle" style={{ textAlign: 'center', marginBottom: '20px' }}>Sign in to your account</p>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Username</label>
          <input
            type="text"
            className="search-input" // Guna style input sedia ada
            style={{ width: '100%', border: '1px solid #ddd' }}
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              className="search-input"
              style={{ width: '100%', border: '1px solid #ddd' }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {error && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{error}</p>}
        {success && <p style={{ color: "green", fontSize: "12px", marginTop: "5px" }}>{success}</p>}

        <button className="hero-button" style={{ width: "100%", marginTop: "15px" }} onClick={handleLogin}>
          Sign In
        </button>

        <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '20px' }}>
          Don’t have an account? <span 
            style={{ color: "#7C3AED", cursor: "pointer", fontWeight: '600' }} 
            onClick={goToRegister}>Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;