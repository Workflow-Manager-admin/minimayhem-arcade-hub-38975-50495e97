import React, { useEffect, useState } from 'react';

// Google Fonts Import
const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap';

// Neon colors for theme
const COLORS = {
  pink: '#F72585',
  purple: '#3A0CA3',
  blue: '#4CC9F0',
  yellow: '#FFB703',
  black: '#0D0D0D',
};

// Arcade Feature Cards Data
const games = [
  {
    title: 'Typing Challenge',
    description: 'How fast can you type? Race against the clock!',
    icon: '⌨️',
    color: COLORS.blue,
  },
  {
    title: 'Reaction Speed',
    description: 'Test your reflexes in a neon flurry!',
    icon: '⚡',
    color: COLORS.pink,
  },
  {
    title: 'Sudoku',
    description: 'Classic logic puzzle with a digital twist.',
    icon: '🔢',
    color: COLORS.yellow,
  },
  {
    title: 'Memory Match',
    description: 'Flip cards and test your memory!',
    icon: '🃏',
    color: COLORS.purple,
  },
];

// PUBLIC_INTERFACE
function App() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const local = window.localStorage.getItem('mm-arcade-theme');
    return local ? JSON.parse(local) : true;
  });

  // Animated neon hero text
  const [neonGlow, setNeonGlow] = useState(false);

  // Daily Challenge content
  const [quote, setQuote] = useState('');
  const [joke, setJoke] = useState('');

  // Mount Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = FONT_URL;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Theme on <body>
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    document.body.classList.toggle('light', !darkMode);
    window.localStorage.setItem('mm-arcade-theme', JSON.stringify(darkMode));
  }, [darkMode]);

  // Neon title animation
  useEffect(() => {
    const interval = setInterval(() => setNeonGlow(x => !x), 1200);
    return () => clearInterval(interval);
  }, []);

  // Fetch Quote & Joke
  useEffect(() => {
    async function fetchQuote() {
      try {
        const resp = await fetch('https://zenquotes.io/api/random');
        const data = await resp.json();
        setQuote(data[0]?.q ? `${data[0].q} — ${data[0].a}` : 'Keep playing, keep winning!');
      } catch {
        setQuote('Keep playing, keep winning!');
      }
    }
    async function fetchJoke() {
      try {
        const resp = await fetch('https://v2.jokeapi.dev/joke/Any?type=single,twopart&lang=en');
        const data = await resp.json();
        if (data.type === 'single') setJoke(data.joke);
        else if (data.type === 'twopart') setJoke(`${data.setup} ... ${data.delivery}`);
        else setJoke('Why did the arcade get good grades? Because it had all the right buttons!');
      } catch {
        setJoke('Why did the arcade get good grades? Because it had all the right buttons!');
      }
    }
    fetchQuote();
    fetchJoke();
  }, []);

  // PUBLIC_INTERFACE
  function toggleTheme() {
    setDarkMode(dm => !dm);
  }

  // Google Fonts family string
  const fontFamilyArcade = "'Press Start 2P', 'VT323', monospace";

  // Neon shadow builder
  const neonShadow = (color, intensity = 2) =>
    Array.from({ length: intensity })
      .map((_, i) => `0 0 ${4 + i * 4}px ${color}`)
      .join(',');

  // We now hardcode nav links as per new spec; use state for dropdown open/close
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Utilities for closing dropdown if user clicks outside
  useEffect(() => {
    if (!settingsOpen) return;
    function handleClick(e) {
      const m = document.getElementById('mm-settings-dropdown-menu');
      if (m && !m.contains(e.target)) setSettingsOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [settingsOpen]);

  return (
    <div
      className="mm-app"
      style={{
        minHeight: '100vh',
        fontFamily: fontFamilyArcade,
        background: darkMode
          ? `linear-gradient(135deg, ${COLORS.black}, #1E003A 100%)`
          : `linear-gradient(135deg, #ffffff 0%, ${COLORS.blue} 130%)`,
        transition: 'background 0.4s',
      }}
    >
      {/* HEADER */}
      <header className="mm-header" style={{
        position: 'fixed',
        top: 0,
        width: '100vw',
        zIndex: 90,
        background: darkMode
          ? `linear-gradient(to right, #18102A 60%, ${COLORS.purple} 170%)`
          : '#ffffffe3',
        borderBottom: `2px solid ${darkMode ? COLORS.pink : COLORS.purple}`,
        boxShadow: `0 2px 16px 0 ${darkMode ? COLORS.purple : COLORS.blue}44`
      }}>
        <nav
          className="mm-nav"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            position: 'relative'
          }}
        >
          {/* Logo/Landing Link */}
          <a
            href="/"
            className="mm-logo-link"
            style={{
              textDecoration: 'none',
              outline: 'none',
              marginRight: 0,
            }}
            aria-label="Go to MiniMayhem Arcade Landing Page"
          >
            <span
              className="mm-logo"
              style={{
                color: COLORS.pink,
                fontSize: '2rem',
                letterSpacing: -2,
                fontWeight: 900,
                textShadow: neonShadow(COLORS.pink, 2),
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: "'Press Start 2P', VT323, monospace",
                userSelect: 'none',
              }}
            >
              <span
                style={{
                  color: COLORS.blue,
                  fontSize: '2.5rem',
                  textShadow: neonShadow(COLORS.blue),
                }}
              >
                🕹️
              </span>
              MiniMayhem Arcade
            </span>
          </a>
          {/* New Nav Links, left-aligned */}
          <ul
            className="mm-nav-links"
            style={{
              listStyle: 'none',
              display: 'flex',
              gap: 24,
              margin: '0 0 0 32px',
              padding: 0,
              alignItems: 'center',
              flex: '0 1 auto',
            }}
          >
            {/* Our Games */}
            <li>
              <a
                href="#games"
                style={{
                  color: darkMode ? COLORS.yellow : COLORS.purple,
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '1rem',
                  padding: '6px 12px',
                  borderRadius: 6,
                  letterSpacing: 1,
                  textShadow: neonShadow(
                    darkMode ? COLORS.yellow : COLORS.purple, 2
                  ),
                  transition: 'color 0.23s, background 0.28s',
                }}
                className="mm-nav-link"
              >
                Our Games
              </a>
            </li>
            {/* Top Game */}
            <li>
              <a
                href="#top-game"
                style={{
                  color: darkMode ? COLORS.pink : COLORS.blue,
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '1rem',
                  padding: '6px 12px',
                  borderRadius: 6,
                  letterSpacing: 1,
                  textShadow: neonShadow(
                    darkMode ? COLORS.pink : COLORS.blue, 2
                  ),
                  transition: 'color 0.23s, background 0.28s',
                }}
                className="mm-nav-link"
              >
                Top Game
              </a>
            </li>
            {/* Settings Dropdown */}
            <li
              style={{
                position: 'relative',
                userSelect: 'none',
              }}
              onMouseLeave={() => setSettingsOpen(false)}
            >
              <button
                className="mm-nav-link mm-dropdown-btn"
                type="button"
                aria-haspopup="true"
                aria-expanded={settingsOpen}
                style={{
                  background: 'none',
                  border: 'none',
                  color: darkMode ? COLORS.blue : COLORS.purple,
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '6px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  boxShadow: 'none',
                  outline: (settingsOpen ? `2px solid ${COLORS.purple}` : 'none'),
                  letterSpacing: 1,
                  textShadow: neonShadow(
                    darkMode ? COLORS.blue : COLORS.purple, 2
                  ),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                onClick={() => setSettingsOpen((o) => !o)}
                onBlur={e => {
                  setTimeout(() => setSettingsOpen(false), 120);
                }}
                tabIndex={0}
              >
                Settings
                <span style={{
                  fontSize: '1.1em',
                  verticalAlign: 'middle',
                  marginLeft: 3,
                  userSelect: 'none'
                }}>▼</span>
              </button>
              {/* Dropdown Panel */}
              {settingsOpen && (
                <ul
                  id="mm-settings-dropdown-menu"
                  className="mm-dropdown-menu"
                  style={{
                    listStyle: 'none',
                    background: darkMode
                      ? '#23224aee'
                      : '#f7f7ffdd',
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    minWidth: 150,
                    margin: 0,
                    marginTop: 7,
                    padding: 0,
                    borderRadius: 7,
                    boxShadow: `0 2.5px 18px 2px ${darkMode ? COLORS.purple : COLORS.blue}44`,
                    border: `2px solid ${darkMode ? COLORS.purple : COLORS.blue}`,
                    zIndex: 200,
                  }}
                  role="menu"
                >
                  {/* About Us */}
                  <li>
                    <a
                      href="#about-us"
                      className="mm-dropdown-item"
                      tabIndex={0}
                      style={{
                        display: 'block',
                        color: darkMode ? COLORS.purple : COLORS.blue,
                        padding: '10px 16px',
                        textDecoration: 'none',
                        background: 'none',
                        fontWeight: 600,
                        borderRadius: 7,
                        fontFamily: fontFamilyArcade,
                        fontSize: '1em',
                        textAlign: 'left',
                        letterSpacing: 0.5,
                        cursor: 'pointer',
                        outline: 'none',
                        textShadow: neonShadow(darkMode ? COLORS.purple : COLORS.blue, 1),
                        transition: 'background 0.19s, color 0.19s',
                      }}
                      onMouseDown={e => setSettingsOpen(false)}
                      role="menuitem"
                    >
                      About Us
                    </a>
                  </li>
                  {/* Help */}
                  <li>
                    <a
                      href="#help"
                      className="mm-dropdown-item"
                      tabIndex={0}
                      style={{
                        display: 'block',
                        color: darkMode ? COLORS.pink : COLORS.purple,
                        padding: '10px 16px',
                        textDecoration: 'none',
                        background: 'none',
                        fontWeight: 600,
                        borderRadius: 7,
                        fontFamily: fontFamilyArcade,
                        fontSize: '1em',
                        textAlign: 'left',
                        letterSpacing: 0.5,
                        cursor: 'pointer',
                        outline: 'none',
                        textShadow: neonShadow(darkMode ? COLORS.pink : COLORS.purple, 1),
                        transition: 'background 0.19s, color 0.19s',
                      }}
                      onMouseDown={e => setSettingsOpen(false)}
                      role="menuitem"
                    >
                      Help
                    </a>
                  </li>
                  {/* Contact */}
                  <li>
                    <a
                      href="#contact"
                      className="mm-dropdown-item"
                      tabIndex={0}
                      style={{
                        display: 'block',
                        color: darkMode ? COLORS.yellow : COLORS.pink,
                        padding: '10px 16px',
                        textDecoration: 'none',
                        background: 'none',
                        fontWeight: 600,
                        borderRadius: 7,
                        fontFamily: fontFamilyArcade,
                        fontSize: '1em',
                        textAlign: 'left',
                        letterSpacing: 0.5,
                        cursor: 'pointer',
                        outline: 'none',
                        textShadow: neonShadow(darkMode ? COLORS.yellow : COLORS.pink, 1),
                        transition: 'background 0.19s, color 0.19s',
                      }}
                      onMouseDown={e => setSettingsOpen(false)}
                      role="menuitem"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
          {/* Theme toggle - right-most, small */}
          <button
            className="mm-theme-toggle"
            aria-label="Toggle dark/light theme"
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: darkMode ? '#1c1c25cb' : '#f0f0ffcc',
              border: `2px solid ${darkMode ? COLORS.yellow : COLORS.purple}`,
              borderRadius: 8,
              padding: '0.09em 0.25em',
              marginLeft: 'auto',
              cursor: 'pointer',
              outline: 'none',
              marginTop: 0,
              marginRight: 2,
              fontSize: 18, // smaller
              boxShadow: `0 0 0 2px ${
                darkMode ? COLORS.pink : COLORS.purple
              }33,${neonShadow(darkMode ? COLORS.yellow : COLORS.purple, 1)}`,
              color: darkMode ? COLORS.yellow : COLORS.purple,
              transition:
                'background 0.15s, color 0.19s, border 0.10s, box-shadow 0.12s',
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              minWidth: 27,
              minHeight: 27,
              lineHeight: 1,
            }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
              }
            }}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            data-testid="theme-toggle-btn"
            type="button"
          >
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                lineHeight: 1,
                transform: darkMode
                  ? 'rotate(-14deg) scale(0.85)'
                  : 'rotate(9deg) scale(0.92)',
                filter: darkMode
                  ? 'drop-shadow(0 0 1.5px #ffe46c99)'
                  : 'drop-shadow(0 0 1.5px #511cc088)',
                textShadow: neonShadow(
                  darkMode ? COLORS.yellow : COLORS.purple,
                  1
                ),
                userSelect: 'none',
                fontSize: 13,
                margin: 0,
                padding: 0,
              }}
            >
              {darkMode ? (
                // Unicode Moon - pure icon only
                <span
                  role="img"
                  aria-label="dark mode"
                  style={{ fontSize: '1.18em' }}
                >
                  🌙
                </span>
              ) : (
                // Unicode Sun - pure icon only
                <span
                  role="img"
                  aria-label="light mode"
                  style={{ fontSize: '1.18em' }}
                >
                  🌞
                </span>
              )}
            </span>
          </button>
        </nav>
      </header>
      {/* HERO SECTION */}
      <main className="mm-main" style={{
        paddingTop: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
      }}>
        <section className="mm-hero" style={{
          width: '100%',
          textAlign: 'center',
          paddingBottom: 32,
        }}>
          {/* Animated hero icon */}
          <div className="mm-hero-arcade-icon"
            style={{
              margin: '0 auto 14px auto',
              animation: 'icon-bounce 1.5s infinite alternate cubic-bezier(.93,.17,.47,1.13)'
            }}
          >
            <span style={{
              fontSize: 72,
              textShadow: neonShadow(COLORS.blue, 4)
            }}>👾</span>
          </div>
          <h1
            style={{
              fontSize: '2.8rem',
              background: `linear-gradient(89deg, ${COLORS.pink}, ${COLORS.purple}, ${COLORS.blue})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: "'Press Start 2P', VT323, monospace",
              letterSpacing: '.06em',
              transition: 'text-shadow 0.5s',
              textShadow: neonGlow
                ? `${neonShadow(COLORS.pink, 4)}, ${neonShadow(COLORS.blue, 4)}`
                : `${neonShadow(COLORS.purple, 3)}`,
              margin: 0
            }}
          >Welcome to MiniMayhem Arcade</h1>
          <div
            className="mm-hero-description"
            style={{
              marginTop: 16,
              marginBottom: 24,
              fontSize: '1.1rem',
              color: darkMode ? COLORS.blue : COLORS.pink,
              textShadow: neonShadow(darkMode ? COLORS.blue : COLORS.pink, 2),
              maxWidth: 425,
              marginInline: 'auto'
            }}
          >
            Play lightning-fast mini-games, win daily challenges, and outscore your rivals in a neon blitz.
          </div>
          {/* CTA Button */}
          <a
            href="#games"
            className="mm-cta-btn"
            style={{
              color: darkMode ? COLORS.pink : '#fff',
              background: darkMode
                ? `linear-gradient( 90deg, ${COLORS.purple} 0%, ${COLORS.pink} 100%)`
                : `linear-gradient(90deg, ${COLORS.blue} 0%, ${COLORS.yellow} 100%)`,
              border: `2px solid ${darkMode ? COLORS.purple : COLORS.blue}`,
              boxShadow: [
                neonShadow(COLORS.yellow),
                '0 0 16px 2px #fff3'
              ].join(','),
              fontFamily: "'Press Start 2P', monospace",
              textTransform: 'uppercase',
              fontWeight: 900,
              fontSize: 18,
              padding: '12px 28px',
              borderRadius: 8,
              letterSpacing: "0.06em",
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.18s, box-shadow 0.2s'
            }}
          >Enter the Arcade!</a>
        </section>
        {/* FEATURE TEASERS */}
        <section id="games" style={{
          width: '100%',
          margin: '0 auto',
          maxWidth: 1200,
          padding: '30px 12px 0 12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <h2 style={{
            fontFamily: fontFamilyArcade,
            fontSize: 28,
            color: darkMode ? COLORS.yellow : COLORS.purple,
            margin: '0 0 20px 0',
            textShadow: neonShadow(darkMode ? COLORS.yellow : COLORS.purple, 2)
          }}>🎮 Featured Games</h2>
          {/* Game cards */}
          <div className="mm-game-cards" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 32,
            justifyContent: 'center'
          }}>
            {games.map(game => (
              <div
                className="mm-game-card"
                key={game.title}
                style={{
                  flex: '1 1 180px',
                  minWidth: 180,
                  maxWidth: 240,
                  background: darkMode
                    ? `linear-gradient(135deg, #292049 50%, #26126e 100%)`
                    : `linear-gradient(135deg, #fff 60%,${game.color}11 120%)`,
                  border: `2.5px solid ${game.color}`,
                  borderRadius: 18,
                  boxShadow: neonShadow(game.color, 4),
                  margin: '8px 0',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  padding: 18,
                  transition: 'transform 0.22s,cubic-bezier(.87,-0.29,.65,1.96),box-shadow 0.18s,border 0.13s',
                  willChange: 'transform',
                  position: 'relative'
                }}
                tabIndex={0}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'scale(1.065) rotate(-2deg)';
                  e.currentTarget.style.boxShadow = `${neonShadow(game.color, 8)},0 0 24px 4px #fff2`
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0)';
                  e.currentTarget.style.boxShadow = neonShadow(game.color, 4);
                }}
              >
                {/* Arcade Animated icon */}
                <div style={{
                  fontSize: 38,
                  textShadow: neonShadow(game.color, 2),
                  marginBottom: 12,
                  filter: 'none'
                }}>{game.icon}</div>
                <div
                  style={{
                    fontFamily: "'VT323',monospace",
                    fontSize: 22,
                    color: game.color,
                    marginBottom: 10,
                    letterSpacing: '0.04em',
                    textShadow: neonShadow(game.color, 2)
                  }}
                >{game.title}</div>
                <div style={{
                  fontSize: 13,
                  color: darkMode ? COLORS.blue : COLORS.purple,
                  fontFamily: "'Press Start 2P', monospace",
                  textShadow: neonShadow(darkMode ? COLORS.blue : COLORS.purple, 1),
                }}>
                  {game.description}
                </div>
                <span
                  style={{
                    position: 'absolute',
                    right: 16,
                    bottom: 12,
                    color: game.color,
                    opacity: 0.6,
                    fontSize: 18,
                    filter: 'none',
                  }}
                >🟩</span>
              </div>
            ))}
          </div>
        </section>
        {/* DAILY CHALLENGE */}
        <section id="challenge" style={{
          marginTop: 55,
          width: '100%',
          maxWidth: 680,
          textAlign: 'center',
          padding: '30px 16px',
          borderRadius: 14,
          background: darkMode
            ? `linear-gradient(137deg, ${COLORS.pink}12, ${COLORS.yellow}0e 120%)`
            : `linear-gradient(134deg, #fff8, ${COLORS.blue}11 120%)`,
          boxShadow: neonShadow(COLORS.yellow, 2)
        }}>
          <h2 style={{
            fontFamily: fontFamilyArcade,
            fontSize: 24,
            color: COLORS.purple,
            margin: 0,
            textShadow: neonShadow(COLORS.purple, 2)
          }}>🗓️ Daily Challenge!</h2>
          <div style={{
            margin: '18px auto 12px auto',
            maxWidth: 400,
            color: darkMode ? COLORS.blue : COLORS.pink,
            fontSize: 15,
            textShadow: neonShadow(darkMode ? COLORS.blue : COLORS.pink, 1)
          }}>
            <strong>Motivation:</strong>
            <div style={{
              marginTop: 5, marginBottom: 14,
              fontStyle: 'italic',
              fontFamily: "'VT323',monospace"
            }} aria-live="polite">
              {quote ? <span>“{quote}”</span> : <span>Loading inspiration…</span>}
            </div>
          </div>
          <div style={{
            margin: '15px auto 8px auto',
            maxWidth: 380,
            color: darkMode ? COLORS.pink : COLORS.purple,
            fontFamily: "'VT323',monospace",
            fontSize: 15,
            background: darkMode ? '#18102A55' : '#F7C94811',
            padding: '14px 12px',
            borderRadius: 8,
            boxShadow: neonShadow(darkMode ? COLORS.pink : COLORS.purple, 2),
          }}>
            <strong>Joke of the Day:</strong>
            <div style={{
              marginTop: 7,
              fontStyle: 'italic',
              letterSpacing: '.01em'
            }} aria-live="polite">
              {joke ? <span>{joke}</span> : <span>Loading a good laugh…</span>}
            </div>
          </div>
          <div style={{
            marginTop: 20,
            color: COLORS.yellow,
            fontWeight: 700,
            textShadow: neonShadow(COLORS.yellow),
            fontSize: 19,
          }}>
            Can you beat today's high score? 🎯
          </div>
        </section>
      </main>
      {/* FOOTER */}
      <footer className="mm-footer" style={{
        marginTop: 36,
        padding: '27px 0 14px 0',
        width: '100vw',
        textAlign: 'center',
        background: darkMode ? '#110829' : '#f9f9fb',
        borderTop: `3px solid ${darkMode ? COLORS.blue : COLORS.purple}`,
        boxShadow: neonShadow(darkMode ? COLORS.blue : COLORS.purple, 1),
        position: 'relative'
      }}>
        {/* Footer Links */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <nav>
            <a href="#games" style={{
              color: COLORS.blue,
              textDecoration: 'none',
              fontWeight: 700,
              fontFamily: fontFamilyArcade,
              fontSize: 16,
              marginRight: 18,
              textShadow: neonShadow(COLORS.blue, 1)
            }}>
              Games
            </a>
            <a href="#challenge" style={{
              color: COLORS.pink,
              textDecoration: 'none',
              fontWeight: 700,
              fontFamily: fontFamilyArcade,
              fontSize: 16,
              textShadow: neonShadow(COLORS.pink, 1)
            }}>
              Challenge
            </a>
          </nav>
        </div>
        <div style={{
          marginTop: 15,
          color: darkMode ? COLORS.yellow : COLORS.purple,
          fontFamily: fontFamilyArcade,
          fontSize: 14,
          textShadow: neonShadow(darkMode ? COLORS.yellow : COLORS.purple, 1)
        }}>
          Made with <span aria-label="arcade heart">💖</span> by MiniMayhem Arcade Team &copy; {new Date().getFullYear()}
        </div>
        <div style={{ marginTop: 7, fontSize: 10, color: '#8887' }}>
          <a href="https://zenquotes.io/" style={{ color: COLORS.blue, textDecoration: 'underline' }}>ZenQuotes.io</a> &amp; <a href="https://jokeapi.dev/" style={{ color: COLORS.pink, textDecoration: 'underline' }}>JokeAPI</a> powered.
        </div>
      </footer>
      {/* KEYFRAMES and Style */}
      <style>
        {`
        html {
          scroll-behavior: smooth;
        }
        .mm-app {
          font-family: ${fontFamilyArcade};
        }
        @media (max-width: 768px) {
          .mm-nav-links { gap: 13px !important; font-size: 97%;}
          .mm-footer { font-size: 90%!important;}
          .mm-game-cards { flex-direction: column !important; align-items: center; }
        }
        @media (max-width: 600px) {
          .mm-header { padding: 9px 0!important; }
          .mm-nav { padding: 9px 8px!important; flex-direction: column;}
          .mm-logo { font-size: 1.13rem !important;}
          .mm-hero-arcade-icon { font-size: 36px !important;}
          .mm-hero-description, .mm-game-card, .mm-game-cards { font-size: 98%!important;}
        }
        @keyframes icon-bounce {
         0% { transform: scale(1) translateY(0);}
         85% { transform: scale(1.08) translateY(-7px);}
         100% { transform: scale(1) translateY(0);}
        }
        `}
      </style>
    </div>
  );
}

export default App;
