import { useState } from "react";
import '../App.css';

function Register({ goToLogin }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [level, setLevel] = useState("Beginner");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = (pass) => /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/.test(pass);

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!name || !isEmailValid) { setError("Please fill all fields correctly"); return; }
      setStep(2);
    } else if (step === 2) {
      if (!username || !passwordValid(password) || password !== confirmPassword) {
        setError("Check your security setup"); return;
      }
      setStep(3);
    }
  };

  const handleRegister = () => {
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    setSuccess("Registration Successfully!");
    setTimeout(() => goToLogin(), 2000);
  };

  return (
    <div className="app module-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="module-card" style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
        
        <p onClick={step === 1 ? goToLogin : () => setStep(step - 1)} 
           style={{ cursor: "pointer", fontSize: "24px", color: "#7C3AED", position: "absolute", top: "15px", left: "15px" }}>
          ←
        </p>

        <h1 className="main-title" style={{ textAlign: 'center', fontSize: '24px' }}>
          {step === 1 && "Create Account"}
          {step === 2 && "Security Setup"}
          {step === 3 && "Learning Level"}
        </h1>

        {step === 1 && (
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Full Name</label>
            <input className="search-input" style={{ width: '100%', border: '1px solid #ddd', marginBottom: '15px' }} 
                   value={name} onChange={(e) => setName(e.target.value)} />
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input className="search-input" style={{ width: '100%', border: '1px solid #ddd' }} 
                   value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="hero-button" style={{ width: "100%", marginTop: "20px" }} onClick={nextStep}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div style={{ marginTop: '20px' }}>
             <label>Username</label>
             <input className="search-input" style={{ width: '100%', border: '1px solid #ddd', marginBottom: '15px' }} 
                    value={username} onChange={(e) => setUsername(e.target.value)} />
             <label>Password</label>
             <input type={showPassword ? "text" : "password"} className="search-input" 
                    style={{ width: '100%', border: '1px solid #ddd' }} value={password} onChange={(e) => setPassword(e.target.value)} />
             <button className="hero-button" style={{ width: "100%", marginTop: "20px" }} onClick={nextStep}>Next</button>
          </div>
        )}

        {step === 3 && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <select value={level} onChange={(e) => setLevel(e.target.value)} 
                    style={{ width: "100%", padding: "12px", borderRadius: "12px", border: '1px solid #ddd', background: '#f3f4f6' }}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <button className="hero-button" style={{ width: "100%", marginTop: "20px" }} onClick={handleRegister}>Finish</button>
          </div>
        )}

        {error && <p style={{ color: "red", fontSize: "12px", marginTop: "10px", textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ color: "green", fontSize: "13px", marginTop: "15px", textAlign: "center" }}>{success}</p>}
      </div>
    </div>
  );
}

export default Register;