import React, { useState, useRef } from "react";
import QuickHelpModal from "./QuickHelpModal";
import "../App.css";

function Drawer({
  drawerOpen,
  closeDrawer,
  activeTab,
  setActiveTab,
  openSchedule,
  openGoals,
  openProgress,
  openAchievement,
  openSettings,
  openFeedback,
  onStandardPlan,
  onPremiumPlan,
  onInstitutionalPlan,
  handleLogout,
}) {
  
  const [openMenu, setOpenMenu] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [showHelp, setShowHelp] = useState(false);
  const subscriptionRef = useRef(null);
  const learningRef = useRef(null);
  const moreSettingsRef = useRef(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const toggleMenu = (menuName, buttonRef) => {
    if (openMenu === menuName) {
      setOpenMenu(null);
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();

    setPopupPosition({
      top: rect.top,
      left: rect.right + 12,
    });

    setOpenMenu(menuName);
  };

  const popupStyle = {
    top: `${popupPosition.top}px`,
    left: `${popupPosition.left}px`,
  };

  return (
    <>
    <aside
      className={`drawer-panel ${drawerOpen ? "open" : ""}`}
      onScroll={() => setOpenMenu(null)}
    >
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

      <button
      className="drawer-link"
      onClick={() => {
        setActiveTab("account");
        closeDrawer();
      }}
    >
      <span>Account</span>
      <span>›</span>
    </button>

      <button
        ref={subscriptionRef}
        className={`drawer-link ${activeTab === "subscriptions" ? "active" : ""}`}
        onClick={() => {
          setActiveTab("subscriptions");
          closeDrawer();
        }}
      >
        <span>Subscriptions</span>
        <span>›</span>
      </button>

      {openMenu === "subscriptions" && (
        <div className="drawer-popup subscription-popup" style={popupStyle}>
          <button
            className="drawer-popup-link"
            onClick={() => {
              if (onStandardPlan) onStandardPlan();
              setOpenMenu(null);
              closeDrawer();
            }}
          >
            <span>Standard</span>
            <span>›</span>
          </button>

          <button
            className="drawer-popup-link"
            onClick={() => {
              if (onPremiumPlan) onPremiumPlan();
              setOpenMenu(null);
              closeDrawer();
            }}
          >
            <span>Premium</span>
            <span>›</span>
          </button>

          <button
            className="drawer-popup-link"
            onClick={() => {
              if (onInstitutionalPlan) onInstitutionalPlan();
              setOpenMenu(null);
              closeDrawer();
            }}
          >
            <span>Institutional</span>
            <span>›</span>
          </button>
        </div>
      )}

      <button
        ref={learningRef}
        className={`drawer-link ${openMenu === "learning" ? "active" : ""}`}
        onClick={() => toggleMenu("learning", learningRef)}
      >
        <span>Learning</span>
        <span>{openMenu === "learning" ? "⌃" : "›"}</span>
      </button>

      {openMenu === "learning" && (
        <div className="drawer-popup learning-dropdown" style={popupStyle}>
          <button className="drawer-popup-link" onClick={openSettings}>
            <span>Set Level</span>
            <span>›</span>
          </button>

          <button className="drawer-popup-link" onClick={openGoals}>
            <span>Goal</span>
            <span>›</span>
          </button>

          <button className="drawer-popup-link" onClick={openSchedule}>
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


      <div className="drawer-divider"></div>

      <button
        ref={moreSettingsRef}
        className={`drawer-link ${openMenu === "moreSettings" ? "active" : ""}`}
        onClick={() => toggleMenu("moreSettings", moreSettingsRef)}
      >
        <span>More Settings</span>
        <span>{openMenu === "moreSettings" ? "⌃" : "›"}</span>
      </button>

      {openMenu === "moreSettings" && (
        <div className="drawer-popup more-settings-popup" style={popupStyle}>
         <button className="drawer-popup-link" onClick={() => {
                setActiveTab("appearance");
                closeDrawer();
                setOpenMenu(null);
              }}
            >
              <span>Appearance</span>
              <span>›</span>
            </button>

          <button className="drawer-popup-link" onClick={() => {}}>
            <span>Notification</span>
            <span>›</span>
          </button>

          {/* FEEDBACK FORM */}
          <button
            className="drawer-popup-link"
            onClick={openFeedback}
          >
            <span>Feedback Form</span>
            <span>›</span>
          </button>
        </div>
      )}

     <button
        className="drawer-link"
        onClick={() => setShowHelp(true)}
      >
        <span>Quick Help</span>
        <span>›</span>
      </button>

      <div className="drawer-divider"></div>

            <button
  className="drawer-link logout"
  onClick={() => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    handleLogout();
  }}
>
  <span>🚪 Logout</span>
</button>
    </aside>

    {showHelp && (
      <QuickHelpModal closeHelp={() => setShowHelp(false)} />
    )}
  </>
);
}

export default Drawer;