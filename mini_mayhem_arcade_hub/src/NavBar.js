import React, { useState, useEffect } from "react";
import { FaGamepad, FaTrophy, FaChartBar, FaSmileBeam, FaUserCircle, FaBars, FaTimes, FaStar } from "react-icons/fa";
import { MdOutlineLightMode, MdNightlightRound } from "react-icons/md";

/*
  MiniMayhem Arcade Hub - NavBar
  Responsive, arcade-themed, theme-toggling navigation bar
  Requires: react-icons
*/

// PUBLIC_INTERFACE
function NavBar({ darkMode, onToggleTheme, palette, currentSection, onNav }) {
  /**
   * NavBar props:
   * - darkMode: boolean indicating dark mode
   * - onToggleTheme: function to toggle dark/light
   * - palette: color palette {primary, secondary, accent}
   * - currentSection: string for active nav (optional)
   * - onNav: (section) => void (optional for SPA context)
   **/
  const [mobileOpen, setMobileOpen] = useState(false);

  // Responsive close on nav click or resize
  useEffect(() => {
    if (!mobileOpen) return;
    function closeOnResize() {
      if (window.innerWidth > 900) setMobileOpen(false);
    }
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, [mobileOpen]);

  const colors = palette || {
    primary: "#2D2D72",
    secondary: "#F7C948",
    accent: "#9c9c9c",
  };

  // Nav Links
  const navLinks = [
    { key: "games", icon: <FaGamepad />, label: "Games" },
    { key: "scoreboard", icon: <FaChartBar />, label: "Scoreboard" },
    { key: "achievements", icon: <FaStar />, label: "Achievements" },
    { key: "funzone", icon: <FaSmileBeam />, label: "FunZone" },
  ];

  // Handler for link
  function handleNav(key) {
    setMobileOpen(false);
    if (onNav) onNav(key);
    // Use hash by default for SPA navigation
    window.location.hash = "#" + key;
  }

  // For accessibility & mobile, focus/blur logic for menu
  function handleLinkKey(e, key) {
    if (e.key === "Enter" || e.key === " ") handleNav(key);
  }

  // Profile/sidebar triggers (for future modal/sidebar use)
  const handleProfile = () => {
    setMobileOpen(false);
    // For demo, just alert (replace with sidebar logic)
    window.location.hash = "#profile";
  };

  // ARCADE LOGO (PROMINENT)
  const Logo = (
    <a
      href="/"
      className="mm-navbar-logo-link"
      style={{
        textDecoration: "none",
        color: colors.secondary,
        display: "flex",
        alignItems: "center",
        fontFamily: "'Press Start 2P', VT323, monospace",
        fontWeight: 900,
        fontSize: 19,
        letterSpacing: "-1.2px",
        textShadow: darkMode
          ? `0 0 10px ${colors.secondary},0 0 8px #fff7`
          : `0 0 5px ${colors.primary}`,
        gap: 10,
        userSelect: "none",
      }}
    >
      <FaGamepad style={{ fontSize: 27, marginRight: 4, color: colors.primary, filter: darkMode ? "drop-shadow(0 0 6px #222)" : "none" }} />
      MiniMayhem Arcade
    </a>
  );

  return (
    <nav
      className={`mm-navbar${darkMode ? " mm-navbar-dark" : " mm-navbar-light"}`}
      style={{
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999,
        background: darkMode
          ? `linear-gradient(91deg, #191837 76%, ${colors.primary} 180%)`
          : `linear-gradient(91deg, #fdf7e9 76%, ${colors.accent}15 130%)`,
        borderBottom: `2.5px solid ${colors.secondary}`,
        boxShadow: darkMode
          ? `0 3px 16px 1px ${colors.accent}33`
          : `0 2px 15px 1px ${colors.primary}22`,
        fontFamily: "'Press Start 2P', VT323, monospace",
      }}
      aria-label="Main navigation bar"
    >
      <div
        className="mm-navbar-inner"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          height: 64,
          minHeight: 56,
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>{Logo}</span>

        {/* Desktop Nav */}
        <ul
          className="mm-navbar-navlinks"
          style={{
            display: mobileOpen ? "none" : "flex",
            alignItems: "center",
            gap: 14,
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {navLinks.map(({ key, icon, label }) => (
            <li key={key}>
              <button
                type="button"
                className={`mm-navbar-btn${currentSection === key ? " mm-navbar-btn-active" : ""}`}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  padding: "7px 13px",
                  borderRadius: 7,
                  color:
                    key === currentSection
                      ? colors.secondary
                      : darkMode
                        ? "#fffbe6"
                        : colors.primary,
                  fontWeight: 900,
                  fontSize: "1rem",
                  letterSpacing: "0.07em",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  transition: "background 0.17s, color 0.2s, box-shadow 0.17s",
                  cursor: "pointer",
                  boxShadow: currentSection === key
                    ? `0 0 7px 3px ${colors.secondary}66`
                    : "none",
                  textShadow: currentSection === key
                    ? `0 0 3px ${colors.secondary}` : "none",
                  border: currentSection === key ? `2.5px solid ${colors.secondary}` : "none",
                }}
                onClick={() => handleNav(key)}
                onKeyDown={e => handleLinkKey(e, key)}
                tabIndex={0}
                aria-current={currentSection === key ? "page" : undefined}
                aria-label={`Navigate to ${label}`}
              >
                <span aria-hidden="true" style={{ fontSize: 19 }}>{icon}</span>
                <span>{label}</span>
              </button>
            </li>
          ))}
          {/* Profile/Sidebar */}
          <li>
            <button
              type="button"
              className="mm-navbar-profile-btn"
              style={{
                background: "none",
                border: "none",
                color: darkMode ? colors.accent : colors.primary,
                fontWeight: 800,
                fontSize: "1em",
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 7px",
                borderRadius: 100,
                cursor: "pointer",
                transition: "background 0.16s, color 0.13s",
              }}
              onClick={handleProfile}
              tabIndex={0}
              aria-label="Profile and Sidebar"
            >
              <FaUserCircle style={{ fontSize: 22 }} />
              <span className="mm-navbar-profile-text" style={{ display: "inline" }}>Profile</span>
            </button>
          </li>
        </ul>

        {/* THEME TOGGLE for DESKTOP and MOBILE */}
        <button
          className="mm-navbar-theme-toggle"
          type="button"
          aria-label="Toggle dark/light mode"
          onClick={onToggleTheme}
          style={{
            marginLeft: 12,
            background: darkMode ? "#222034ee" : "#faf7dd",
            border: `2.5px solid ${darkMode ? colors.secondary : colors.primary}`,
            color: darkMode ? colors.secondary : colors.primary,
            borderRadius: 7,
            padding: 4,
            fontSize: 20,
            cursor: "pointer",
            boxShadow: darkMode
              ? `0 0 9px 2px ${colors.secondary}55`
              : `0 0 7px 2px ${colors.primary}22`,
            outline: "none"
          }}
          tabIndex={0}
        >
          {darkMode
            ? <MdOutlineLightMode title="Switch to light mode" />
            : <MdNightlightRound title="Switch to dark mode" />}
        </button>

        {/* Mobile NAV HAMBURGER */}
        <button
          className="mm-navbar-mobile-toggle"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 7,
            background: "none",
            border: "none",
            color: colors.primary,
            fontSize: 27,
            marginLeft: 10,
            borderRadius: 9,
            zIndex: 1100,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="mm-navbar-mobile-drawer"
          style={{
            width: "100vw",
            minHeight: "50vh",
            position: "fixed",
            top: 64,
            left: 0,
            background: darkMode
              ? `linear-gradient(105deg, #161432ea 69%, ${colors.primary}ee 140%)`
              : `linear-gradient(99deg, #fffdfcea 69%, ${colors.accent}33 130%)`,
            zIndex: 9999,
            boxShadow: `0 7px 24px 4px ${colors.primary}51`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px 0 14px 0",
            animation: "mm-navbar-mobile-fade-in 0.18s cubic-bezier(.43,.49,.73,1.22)",
          }}
          aria-label="mobile nav"
        >
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              alignItems: "center",
              width: "100%",
            }}
          >
            {navLinks.map(({ key, icon, label }) => (
              <li key={key} style={{ width: "100%" }}>
                <button
                  className={`mm-navbar-btn${currentSection === key ? " mm-navbar-btn-active" : ""}`}
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    width: "96vw",
                    padding: "15px 0",
                    borderRadius: 7,
                    color:
                      key === currentSection
                        ? colors.secondary
                        : darkMode
                          ? "#fffbe6"
                          : colors.primary,
                    fontWeight: 900,
                    fontSize: "1rem",
                    letterSpacing: "0.07em",
                    display: "flex",
                    alignItems: "center",
                    gap: 15,
                    textAlign: "left",
                    transition: "background 0.17s, color 0.2s, box-shadow 0.17s",
                    cursor: "pointer",
                    boxShadow: currentSection === key
                      ? `0 0 12px 4px ${colors.secondary}25`
                      : "none",
                    border: currentSection === key ? `2.5px solid ${colors.secondary}` : "none",
                  }}
                  onClick={() => handleNav(key)}
                  tabIndex={0}
                  aria-current={currentSection === key ? "page" : undefined}
                  aria-label={`Navigate to ${label}`}
                >
                  <span aria-hidden="true" style={{ fontSize: 19 }}>{icon}</span>
                  <span>{label}</span>
                </button>
              </li>
            ))}
            <li style={{ width: "100%" }}>
              <button
                className="mm-navbar-profile-btn"
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: darkMode ? colors.accent : colors.primary,
                  fontWeight: 800,
                  fontSize: "1em",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "13px 0",
                  borderRadius: 100,
                  cursor: "pointer",
                  width: "96vw",
                }}
                onClick={handleProfile}
                tabIndex={0}
                aria-label="Profile and Sidebar"
              >
                <FaUserCircle style={{ fontSize: 24 }} />
                <span className="mm-navbar-profile-text" style={{ display: "inline" }}>Profile</span>
              </button>
            </li>
            <li style={{ width: "100%", marginTop: 7 }}>
              <button
                className="mm-navbar-theme-toggle"
                type="button"
                style={{
                  width: "92vw",
                  margin: "0 auto",
                  background: darkMode ? "#222034ee" : "#faf7dd",
                  border: `2.5px solid ${darkMode ? colors.secondary : colors.primary}`,
                  color: darkMode ? colors.secondary : colors.primary,
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 20,
                  cursor: "pointer",
                  marginTop: 2,
                  marginBottom: 3,
                  boxShadow: darkMode
                    ? `0 0 9px 2px ${colors.secondary}35`
                    : `0 0 7px 2px ${colors.primary}15`,
                  outline: "none"
                }}
                onClick={onToggleTheme}
                tabIndex={0}
                aria-label="Toggle theme"
              >
                {darkMode
                  ? <MdOutlineLightMode title="Switch to light mode" />
                  : <MdNightlightRound title="Switch to dark mode" />}
                &nbsp;{darkMode ? "Light" : "Dark"} Mode
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Mobile open/close fade animation style */}
      <style>
        {`
        @keyframes mm-navbar-mobile-fade-in {
          from { opacity: 0; transform: translateY(-11px);}
          to   { opacity: 1; transform: translateY(0);}
        }
        @media (max-width: 900px) {
          .mm-navbar-navlinks { display: none !important; }
          .mm-navbar-mobile-toggle { display: inline-flex !important; }
        }
        @media (min-width: 900px) {
          .mm-navbar-mobile-toggle { display: none !important; }
          .mm-navbar-navlinks { display: flex !important; }
        }
        @media (max-width: 600px) {
          .mm-navbar-inner { height: 48px !important; min-height: 37px !important; }
        }
        `}
      </style>
    </nav>
  );
}

export default NavBar;
