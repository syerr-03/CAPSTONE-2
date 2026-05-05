import { useState } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

import "../App.css";

function Register({ goToLogin }) {
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputStyle = {
    width: "100%",
    border: "1px solid #ddd",
    padding: "14px",
    fontSize: "16px",
    height: "50px",
    borderRadius: "10px",
    backgroundColor: "#F9FAFB",
    color: "#111827"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: "500",
    textAlign: "left",
    paddingLeft: "2px"
  };

  const isValidEmail = email.endsWith("@gmail.com");

  const isValidPassword =
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[!@#&]/.test(password);

  const canGoNextStep1 = name && isValidEmail;
  const canRegister =
    username &&
    isValidPassword &&
    confirmPassword &&
    password === confirmPassword;

  const handleRegister = async () => {
  try {
    // create account dalam Firebase Authentication
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = userCredential.user;

    // simpan data dalam Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      username: username,
      role: "student",
      createdAt: new Date()
    });

    alert("Account created successfully!");
    goToLogin();

  } catch (error) {
    alert(error.message);
  }
};

  return (
    <div
      className="app"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #F5F3FF, #EDE9FE)"
      }}
    >
      <div className="module-card" style={{ width: "100%", maxWidth: "430px" }}>
        <h1 className="main-title" style={{ textAlign: "center" }}>
          Create Account
        </h1>

        {step === 1 && (
          <>
            <p className="hero-subtitle" style={{ textAlign: "center", marginBottom: "20px" }}>
              Enter your personal details
            </p>

            <div style={{ marginBottom: "15px", textAlign: "left" }}>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "15px", textAlign: "left" }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                style={inputStyle}
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {email && !isValidEmail && (
                <p style={{ color: "red", fontSize: "12px", marginTop: "6px" }}>
                  Email must use @gmail.com
                </p>
              )}
            </div>

            <button
              className="hero-button"
              disabled={!canGoNextStep1}
              style={{
                width: "100%",
                marginTop: "15px",
                opacity: canGoNextStep1 ? 1 : 0.5,
                cursor: canGoNextStep1 ? "pointer" : "not-allowed"
              }}
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="hero-subtitle" style={{ textAlign: "center", marginBottom: "20px" }}>
              Security Setup
            </p>

            <div style={{ marginBottom: "15px", textAlign: "left" }}>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "15px", textAlign: "left" }}>
              <label style={labelStyle}>Password</label>

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  style={{ ...inputStyle, paddingRight: "45px" }}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer"
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>

              {password && !isValidPassword && (
                <p style={{ color: "red", fontSize: "12px", marginTop: "6px" }}>
                  Password must be at least 6 characters, include 1 uppercase letter and 1 symbol (!@#&).
                </p>
              )}
            </div>

            <div style={{ marginBottom: "15px", textAlign: "left" }}>
              <label style={labelStyle}>Confirm Password</label>

              <div style={{ position: "relative" }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  style={{ ...inputStyle, paddingRight: "45px" }}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer"
                  }}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </span>
              </div>

              {confirmPassword && password !== confirmPassword && (
                <p style={{ color: "red", fontSize: "12px", marginTop: "6px" }}>
                  Password does not match.
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button
                className="hero-button"
                style={{ width: "50%" }}
                onClick={() => setStep(1)}
              >
                Back
              </button>

              <button
                className="hero-button"
                disabled={!canRegister}
                style={{
                  width: "50%",
                  opacity: canRegister ? 1 : 0.5,
                  cursor: canRegister ? "pointer" : "not-allowed"
                }}
                onClick={handleRegister}
              >
                Register
              </button>
            </div>
          </>
        )}

        <p style={{ textAlign: "center", fontSize: "14px", marginTop: "20px" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#7C3AED", cursor: "pointer", fontWeight: "600" }}
            onClick={goToLogin}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;

