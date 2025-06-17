import React, { useState, useEffect } from "react";
import {
  FaGamepad, FaTrophy, FaChartBar, FaSmileBeam,
  FaRegKeyboard, FaBolt, FaPuzzlePiece, FaBrain,
  FaBars, FaTimes, FaMedal
} from "react-icons/fa";
import { MdOutlineLightMode, MdNightlightRound } from "react-icons/md";
import "./NavBar.css";

/*
  PUBLIC_INTERFACE
  NavBar for MiniMayhem Arcade Hub
  Responsive, arcade-style, light/dark mode.  
  Props:
    - darkMode: true/false for current theme
    - onToggleTheme: () => void
    - currentSection: optional string for highlighting active route
    - onNav: (section) => void (optional callback for SPA context)
    - style, ...rest: passthrough
*/
function NavBar({
  darkMode,
  onToggleTheme,
  currentSection,
  onNav,
  style = {},
  ...rest
}) {
  // Mobile menu open/close
  const [mobileOpen, setMobileOpen] = useState(false);

  // Keyboard accessibility: Escape closes mobile drawer, links support space/enter
  useEffect(() => {
    if (!mobileOpen) return;
    function handleKey(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

  // Responsive close if resizing back to desktop
  useEffect(() => {
    function closeOnResize() {
      if (mobileOpen && window.innerWidth > 900) setMobileOpen(false);
    }
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, [mobileOpen]);

  // Color palette (matches given requirements)
  const colors = {
    primary: "#2D2D72",
    secondary: "#F7C948",
    accent: "#9c9c9c",
  };

  // Navigation links for hub + games + sections
  const navLinks = [
    { key: "arcade", label: "Arcade Hub", icon: <FaGamepad /> , href: "/" },
    { key: "typing", label: "Typing Challenge", icon: <FaRegKeyboard />, href: "#typing-challenge" },
    { key: "reaction", label: "Reaction Speed", icon: <FaBolt />, href: "#reaction-speed" },
    { key: "sudoku", label: "Sudoku", icon: <FaPuzzlePiece />, href: "#sudoku" },
    { key: "memory", label: "Memory Match", icon: <FaBrain />, href: "#memory-match" },
    { key: "scoreboard", label: "Scoreboard", icon: <FaChartBar />, href: "#scoreboard" },
    { key: "achievements", label: "Achievements", icon: <FaMedal />, href: "#achievements" },
    { key: "funzone", label: "FunZone", icon: <FaSmileBeam />, href: "#funzone" },
  ];

  // Navigation action: fire SPA callback if present, or use default link
  function handleNav(key, href) {
    setMobileOpen(false);
    if (onNav) onNav(key);
    // By default, update hash for navigation (fallback for SPA)
    if (href && href.startsWith("#")) window.location.hash = href;
    // For "/": use window.location (home)
    else if (href === "/") window.location.href = "/";
  }

  // Element builder for nav link
  function NavLink({ item, active }) {
    return (
      <li>
        <a
          className={active ? "mm-navbar-btn mm-navbar-btn-active" : "mm-navbar-btn"}
          href={item.href}
          tabIndex={0}
          style={{
            background: "none",
            border: "none",
            outline: "none",
            padding: "6.5px 13px",
            borderRadius: 7,
            color: active
              ? colors.secondary
              : darkMode
                ? "#fffbe6"
                : colors.primary,
            fontWeight: 900,
            fontSize: "1rem",
            letterSpacing: "0.05em",
            display: "flex",
            alignItems: "center",
            gap: 7,
            textDecoration: "none",
            cursor: "pointer",
            boxShadow: active
              ? `0 0 7px 3px ${colors.secondary}66`
              : "none",
            textShadow: active
              ? `0 0 3px ${colors.secondary}`
              : "none",
            border: active ? `2.5px solid ${colors.secondary}` : "none",
            transition: "background 0.17s, color 0.21s, box-shadow 0.17s",
            margin: 0
          }}
          aria-current={active ? "page" : undefined}
          aria-label={`Navigate to ${item.label}`}
          onClick={e => {
            e.preventDefault();
            handleNav(item.key, item.href);
          }}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleNav(item.key, item.href);
            }
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 19 }}>{item.icon}</span>
          <span>{item.label}</span>
        </a>
      </li>
    );
  }

  // LOGO LEFT - arcade title
  const Logo = (
    <a
      href="/"
      className="mm-navbar-logo-link"
      aria-label="Go to MiniMayhem Arcade Home"
      style={{
        textDecoration: "none",
        color: colors.secondary,
        display: "flex",
        alignItems: "center",
        fontFamily: "'Press Start 2P', VT323, monospace",
        fontWeight: 900,
        fontSize: 18,
        letterSpacing: "-1.1px",
        textShadow: darkMode
          ? `0 0 10px ${colors.secondary},0 0 8px #fff7`
          : `0 0 5px ${colors.primary}`,
        gap: 7,
        userSelect: "none",
        padding: "2px 0"
      }}
      tabIndex={0}
    >
      <FaGamepad style={{
        fontSize: 25, marginRight: 4, color: colors.primary,
        filter: darkMode ? "drop-shadow(0 0 5px #221)" : "none"
      }} />
      <span style={{
        fontFamily: "'Press Start 2P', VT323, monospace",
        fontSize: "1.13em",
        color: darkMode ? "#fffbe6" : colors.primary,
        letterSpacing: "-0.7px",
        marginLeft: 1,
        userSelect: "none"
      }}>
        MiniMayhem Arcade
      </span>
    </a>
  );

  return (
    <nav
      className={`mm-navbar${darkMode ? " mm-navbar-dark" : " mm-navbar-light"}`}
      aria-label="Main navigation bar"
      style={{
        width: "100vw",
        minWidth: "0",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1200,
        background: darkMode
          ? `linear-gradient(90deg, #191837 70%, ${colors.primary} 170%)`
          : `linear-gradient(89deg, #fdf7e9 68%, ${colors.accent}11 110%)`,
        borderBottom: `2.5px solid ${colors.secondary}`,
        boxShadow: darkMode
          ? `0 3px 16px 1px ${colors.accent}33`
          : `0 2px 15px 1px ${colors.primary}22`,
        fontFamily: "'Press Start 2P', VT323, monospace",
        ...style
      }}
      {...rest}
    >
      <div
        className="mm-navbar-inner"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 25px",
          height: 60,
          minHeight: 44,
        }}
      >
        {/* LOGO */}
        <span style={{ display: "flex", alignItems: "center" }}>{Logo}</span>

        {/* Desktop Nav (centered) */}
        <ul
          className="mm-navbar-navlinks"
          style={{
            display: mobileOpen ? "none" : "flex",
            alignItems: "center",
            gap: 9,
            margin: "0 0 0 25px",
            padding: 0,
            listStyle: "none",
            flex: "0 1 auto"
          }}
        >
          {navLinks.map(item => (
            <NavLink
              key={item.key}
              item={item}
              active={currentSection === item.key}
            />
          ))}
        </ul>

        {/* THEME TOGGLE (right) */}
        <button
          className="mm-navbar-theme-toggle"
          type="button"
          aria-label="Toggle dark/light mode"
          onClick={onToggleTheme}
          style={{
            marginLeft: 14,
            background: darkMode ? "#232355" : "#faf7dd",
            border: `2.5px solid ${darkMode ? colors.secondary : colors.primary}`,
            color: darkMode ? colors.secondary : colors.primary,
            borderRadius: 7,
            padding: 6,
            fontSize: 22,
            cursor: "pointer",
            boxShadow: darkMode
              ? `0 0 9px 2px ${colors.secondary}45`
              : `0 0 7px 2px ${colors.primary}22`,
            outline: "none"
          }}
          tabIndex={0}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode
            ? <MdOutlineLightMode title="Switch to light mode" />
            : <MdNightlightRound title="Switch to dark mode" />}
        </button>

        {/* MOBILE MENU TOGGLER */}
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
            zIndex: 1600,
            cursor: "pointer",
            transition: "background 0.18s"
          }}
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div
          className="mm-navbar-mobile-drawer"
          style={{
            width: "100vw",
            minHeight: "45vh",
            position: "fixed",
            top: 60,
            left: 0,
            background: darkMode
              ? `linear-gradient(110deg, #161432ea 72%, ${colors.primary}ee 130%)`
              : `linear-gradient(99deg, #fffdfcec 66%, ${colors.accent}33 110%)`,
            zIndex: 1999,
            boxShadow: `0 7px 24px 4px ${colors.primary}51`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px 0 14px 0",
            animation: "mm-navbar-mobile-fade-in 0.21s cubic-bezier(.43,.49,.73,1.22)",
          }}
          aria-label="Mobile navigation menu"
        >
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 13,
              alignItems: "center",
              width: "100%"
            }}
          >
            {navLinks.map(item => (
              <li key={item.key} style={{ width: "100%" }}>
                <a
                  className={`mm-navbar-btn${currentSection === item.key ? " mm-navbar-btn-active" : ""}`}
                  href={item.href}
                  tabIndex={0}
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    width: "95vw",
                    padding: "15px 0",
                    borderRadius: 7,
                    color: currentSection === item.key
                      ? colors.secondary
                      : darkMode
                        ? "#fffbe6"
                        : colors.primary,
                    fontWeight: 900,
                    fontSize: "1rem",
                    letterSpacing: "0.07em",
                    display: "flex",
                    alignItems: "center",
                    gap: 13,
                    textAlign: "left",
                    textDecoration: "none",
                    boxShadow: currentSection === item.key
                      ? `0 0 12px 4px ${colors.secondary}35`
                      : "none",
                    border: currentSection === item.key ? `2.5px solid ${colors.secondary}` : "none",
                    transition: "background 0.17s, color 0.2s, box-shadow 0.17s",
                  }}
                  aria-current={currentSection === item.key ? "page" : undefined}
                  aria-label={`Navigate to ${item.label}`}
                  onClick={e => {
                    e.preventDefault();
                    handleNav(item.key, item.href);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleNav(item.key, item.href);
                    }
                  }}
                >
                  <span aria-hidden="true" style={{ fontSize: 19 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
            <li style={{ width: "100%", marginTop: 11 }}>
              <button
                className="mm-navbar-theme-toggle"
                type="button"
                aria-label="Toggle theme"
                style={{
                  width: "93vw",
                  margin: "0 auto",
                  background: darkMode ? "#222034ea" : "#faf7dd",
                  border: `2.5px solid ${darkMode ? colors.secondary : colors.primary}`,
                  color: darkMode ? colors.secondary : colors.primary,
                  borderRadius: 8,
                  padding: 8,
                  fontSize: 22,
                  cursor: "pointer",
                  marginTop: 6,
                  marginBottom: 2,
                  boxShadow: darkMode
                    ? `0 0 9px 2px ${colors.secondary}25`
                    : `0 0 7px 2px ${colors.primary}15`,
                  outline: "none"
                }}
                onClick={onToggleTheme}
                tabIndex={0}
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
      {/* Inline keyframes for mobile fade-in */}
      <style>
        {`
        @keyframes mm-navbar-mobile-fade-in {
          from { opacity: 0; transform: translateY(-13px);}
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
