import { useState } from "react";

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
    goToDashboard();
  };

  return (
    <div className="card">
      <h1 className="main-title">Welcome Back!</h1>
      <p className="subtitle">Sign in to your account</p>

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <div style={{position:"relative"}}>

<input
type={showPassword ? "text" : "password"}
placeholder="••••••••"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<span
onClick={()=>setShowPassword(!showPassword)}
style={{
position:"absolute",
right:"10px",
top:"50%",
transform:"translateY(-50%)",
cursor:"pointer",
fontSize:"16px"
}}
>
{showPassword ? "🙈" : "👁️"}
</span>

</div>
      </div>

      {error && <p style={{color:"red", fontSize:"12px", marginTop:"5px"}}>{error}</p>}
      {success && <p style={{color:"green", fontSize:"12px", marginTop:"5px"}}>{success}</p>}

      <button onClick={handleLogin}>Sign In</button>

      <p className="small-text">
        Don’t have an account? <span 
        style={{color:"#7C3AED", cursor:"pointer"}} 
        onClick={goToRegister}>Sign Up
        </span>
      </p>
    </div>
  );
}

export default Login;