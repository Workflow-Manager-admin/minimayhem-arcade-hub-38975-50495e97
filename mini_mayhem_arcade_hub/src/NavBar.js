import React, { useContext, useState } from "react";
import { FaStar, FaTrophy, FaGamepad, FaSmile, FaBars, FaTimes } from "react-icons/fa";

/**
 * PUBLIC_INTERFACE
 * NavBar component for MiniMayhem Arcade Hub.
 * Features: Responsive, arcade-style, dark/light mode, supports navigation to main features.
 * Props:
 *   - darkMode: boolean (required, for theme styling)
 *   - onToggleTheme: function (optional, for theme switch)
 *   - onNavigate: function (optional, receives string: destination)
 */
function NavBar({ darkMode, onToggleTheme, onNavigate }) {
  // Show/hide nav for mobile
  const [navOpen, setNavOpen] = useState(false);

  // Arcade palette per spec
  const PALETTE = {
    primary: "#2D2D72",
    secondary: "#F7C948",
    accent: "#9c9c9c",
    white: "#fff",
    dark: "#14142b",
    black: "#0f1333",
  };

  // Mode-dependent variables
  const bg = darkMode
    ? `linear-gradient(90deg, ${PALETTE.black}, ${PALETTE.primary} 95%)`
    : `linear-gradient(90deg, #ffffff 60%, ${PALETTE.primary} 120%)`;
  const linkColor = darkMode ? PALETTE.secondary : PALETTE.primary;
  const iconShadow = (color) =>
    `0 0 8px 2.5px ${color}cc, 0 0 2px ${color}aa`;

  // Neon accent border
  const borderAccent = darkMode ? PALETTE.secondary : PALETTE.primary;

  // Arcade font
  const font = "'Press Start 2P', 'VT323', 'Orbitron', monospace";

  // Navigation links (icon, label, hash)
  const NAV_LINKS = [
    {
      icon: <FaStar size={18} aria-label="Scoreboard" style={{ filter: 'none' }} />,
      label: "Scoreboard",
      href: "#scoreboard",
    },
    {
      icon: <FaTrophy size={18} aria-label="Achievements" style={{ filter: 'none' }} />,
      label: "Achievements",
      href: "#achievements",
    },
    {
      icon: <FaSmile size={18} aria-label="FunZone" style={{ filter: 'none' }} />,
      label: "FunZone",
      href: "#funzone",
    },
    {
      icon: <FaGamepad size={18} aria-label="Mini-Games" style={{ filter: 'none' }} />,
      label: "Mini-Games",
      href: "#games",
    },
  ];

  // PUBLIC_INTERFACE
  function handleLinkClick(href) {
    setNavOpen(false);
    if (onNavigate) onNavigate(href);
    window.location.hash = href;
  }

  return (
    <nav
      className="mm-navbar"
      style={{
        width: "100vw",
        height: 64,
        minHeight: 56,
        background: bg,
        display: "flex",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 101,
        borderBottom: `3px solid ${borderAccent}`,
        boxShadow: darkMode
          ? `0 3px 14px 1px ${PALETTE.primary}33`
          : `0 3px 20px 2px ${PALETTE.accent}25`,
        fontFamily: font,
        transition: "background 0.28s, border-color 0.12s",
      }}
      aria-label="Main navigation bar"
    >
      {/* MiniMayhem Logo */}
      <a
        href="/"
        className="mm-navbar-logo"
        style={{
          fontFamily: font,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: "1.2rem",
          color: darkMode ? PALETTE.secondary : PALETTE.primary,
          textDecoration: "none",
          fontWeight: 900,
          letterSpacing: "0.04em",
          marginLeft: 20,
          textShadow: iconShadow(PALETTE.secondary),
          userSelect: "none",
          whiteSpace: "nowrap"
        }}
        aria-label="MiniMayhem Arcade Home"
        tabIndex={0}
      >
        <span
          style={{
            fontSize: 27,
            marginRight: 7,
            color: darkMode ? PALETTE.secondary : PALETTE.primary,
            textShadow: iconShadow(
              darkMode ? PALETTE.secondary : PALETTE.primary
            ),
            verticalAlign: "middle",
            filter: "none"
          }}
        >
          🕹️
        </span>
        <span>MiniMayhem</span>
      </a>

      {/* Hamburger button on mobile */}
      <button
        className="mm-navbar-burger"
        style={{
          display: "none",
          position: "absolute",
          right: 22,
          background: "none",
          border: "none",
          color: linkColor,
          fontSize: 28,
          zIndex: 2,
          cursor: "pointer",
          outline: "none",
        }}
        aria-label={navOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={navOpen}
        aria-controls="mm-navbar-links"
        onClick={() => setNavOpen((o) => !o)}
      >
        {navOpen ? (
          <FaTimes style={{ filter: "none" }} />
        ) : (
          <FaBars style={{ filter: "none" }} />
        )}
      </button>

      {/* Main Links */}
      <ul
        id="mm-navbar-links"
        className="mm-navbar-links"
        style={{
          listStyle: "none",
          display: "flex",
          gap: 27,
          margin: "0 0 0 54px",
          padding: 0,
          alignItems: "center",
          flex: "1 1 auto",
          transition: "all 0.24s",
        }}
        tabIndex={-1}
        role="menu"
      >
        {NAV_LINKS.map((item, idx) => (
          <li key={item.label} role="none">
            <a
              href={item.href}
              className="mm-navbar-link"
              role="menuitem"
              tabIndex={0}
              style={{
                color: linkColor,
                textShadow: iconShadow(linkColor),
                textDecoration: "none",
                fontFamily: font,
                fontSize: 16,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "8px 18px",
                marginLeft: 0,
                borderRadius: 9,
                border: `2px solid transparent`,
                transition:
                  "color 0.19s, background 0.18s, border 0.16s, box-shadow 0.14s",
                boxShadow: "none",
                outline: "none",
                background:
                  navOpen && window.innerWidth < 769
                    ? (darkMode ? "#161a32e8" : "#f5f5ffcc")
                    : "none",
              }}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.href);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }
              }}
              onFocus={(e) => {
                e.target.style.outline = `2.2px solid ${PALETTE.secondary}`;
                e.target.style.background = darkMode ? "#F7C94855" : "#2D2D7220";
                e.target.style.color = darkMode ? "#2D2D72" : "#F7C948";
              }}
              onBlur={(e) => {
                e.target.style.outline = "none";
                e.target.style.background = "";
                e.target.style.color = linkColor;
              }}
              onMouseOver={(e) => {
                e.target.style.background = darkMode
                  ? "#F7C94833"
                  : "#9c9c9c23";
                e.target.style.boxShadow = iconShadow(PALETTE.accent);
              }}
              onMouseOut={(e) => {
                e.target.style.background = "";
                e.target.style.boxShadow = "none";
              }}
            >
              <span
                style={{
                  color: darkMode
                    ? PALETTE.secondary
                    : idx % 2 === 0
                    ? PALETTE.primary
                    : PALETTE.secondary,
                  textShadow: iconShadow(
                    darkMode
                      ? PALETTE.secondary
                      : idx % 2 === 0
                      ? PALETTE.primary
                      : PALETTE.secondary
                  ),
                  filter: "none",
                }}
              >
                {item.icon}
              </span>
              <span style={{ marginLeft: 2, letterSpacing: ".03em" }}>
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* Theme toggle button */}
      {onToggleTheme && (
        <button
          className="mm-navbar-theme-toggle"
          onClick={() => {
            setNavOpen(false);
            onToggleTheme();
          }}
          aria-label="Toggle dark/light theme"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            marginRight: 22,
            marginLeft: "auto",
            background: "none",
            border: `2.5px solid ${PALETTE.secondary}`,
            borderRadius: 8,
            boxShadow: `0 0 0 2.5px ${PALETTE.accent}44, 0 0 9px 2px ${
              darkMode ? PALETTE.secondary : PALETTE.primary
            }66`,
            color: PALETTE.secondary,
            fontFamily: font,
            fontSize: 17,
            padding: "0.19em 0.38em",
            minWidth: 36,
            minHeight: 36,
            cursor: "pointer",
            outline: "none",
            transition: "background 0.14s, color 0.13s, border 0.13s, box-shadow 0.14s",
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          tabIndex={0}
        >
          {darkMode ? (
            // Sun icon
            <span role="img" aria-label="Switch to light mode" style={{ fontSize: 21 }}>
              ☀️
            </span>
          ) : (
            // Crescent/moon icon
            <span role="img" aria-label="Switch to dark mode" style={{ fontSize: 21 }}>
              🌙
            </span>
          )}
        </button>
      )}

      {/* Mobile nav overlay, only visible on mobile sizes */}
      <style>
        {`
        @media (max-width: 768px) {
          .mm-navbar-links {
            position: fixed;
            top: 64px;
            left: 0;
            width: 100vw;
            flex-direction: column;
            background: ${bg};
            gap: 0;
            margin-left: 0 !important;
            padding: 27px 0 20px 0;
            z-index: 900;
            box-shadow: 0 3px 22px 2px ${PALETTE.accent}48;
            display: ${navOpen ? "flex" : "none"};
          }
          .mm-navbar-burger {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mm-navbar-burger {
            display: none !important;
          }
          .mm-navbar-links {
            display: flex !important;
            position: static;
            flex-direction: row;
            background: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
        `}
      </style>
    </nav>
  );
}

export default NavBar;
