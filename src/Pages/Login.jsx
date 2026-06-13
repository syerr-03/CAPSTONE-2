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

  const user = userCredential.user;

      await updateLoginStreak(userCredential.user.uid);

      // 🔥 Simpan nama user
      localStorage.setItem("name", userData.name);
      localStorage.setItem("userEmail", userData.email);
      
      if (userData.createdAt) {
        const createdDate = userData.createdAt.toDate();

        const formattedDate = createdDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        localStorage.setItem("memberSince", formattedDate);
      }  

      // 🔥 Check user baru ke tak
      const justRegistered = localStorage.getItem("justRegistered") === "true";

      // 🔥 Set welcome type
      localStorage.setItem("welcomeType", justRegistered ? "new" : "returning");

      // 🔥 Clear flag register
      localStorage.removeItem("justRegistered");

      // Login success
      setSuccess("Login Successful!");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", "student");
      localStorage.setItem("loggedInUser", username);
      localStorage.setItem(`userPlan_${username}`, localStorage.getItem(`userPlan_${username}`) || "standard");

       setTimeout(() => {
       goToDashboard();
        }, 1000);
    } catch (error) {
      console.log("LOGIN ERROR:", error.code, error.message);
      setError(error.code);
    }
  };

  return (
  <div className="login-bg-page">
    <div className="login-left-content">
      <div className="login-brand-row">
        <img src="/logo-no-bg.png" alt="BrainyBits Logo" />
        <h1>BrainyBits</h1>
      </div>

      <h2>
        Learn <span>Smarter.</span>
        Grow <span>Faster.</span>
      </h2>

      <p>
        BrainyBits is your personalized learning companion powered by AI.
        Learn at your own pace, track your progress, and achieve your
        learning goals.
      </p>

      <div className="login-feature-grid">
        <div>
          <strong>🎓 Personalized Learning</strong>
          <small>Customized learning paths tailored to your needs.</small>
        </div>

        <div>
          <strong>📈 Progress Tracking</strong>
          <small>Monitor your progress and achievements easily.</small>
        </div>

        <div>
          <strong>📝 Interactive Quizzes</strong>
          <small>Practice with quizzes and strengthen your skills.</small>
        </div>

        <div>
          <strong>🤖 AI Learning Support</strong>
          <small>Get intelligent assistance whenever you need it.</small>
        </div>
      </div>

      <blockquote>
        “The beautiful thing about learning is that no one can take it away
        from you.”
      </blockquote>
    </div>

    <div className="module-card login-card-box" style={{ width: "100%", maxWidth: "430px" }}>
      <div style={{ textAlign: "center" }}>
        <img
          src="/logo-no-bg.png"
          alt="BrainyBits Logo"
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "15px"
          }}
        />

        <h1 className="main-title">Welcome Back!</h1>
      </div>

      <p className="hero-subtitle" style={{ textAlign: "center", marginBottom: "20px" }}>
        Sign in to your account
      </p>

      <div style={{ marginBottom: "15px" }}>
        <label style={{
          display: "block",
          marginBottom: "6px",
          fontWeight: "500",
          textAlign: "left",
          paddingLeft: "2px"
        }}>
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
        <label style={{
          display: "block",
          marginBottom: "6px",
          fontWeight: "500",
          textAlign: "left",
          paddingLeft: "2px"
        }}>
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