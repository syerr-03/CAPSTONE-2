import { useState } from "react";
import "../App.css";

function Drawer({
  drawerOpen,
  closeDrawer,
  openSchedule,
  openGoals,
  openProgress,
  openAchievement,
  openForum,
  openSettings,
  handleLogout,
}) {
  const [learningOpen, setLearningOpen] = useState(false);

  return (
    <aside className={`drawer-panel ${drawerOpen ? "open" : ""}`}>
      <div className="drawer-header-area">
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <img
            src="/logo.jpg"
            alt="BrainyBits Logo"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              marginTop: "4px",
            }}
          />

          <div>
            <h2 style={{ margin: 0 }}>BrainyBits</h2>
            <p style={{ margin: 0, marginTop: "4px" }}>
              Learning Companion
            </p>
          </div>
        </div>

        <button className="drawer-close-btn" onClick={closeDrawer}>
          ×
        </button>
      </div>

      <button className="drawer-link">
        <span>Account</span>
        <span>›</span>
      </button>

      <button className="drawer-link">
        <span>Subscriptions</span>
        <span>›</span>
      </button>

      <button
        type="button"
        className="drawer-link"
        onClick={() => setLearningOpen(!learningOpen)}
      >
        <span>Learning</span>
        <span>{learningOpen ? "⌃" : "›"}</span>
      </button>

      {learningOpen && (
        <div className="learning-dropdown">
          <button className="learning-dropdown-link" onClick={openSettings}>
            <span>Set Level</span>
            <span>›</span>
          </button>

          <button className="learning-dropdown-link" onClick={openGoals}>
            <span>Goal</span>
            <span>›</span>
          </button>

          <button className="learning-dropdown-link" onClick={openSchedule}>
            <span>Schedule</span>
            <span>›</span>
          </button>
        </div>
      )}

      <button className="drawer-link" onClick={openProgress}>
        <span>Progress</span>
        <span>›</span>
      </button>

      <button className="drawer-link" onClick={openAchievement}>
        <span>Achievement</span>
        <span>›</span>
      </button>

      <button className="drawer-link" onClick={openForum}>
        <span>Forum</span>
        <span>›</span>
      </button>

      <button className="drawer-link">
        <span>Download</span>
        <span>›</span>
      </button>

      <div className="drawer-divider"></div>

      <button className="drawer-link">
        <span>More Settings</span>
        <span>›</span>
      </button>

      <button className="drawer-link">
        <span>Quick Help</span>
        <span>›</span>
      </button>

      <div className="drawer-divider"></div>

      <button className="drawer-link logout" onClick={handleLogout}>
        <span>🚪 Logout</span>
      </button>
    </aside>
  );
}

export default Drawer;