import "../App.css";

function Drawer({ drawerOpen, closeDrawer, openSchedule, openGoals }) {
  return (
    <aside className={`drawer-panel ${drawerOpen ? "open" : ""}`}>
      <div className="drawer-header-area">
        <div>
          <h2>BrainyBits</h2>
          <p>Learning Companion</p>
        </div>

        <button className="drawer-close-btn" onClick={closeDrawer}>
          ×
        </button>
      </div>

      <button className="drawer-link active">
        <span>Edit Profile</span>
        <span>›</span>
      </button>

      <button className="drawer-link" onClick={openSchedule}>
        <span>Schedule</span>
        <span>›</span>
      </button>

      <button className="drawer-link" onClick={openGoals}>
        <span>Learning Goals</span>
        <span>›</span>
      </button>

      <button className="drawer-link">
        <span>Settings</span>
        <span>›</span>
      </button>

      <div className="drawer-divider"></div>

      <button className="drawer-link logout">
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Drawer;