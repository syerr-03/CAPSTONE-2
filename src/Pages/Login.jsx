import { useState } from "react";

import { updateLoginStreak } from "../streakService";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../firebase";

import "../App.css";

function Login({ goToRegister, goToDashboard }) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    // ===== ADMIN LOGIN (no registration) =====
    if (username === "Admin" && password === "Admin@123") {
      localStorage.setItem("name", "Admin");
      localStorage.setItem("role", "admin");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("welcomeType", "returning");

      setSuccess("Login Successful!");
      setTimeout(() => {
        goToDashboard();
      }, 500);
      return;
    }

    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );


      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Username not found");
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const email = userData.email;

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateLoginStreak(userCredential.user.uid);

      // 🔥 Simpan nama user
      localStorage.setItem("name", userData.name);

      // 🔥 Check user baru ke tak
      const justRegistered = localStorage.getItem("justRegistered") === "true";

      // 🔥 Set welcome type
      localStorage.setItem("welcomeType", justRegistered ? "new" : "returning");

      // 🔥 Clear flag register
      localStorage.removeItem("justRegistered");

      // Login success
      setSuccess("Login Successful!");
      localStorage.setItem("isLoggedIn", "true");

      setTimeout(() => {
        goToDashboard();
      }, 1000);
    } catch (error) {
      console.log("LOGIN ERROR:", error.code, error.message);
      setError(error.code);
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
      <div className="module-card" style={{ width: "100%", maxWidth: "400px" }}>
  
        <div style={{ textAlign: "center" }}>
          <img
            src="/logo.jpg"
            alt="BrainyBits Logo"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "15px"
            }}
          />

          <h1 className="main-title">
            Welcome to BrainyBits!
          </h1>
        </div>

        <p className="hero-subtitle" style={{ textAlign: "center", marginBottom: "20px" }}>
          Sign in to your account
        </p>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "500",
              textAlign: "left",
              paddingLeft: "2px"
            }}
          >
            Username
          </label>

          <input
            type="text"
            className="search-input"
            style={{
              width: "100%",
              border: "1px solid #ddd",
              padding: "14px",
              fontSize: "16px",
              height: "48px",
              borderRadius: "10px"
            }}
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "500",
              textAlign: "left",
              paddingLeft: "2px"
            }}
          >
            Password
          </label>

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              className="search-input"
              style={{
                width: "100%",
                border: "1px solid #ddd",
                padding: "14px",
                fontSize: "16px",
                height: "48px",
                borderRadius: "10px"
              }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer"
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {error && (
          <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{ color: "green", fontSize: "12px", marginTop: "5px" }}>
            {success}
          </p>
        )}

        <button
          className="hero-button"
          style={{ width: "100%", marginTop: "15px" }}
          onClick={handleLogin}
        >
          Sign In
        </button>

        <p style={{ textAlign: "center", fontSize: "14px", marginTop: "20px" }}>
          Don’t have an account?{" "}
          <span
            style={{ color: "#7C3AED", cursor: "pointer", fontWeight: "600" }}
            onClick={goToRegister}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;