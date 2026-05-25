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
  openForum,
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
  const downloadRef = useRef(null);
  const moreSettingsRef = useRef(null);
  const drawerRef = useRef(null);
  const touchStartYRef = useRef(0);
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

  const handleDrawerWheel = (event) => {
    const container = drawerRef.current;
    if (!container) return;

    const deltaY = event.deltaY;
    const maxScroll = container.scrollHeight - container.clientHeight;

    const isAtTop = container.scrollTop <= 0;
    const isAtBottom = container.scrollTop >= maxScroll - 1;

    if ((deltaY < 0 && isAtTop) || (deltaY > 0 && isAtBottom)) {
      event.preventDefault();
    }

    event.stopPropagation();
  };

  const handleTouchStart = (event) => {
    touchStartYRef.current = event.touches[0]?.clientY || 0;
  };

  const handleTouchMove = (event) => {
    const container = drawerRef.current;
    if (!container) return;

    const touchY = event.touches[0]?.clientY || 0;
    const deltaY = touchStartYRef.current - touchY;
    const maxScroll = container.scrollHeight - container.clientHeight;

    const isAtTop = container.scrollTop <= 0;
    const isAtBottom = container.scrollTop >= maxScroll - 1;
    const isScrollingDown = deltaY > 0;
    const isScrollingUp = deltaY < 0;

    if ((isScrollingDown && isAtBottom) || (isScrollingUp && isAtTop)) {
      event.preventDefault();
    }

    event.stopPropagation();
  };

  return (
    <>
    <aside
      className={`drawer-panel ${drawerOpen ? "open" : ""}`}
      ref={drawerRef}
      onScroll={() => setOpenMenu(null)}
      onWheelCapture={handleDrawerWheel}
      onWheel={handleDrawerWheel}
      onTouchStart={handleTouchStart}
      onTouchMoveCapture={handleTouchMove}
      onTouchMove={handleTouchMove}
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

      <button
        ref={downloadRef}
        className={`drawer-link ${openMenu === "download" ? "active" : ""}`}
        onClick={() => toggleMenu("download", downloadRef)}
      >
        <span>Download</span>
        <span>{openMenu === "download" ? "⌃" : "›"}</span>
      </button>

      {openMenu === "download" && (
        <div className="drawer-popup download-popup" style={popupStyle}>
          <button className="drawer-popup-link" onClick={() => {}}>
            <span>Notes</span>
            <span>›</span>
          </button>

          <button className="drawer-popup-link" onClick={() => {}}>
            <span>Certificate</span>
            <span>›</span>
          </button>
        </div>
      )}

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
          <button className="drawer-popup-link" onClick={() => {}}>
            <span>Appearance</span>
            <span>›</span>
          </button>

          <button className="drawer-popup-link" onClick={() => {}}>
            <span>Notification</span>
            <span>›</span>
          </button>

          <button className="drawer-popup-link" onClick={() => {}}>
            <span>Language</span>
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

            <button className="drawer-link logout" onClick={handleLogout}>
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