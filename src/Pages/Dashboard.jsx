import { useState } from "react";
import SubjectGrid from '../components/SubjectGrid.jsx'; // Import SubjectGrid
import '../App.css'; 

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
    <div className="app" style={{ minHeight: '100vh', paddingBottom: '50px' }}>

      {/* HEADER */}
      <div className="dashboard-header" style={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        padding: "40px 80px 20px"
      }}>
        <h1 className="main-title" style={{ margin: 0 }}>BrainyBits</h1>

        <div style={{display:"flex",gap:"10px"}}>
          <button 
            className="hero-button"
            onClick={()=>{setGoalStep(0); setStep(1);}}
          >
            Set Schedule
          </button>

          <button 
            className="hero-button"
            onClick={()=>{setStep(0); setGoalStep(1);}}
          >
            Set Learning Goals
          </button>
        </div>
      </div>

      {/* WELCOME SECTION */}
      <div className="module-card" style={{ margin: "20px 80px", textAlign: 'center' }}>
        <h2 className="module-title">Welcome! 👋</h2>
        <p className="hero-subtitle">Continue your learning journey</p>
      </div>

      {/* SUBJECT GRID SECTION (BAHAGIAN BARU) */}
      <div style={{ margin: "40px 80px 0" }}>
        <h2 className="section-title">My Courses</h2>
        <SubjectGrid />
      </div>

      {/* ================= SCHEDULE POPUP ================= */}
      {step !== 0 && (
        <div style={overlay}>
          <div className="module-card" style={{ width: "400px", padding: "30px" }}>
            {step === 1 && (
              <>
                <h3 className="section-title">Learning Days</h3>
                <div style={optionWrap}>
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(day=>(
                    <button key={day} onClick={()=>toggleDay(day)} style={option(days.includes(day))}>{day}</button>
                  ))}
                </div>
                <div style={navRow}>
                  <span style={back} onClick={()=>setStep(0)}>←</span>
                  <button className="hero-button" style={{padding: '10px 25px'}} onClick={()=>setStep(2)}>Next</button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="section-title">Learning Time</h3>
                <div style={optionWrap}>
                  {["Morning","Afternoon","Evening","Night"].map(t=>(
                    <button key={t} onClick={()=>toggleTime(t)} style={option(time.includes(t))}>{t}</button>
                  ))}
                </div>
                <div style={navRow}>
                  <span style={back} onClick={()=>setStep(1)}>←</span>
                  <button className="hero-button" style={{padding: '10px 25px'}} onClick={()=>setStep(3)}>Next</button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="section-title">Study Duration</h3>
                <div style={optionWrap}>
                  {["15 min","30 min","45 min","1 hour"].map(d=>(
                    <button key={d} onClick={()=>toggleDuration(d)} style={option(duration.includes(d))}>{d}</button>
                  ))}
                </div>
                <div style={navRow}>
                  <span style={back} onClick={()=>setStep(2)}>←</span>
                  <button className="hero-button" style={{padding: '10px 25px'}} onClick={()=>setStep(4)}>Save</button>
                </div>
              </>
            )}

            {step === 4 && (
              <div style={{textAlign:"center"}}>
                <h3 className="section-title">Saved. ✅</h3>
                <button className="hero-button" style={{marginTop:"15px"}} onClick={()=>setStep(0)}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= GOALS POPUP ================= */}
      {goalStep !== 0 && (
        <div style={overlay}>
          <div className="module-card" style={{ width: "400px", padding: "30px" }}>
            {goalStep === 1 && (
              <>
                <h3 className="section-title">Goal Type</h3>
                <div style={optionWrap}>
                  {["Skill 🧠","Exam 📚","Coding 💻","Language 🌍","Consistency 🔥"].map(g=>(
                    <button key={g} onClick={()=>setGoalType(g)} style={option(goalType===g)}>{g}</button>
                  ))}
                </div>
                <div style={navRow}>
                  <span style={back} onClick={()=>setGoalStep(0)}>←</span>
                  <button className="hero-button" style={{padding: '10px 25px'}} disabled={!goalType} onClick={()=>setGoalStep(2)}>Next</button>
                </div>
              </>
            )}

            {goalStep === 2 && (
              <>
                <h3 className="section-title">Target Progress</h3>
                <div style={optionWrap}>
                  {["1 topic/week","5 lessons","Improve level","Maintain"].map(t=>(
                    <button key={t} onClick={()=>setTarget(t)} style={option(target===t)}>{t}</button>
                  ))}
                </div>
                <div style={navRow}>
                  <span style={back} onClick={()=>setGoalStep(1)}>←</span>
                  <button className="hero-button" style={{padding: '10px 25px'}} disabled={!target} onClick={()=>setGoalStep(3)}>Next</button>
                </div>
              </>
            )}

            {goalStep === 3 && (
              <>
                <h3 className="section-title">Study Style</h3>
                <div style={optionWrap}>
                  {["Casual 😌","Serious ⚡","Intensive 🚀"].map(s=>(
                    <button key={s} onClick={()=>setStyle(s)} style={option(style===s)}>{s}</button>
                  ))}
                </div>
                <div style={navRow}>
                  <span style={back} onClick={()=>setGoalStep(2)}>←</span>
                  <button className="hero-button" style={{padding: '10px 25px'}} onClick={()=>setGoalStep(4)}>Save</button>
                </div>
              </>
            )}

            {goalStep === 4 && (
              <div style={{textAlign:"center"}}>
                <h3 className="section-title">Saved. 🎯</h3>
                <button className="hero-button" style={{marginTop:"15px"}} onClick={()=>setGoalStep(0)}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

// ===== INLINE STYLES =====
const overlay = {
  position:"fixed",
  top:0,left:0,width:"100%",height:"100vh",
  backgroundColor:"rgba(0,0,0,0.5)",
  display:"flex",justifyContent:"center",alignItems:"center",zIndex:1000
};

const optionWrap = {
  display:"flex",gap:"10px",flexWrap:"wrap",marginTop:"15px",marginBottom:"15px"
};

const option = (active)=>({
  padding:"10px 18px",
  borderRadius:"999px",
  border:"none",
  cursor:"pointer",
  backgroundColor: active ? "#7C3AED" : "#EEE8FF",
  color: active ? "white" : "#5b4b8a",
  fontSize: "14px",
  fontWeight: "500",
  transition: "0.2s"
});

const navRow = {
  display:"flex",
  justifyContent:"space-between",
  alignItems: "center",
  marginTop:"20px"
};

const back = {
  cursor:"pointer",
  fontSize:"24px",
  color:"#7C3AED",
  fontWeight:"700"
};

export default Dashboard;