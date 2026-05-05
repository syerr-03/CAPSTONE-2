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

      <button className="drawer-link" onClick={openSettings}>
        <span>Settings</span>
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