import React, { useState, useEffect } from "react";
import {
  FaGamepad,
  FaRocket,
  FaKeyboard,
  FaPuzzlePiece,
  FaBrain,
  FaChartBar,
  FaStar,
  FaSmileBeam,
  FaTh,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { MdOutlineLightMode, MdNightlightRound } from "react-icons/md";
import "./NavBar.css";

/*
  MiniMayhem Arcade Hub - Responsive Navigation Bar

  Features:
  - Links to: Home (Arcade Lobby), Typing Challenge, Reaction Speed, Sudoku, Memory Match,
    Scoreboard, Achievements, FunZone.
  - Color theme: #2D2D72 (primary), #F7C948 (secondary), #9c9c9c (accent).
  - Supports dark/light mode (via prop).
  - Responsive (mobile menu drawer for <900px).
  - Accessible keyboard navigation and aria labels.
  - Theme toggle button.
*/

// PUBLIC_INTERFACE
function NavBar({
  darkMode,
  onToggleTheme,
  currentPath,
  onNav
}) {
  // Palette as per requirements.
  const COLORS = {
    primary: "#2D2D72",
    secondary: "#F7C948",
    accent: "#9c9c9c"
  };

  /** Navigation links configuration.
   * - Each link supports icon, text, and mobile-friendly behavior.
   * - 'path' is a unique key/hash for navigation.
   */
  const navLinks = [
    { key: "home", label: "Arcade Lobby", icon: <FaGamepad />, path: "/" },
    { key: "typing", label: "Typing Challenge", icon: <FaKeyboard />, path: "#typing-challenge" },
    { key: "reaction", label: "Reaction Speed", icon: <FaRocket />, path: "#reaction-speed" },
    { key: "sudoku", label: "Sudoku", icon: <FaPuzzlePiece />, path: "#sudoku" },
    { key: "memory", label: "Memory Match", icon: <FaBrain />, path: "#memory-match" },
    { key: "scoreboard", label: "Scoreboard", icon: <FaChartBar />, path: "#scoreboard" },
    { key: "achievements", label: "Achievements", icon: <FaStar />, path: "#achievements" },
    { key: "funzone", label: "FunZone", icon: <FaSmileBeam />, path: "#funzone" },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the drawer on navigation or window resize beyond desktop
  useEffect(() => {
    if (!mobileOpen) return;
    function onResize() {
      if (window.innerWidth > 900) setMobileOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileOpen]);

  // Close drawer after selecting a nav link (for mobile UX)
  function navTo(path) {
    setMobileOpen(false);
    if (onNav) onNav(path);
    // Use JS navigation in SPA where possible, fallback to hash.
    if (path === "/") window.location.href = "/";
    else window.location.hash = path;
  }

  // Keyboard handler for accessible nav
  function handleNavKey(e, path) {
    if (e.key === "Enter" || e.key === " ") navTo(path);
  }

  // Determine active link by matching currentPath, window.location.hash, or "/"
  function isActive(link) {
    if (link.path === "/" && currentPath === "/") return true;
    return window.location.hash === link.path;
  }

  // ARCADE BRAND LOGO as link (Home)
  const Logo = (
    <a
      href="/"
      className="mm-navbar-logo-link"
      style={{
        color: COLORS.secondary,
        display: "flex",
        alignItems: "center",
        fontFamily: "'Press Start 2P', VT323, monospace",
        fontWeight: 900,
        letterSpacing: "-1.2px",
        fontSize: 19,
        textDecoration: "none",
        gap: 10,
        userSelect: "none"
      }}
      aria-label="MiniMayhem Arcade Home"
    >
      <FaTh style={{
        fontSize: 27,
        marginRight: 5,
        color: COLORS.primary,
        filter: darkMode ? "drop-shadow(0 0 6px #232)" : "none"
      }} />
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
        zIndex: 1001,
        background: darkMode
          ? `linear-gradient(91deg, #1a1837 76%, ${COLORS.primary} 180%)`
          : `linear-gradient(91deg, #fffbe7 76%, ${COLORS.accent}15 130%)`,
        borderBottom: `2.5px solid ${COLORS.secondary}`,
        boxShadow: darkMode
          ? `0 3px 16px 1px ${COLORS.accent}33`
          : `0 2px 15px 1px ${COLORS.primary}22`,
        fontFamily: "'Press Start 2P', VT323, monospace"
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
          minHeight: 56
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>{Logo}</span>

        {/* Desktop Nav */}
        <ul
          className="mm-navbar-navlinks"
          style={{
            display: mobileOpen ? "none" : "flex",
            alignItems: "center",
            gap: 13,
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {navLinks.map(link => (
            <li key={link.key}>
              <button
                type="button"
                className={`mm-navbar-btn${isActive(link) ? " mm-navbar-btn-active" : ""}`}
                style={{
                  background: "none",
                  border: "none",
                  outline: "none",
                  padding: "7px 13px",
                  borderRadius: 7,
                  color: isActive(link)
                    ? COLORS.secondary
                    : darkMode ? "#fffbe6" : COLORS.primary,
                  fontWeight: 900,
                  fontSize: "1rem",
                  letterSpacing: "0.07em",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  transition: "background 0.17s, color 0.2s, box-shadow 0.17s",
                  cursor: "pointer",
                  boxShadow: isActive(link)
                    ? `0 0 7px 3px ${COLORS.secondary}66`
                    : "none",
                  textShadow: isActive(link)
                    ? `0 0 3px ${COLORS.secondary}` : "none",
                  border: isActive(link) ? `2.2px solid ${COLORS.secondary}` : "none",
                }}
                onClick={() => navTo(link.path)}
                onKeyDown={e => handleNavKey(e, link.path)}
                tabIndex={0}
                aria-current={isActive(link) ? "page" : undefined}
                aria-label={`Navigate to ${link.label}`}
              >
                <span aria-hidden="true" style={{ fontSize: 19 }}>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Theme Toggle (desktop+mobile) */}
        <button
          className="mm-navbar-theme-toggle"
          type="button"
          aria-label="Toggle dark/light mode"
          onClick={onToggleTheme}
          style={{
            marginLeft: 12,
            background: darkMode ? "#222034ee" : "#faf7dd",
            border: `2.1px solid ${darkMode ? COLORS.secondary : COLORS.primary}`,
            color: darkMode ? COLORS.secondary : COLORS.primary,
            borderRadius: 7,
            padding: 4,
            fontSize: 20,
            cursor: "pointer",
            boxShadow: darkMode
              ? `0 0 9px 2px ${COLORS.secondary}55`
              : `0 0 7px 2px ${COLORS.primary}22`,
            outline: "none"
          }}
          tabIndex={0}
        >
          {darkMode
            ? <MdOutlineLightMode title="Switch to light mode" />
            : <MdNightlightRound title="Switch to dark mode" />}
        </button>

        {/* Mobile Hamburger */}
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
            color: COLORS.primary,
            fontSize: 27,
            marginLeft: 10,
            borderRadius: 9,
            zIndex: 1100,
            cursor: "pointer",
            transition: "background 0.21s"
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
            minHeight: "60vh",
            position: "fixed",
            top: 64,
            left: 0,
            background: darkMode
              ? `linear-gradient(105deg, #161432ea 69%, ${COLORS.primary}ee 140%)`
              : `linear-gradient(99deg, #fffdfcea 69%, ${COLORS.accent}33 130%)`,
            zIndex: 1050,
            boxShadow: `0 7px 24px 4px ${COLORS.primary}31`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "22px 0 20px 0",
            animation: "mm-navbar-mobile-fade-in 0.17s cubic-bezier(.45,.61,.78,1.16)",
          }}
          aria-label="Mobile main nav"
        >
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 18,
              alignItems: "center",
              width: "100%",
            }}
          >
            {navLinks.map(link => (
              <li key={link.key} style={{ width: "100%" }}>
                <button
                  className={`mm-navbar-btn${isActive(link) ? " mm-navbar-btn-active" : ""}`}
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    width: "97vw",
                    padding: "16px 0",
                    borderRadius: 7,
                    color: isActive(link)
                      ? COLORS.secondary
                      : darkMode ? "#fffbe6" : COLORS.primary,
                    fontWeight: 900,
                    fontSize: "1rem",
                    letterSpacing: "0.07em",
                    display: "flex",
                    alignItems: "center",
                    gap: 13,
                    textAlign: "left",
                    transition: "background 0.16s, color 0.23s, box-shadow 0.18s",
                    cursor: "pointer",
                    boxShadow: isActive(link)
                      ? `0 0 12px 3px ${COLORS.secondary}17`
                      : "none",
                    border: isActive(link) ? `2.2px solid ${COLORS.secondary}` : "none",
                  }}
                  onClick={() => navTo(link.path)}
                  tabIndex={0}
                  aria-current={isActive(link) ? "page" : undefined}
                  aria-label={`Navigate to ${link.label}`}
                >
                  <span aria-hidden="true" style={{ fontSize: 19 }}>{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              </li>
            ))}
            {/* Theme Toggle */}
            <li style={{ width: "100%", marginTop: 7 }}>
              <button
                className="mm-navbar-theme-toggle"
                type="button"
                style={{
                  width: "94vw",
                  margin: "0 auto",
                  background: darkMode ? "#222034ee" : "#faf7dd",
                  border: `2.1px solid ${darkMode ? COLORS.secondary : COLORS.primary}`,
                  color: darkMode ? COLORS.secondary : COLORS.primary,
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 20,
                  cursor: "pointer",
                  marginTop: 2,
                  marginBottom: 3,
                  boxShadow: darkMode
                    ? `0 0 9px 2px ${COLORS.secondary}15`
                    : `0 0 7px 2px ${COLORS.primary}10`,
                  outline: "none"
                }}
                onClick={onToggleTheme}
                tabIndex={0}
                aria-label="Toggle dark/light mode"
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
        `}
      </style>
    </nav>
  );
}

export default NavBar;
