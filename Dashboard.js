import { useState } from "react";

function Dashboard(){

// ===== STATES =====
const [step,setStep] = useState(0);
const [days,setDays] = useState([]);
const [time,setTime] = useState([]);
const [duration,setDuration] = useState([]);

const [goalStep,setGoalStep] = useState(0);
const [goalType,setGoalType] = useState("");
const [target,setTarget] = useState("");
const [style,setStyle] = useState("");

// ===== FUNCTIONS =====
const toggleDay = (day)=>{
setDays(days.includes(day) ? days.filter(d=>d!==day) : [...days,day]);
}

const toggleTime = (t)=>{
setTime(time.includes(t) ? time.filter(x=>x!==t) : [...time,t]);
}

const toggleDuration = (d)=>{
setDuration(duration.includes(d) ? duration.filter(x=>x!==d) : [...duration,d]);
}

return(

<div className="dashboard-container">

{/* HEADER */}
<div className="dashboard-header" style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}>

<h1 className="dashboard-title">BrainyBits</h1>

<div style={{display:"flex",gap:"10px"}}>

<button 
className="schedule-btn"
onClick={()=>{setGoalStep(0); setStep(1);}}
>
Set Schedule
</button>

<button 
className="schedule-btn"
onClick={()=>{setStep(0); setGoalStep(1);}}
>
Set Learning Goals
</button>

</div>

</div>

{/* WELCOME */}
<div className="welcome-card">
<h2 className="welcome-title">Welcome! 👋</h2>
<p className="welcome-sub">Continue your learning journey</p>
</div>

{/* ================= SCHEDULE ================= */}
{step !== 0 && (
<div style={overlay}>
<div style={popup}>

{/* STEP 1 */}
{step === 1 && (
<>
<h3>Learning Days</h3>

<div style={optionWrap}>
{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day=>(
<button key={day} onClick={()=>toggleDay(day)} style={option(days.includes(day))}>{day}</button>
))}
</div>

<div style={navRow}>
<span style={back} onClick={()=>setStep(0)}>←</span>
<button className="schedule-btn" onClick={()=>setStep(2)}>Next</button>
</div>
</>
)}

{/* STEP 2 */}
{step === 2 && (
<>
<h3>Learning Time</h3>

<div style={optionWrap}>
{["Morning","Afternoon","Evening","Night"].map(t=>(
<button key={t} onClick={()=>toggleTime(t)} style={option(time.includes(t))}>{t}</button>
))}
</div>

<div style={navRow}>
<span style={back} onClick={()=>setStep(1)}>←</span>
<button className="schedule-btn" onClick={()=>setStep(3)}>Next</button>
</div>
</>
)}

{/* STEP 3 */}
{step === 3 && (
<>
<h3>Study Duration</h3>

<div style={optionWrap}>
{["15 min","30 min","45 min","1 hour"].map(d=>(
<button key={d} onClick={()=>toggleDuration(d)} style={option(duration.includes(d))}>{d}</button>
))}
</div>

<div style={navRow}>
<span style={back} onClick={()=>setStep(2)}>←</span>
<button className="schedule-btn" onClick={()=>setStep(4)}>Save</button>
</div>
</>
)}

{/* SUCCESS */}
{step === 4 && (
<>
<h3 style={{textAlign:"center"}}>Saved. ✅</h3>

<div style={{textAlign:"center",marginTop:"15px"}}>
<button className="schedule-btn" onClick={()=>setStep(0)}>Close</button>
</div>
</>
)}

</div>
</div>
)}

{/* ================= GOALS ================= */}
{goalStep !== 0 && (
<div style={overlay}>
<div style={popup}>

{/* STEP 1 */}
{goalStep === 1 && (
<>
<h3>Goal Type</h3>

<div style={optionWrap}>
{["Skill 🧠","Exam 📚","Coding 💻","Language 🌍","Consistency 🔥"].map(g=>(
<button key={g} onClick={()=>setGoalType(g)} style={option(goalType===g)}>{g}</button>
))}
</div>

<div style={navRow}>
<span style={back} onClick={()=>setGoalStep(0)}>←</span>
<button 
className="schedule-btn"
disabled={!goalType}
onClick={()=>setGoalStep(2)}
>
Next
</button>
</div>
</>
)}

{/* STEP 2 */}
{goalStep === 2 && (
<>
<h3>Target Progress</h3>

<div style={optionWrap}>
{["1 topic/week","5 lessons","Improve level","Maintain"].map(t=>(
<button key={t} onClick={()=>setTarget(t)} style={option(target===t)}>{t}</button>
))}
</div>

<div style={navRow}>
<span style={back} onClick={()=>setGoalStep(1)}>←</span>
<button 
className="schedule-btn"
disabled={!target}
onClick={()=>setGoalStep(3)}
>
Next
</button>
</div>
</>
)}

{/* STEP 3 */}
{goalStep === 3 && (
<>
<h3>Study Style</h3>

<div style={optionWrap}>
{["Casual 😌","Serious ⚡","Intensive 🚀"].map(s=>(
<button key={s} onClick={()=>setStyle(s)} style={option(style===s)}>{s}</button>
))}
</div>

<div style={navRow}>
<span style={back} onClick={()=>setGoalStep(2)}>←</span>
<button 
className="schedule-btn"
onClick={()=>setGoalStep(4)}
>
Save
</button>
</div>
</>
)}

{/* SUCCESS */}
{goalStep === 4 && (
<>
<h3 style={{textAlign:"center"}}>Saved. 🎯</h3>

<div style={{textAlign:"center",marginTop:"15px"}}>
<button className="schedule-btn" onClick={()=>setGoalStep(0)}>Close</button>
</div>
</>
)}

</div>
</div>
)}

</div>
);
}

// ===== STYLE =====
const overlay = {
position:"fixed",
top:0,left:0,width:"100%",height:"100vh",
backgroundColor:"rgba(0,0,0,0.4)",
display:"flex",justifyContent:"center",alignItems:"center",zIndex:1000
};

const popup = {
background:"#fff",
padding:"25px",
borderRadius:"12px",
width:"300px"
};

const optionWrap = {
display:"flex",gap:"8px",flexWrap:"wrap",marginTop:"10px"
};

const option = (active)=>({
padding:"6px 10px",
borderRadius:"6px",
border:"none",
cursor:"pointer",
backgroundColor: active ? "#7C3AED" : "#E5E7EB",
color: active ? "white" : "#111827"
});

const navRow = {
display:"flex",
justifyContent:"space-between",
marginTop:"15px"
};

const back = {
cursor:"pointer",
fontSize:"22px",
color:"#7C3AED",
fontWeight:"700"
};

export default Dashboard;