import { useState } from "react";

function Register({ goToLogin }) {

const [step,setStep] = useState(1);

const [name,setName] = useState("");
const [email,setEmail] = useState("");

const [username,setUsername] = useState("");
const [password,setPassword] = useState("");
const [confirmPassword,setConfirmPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [level,setLevel] = useState("Beginner");

const [error,setError] = useState("");
const [success,setSuccess] = useState("");

// ✅ EMAIL VALIDATION (UPDATED)
const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const passwordValid = (pass)=>{
return /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/.test(pass);
}

const nextStep = ()=>{

setError("");

// STEP 1
if(step === 1){

if(!name || !email){
setError("Please fill all fields");
return;
}

// ❌ tambahan check email
if(!isEmailValid){
setError("Please enter a valid email");
return;
}

setStep(2);
}

// STEP 2
else if(step === 2){

if(!username || !password || !confirmPassword){
setError("Please fill all fields");
return;
}

if(!passwordValid(password)){
setError("Password must contain capital letter, symbol and be more than 8 characters");
return;
}

if(password !== confirmPassword){
setError("Password does not match");
return;
}

setStep(3);

}

}

const prevStep = ()=>{
setError("");
setStep(step-1);
}

const handleRegister = ()=>{

localStorage.setItem("name",name);
localStorage.setItem("email",email);
localStorage.setItem("username",username);
localStorage.setItem("password",password);
localStorage.setItem("level",level);

setSuccess("Registration Successfully!");

setTimeout(()=>{
goToLogin();
},3000);

}

return(

<div className="card">

{/* BACK BUTTON */}
<p 
onClick={step === 1 ? goToLogin : prevStep}
style={{
cursor:"pointer",
fontSize:"26px",
fontWeight:"900",
color:"#7C3AED",
position:"absolute",
top:"15px",
left:"15px"
}}
>
←
</p>

<h1 className="main-title">

{step === 1 && "Create Account"}
{step === 2 && "Security Setup"}
{step === 3 && "Learning Level"}

</h1>

{/* ================= STEP 1 ================= */}
{step === 1 &&

<>

<div className="form-group">
<label>Full Name</label>
<input
type="text"
placeholder="Your name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>
</div>

<div className="form-group">
<label>Email</label>
<input
type="text"
placeholder="your@email.com"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

{/* ✅ ERROR EMAIL */}
{email && !isEmailValid && (
<p style={{
color:"red",
fontSize:"12px",
marginTop:"5px"
}}>
Please enter a valid email
</p>
)}

</div>

<button 
onClick={nextStep}
disabled={!name || !isEmailValid}
style={{
width:"100%",
padding:"12px",
borderRadius:"8px",
border:"none",
fontSize:"14px",
marginTop:"15px",
cursor: (!name || !isEmailValid) ? "not-allowed" : "pointer",
backgroundColor: (!name || !isEmailValid) ? "#E5E7EB" : "#7C3AED",
color: (!name || !isEmailValid) ? "#9CA3AF" : "#FFFFFF"
}}
>
Next
</button>

</>

}

{/* ================= STEP 2 ================= */}
{step === 2 &&

<>

<div className="form-group">
<label>Username</label>
<input
type="text"
placeholder="Create username"
value={username}
onChange={(e)=>setUsername(e.target.value)}
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
cursor:"pointer"
}}
>
{showPassword ? "🙈" : "👁️"}
</span>

</div>

<p style={{fontSize:"11px"}}>
<span style={{color: password.match(/[A-Z]/) ? "#7C3AED" : "#9CA3AF"}}>• 1 capital letter</span><br/>
<span style={{color: password.match(/[!@#$%^&*]/) ? "#7C3AED" : "#9CA3AF"}}>• 1 symbol</span><br/>
<span style={{color: password.length >= 8 ? "#7C3AED" : "#9CA3AF"}}>• Minimum 8 characters</span>
</p>

</div>

<div className="form-group">
<label>Confirm Password</label>

<div style={{position:"relative"}}>
<input
type={showConfirmPassword ? "text" : "password"}
placeholder="••••••••"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
/>

<span
onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
style={{
position:"absolute",
right:"10px",
top:"50%",
transform:"translateY(-50%)",
cursor:"pointer"
}}
>
{showConfirmPassword ? "🙈" : "👁️"}
</span>

</div>

</div>

<button 
onClick={nextStep}
disabled={!username || !passwordValid(password) || password !== confirmPassword}
style={{
width:"100%",
padding:"12px",
borderRadius:"8px",
border:"none",
fontSize:"14px",
marginTop:"15px",
cursor: (!username || !passwordValid(password) || password !== confirmPassword) ? "not-allowed" : "pointer",
backgroundColor: (!username || !passwordValid(password) || password !== confirmPassword) ? "#E5E7EB" : "#7C3AED",
color: (!username || !passwordValid(password) || password !== confirmPassword) ? "#9CA3AF" : "#FFFFFF"
}}
>
Next
</button>

</>

}

{/* ================= STEP 3 ================= */}
{step === 3 &&

<>

<div className="form-group">
<label>Select Learning Level</label>

<select
value={level}
onChange={(e)=>setLevel(e.target.value)}
style={{
width:"100%",
padding:"10px",
borderRadius:"8px",
border:"none",
backgroundColor:"#DDD6FE"
}}
>
<option>Beginner</option>
<option>Intermediate</option>
<option>Advanced</option>
</select>

<p style={{fontSize:"11px",color:"#6B7280"}}>
(can change later in settings)
</p>

</div>

<button 
onClick={handleRegister}
style={{
width:"100%",
padding:"12px",
borderRadius:"8px",
border:"none",
fontSize:"14px",
marginTop:"15px",
backgroundColor:"#7C3AED",
color:"#FFFFFF"
}}
>
Finish
</button>

</>

}

{/* ERROR */}
{error &&
<p style={{color:"red",fontSize:"12px",marginTop:"10px"}}>
{error}
</p>
}

{/* SUCCESS */}
{success &&
<p style={{color:"green",fontSize:"13px",marginTop:"15px",textAlign:"center"}}>
Registration Successfully!<br/>
Redirecting to login...
</p>
}

</div>

);

}

export default Register;