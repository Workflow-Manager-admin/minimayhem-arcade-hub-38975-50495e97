import React, { useEffect, useState } from 'react';
import './GamesPage.css';
import { FaCube, FaMemory, FaBolt, FaKeyboard, FaThLarge, FaPuzzlePiece } from 'react-icons/fa';

/**
 * PUBLIC_INTERFACE
 * GamesPage - The arcade hub's game selection UI.
 * - Pixel/pixelated neon headings
 * - Animated subheading
 * - Responsive 2–3 column grid with 6 interactive cards
 * - Arcade/pixel fonts, neon effects, dark/light mode support (theming from props/context)
 */

// ADVANCED THEME HOOK: Inherit darkMode and theme palette if props provided or via global/body.
const DEFAULT_COLORS = {
  pink: '#F72585',
  purple: '#3A0CA3',
  blue: '#4CC9F0',
  yellow: '#FFB703',
  black: '#0D0D0D',
};

const GAME_LIST = [
  {
    route: '/block-game',
    icon: <FaCube className="mm-gi-blocks" />,
    iconBg: 'linear-gradient(135deg, #4CC9F0 0%, #3A0CA3 100%)',
    title: 'Block Builder',
    description: 'Stack falling blocks and aim for a high score.',
    badge: 'New',
    difficult: 'Easy'
  },
  {
    route: '/memory-game',
    icon: <FaMemory className="mm-gi-memory" />,
    iconBg: 'linear-gradient(135deg, #F72585 0%, #3A0CA3 100%)',
    title: 'Memory Flip',
    description: 'Match the pairs as fast as you can!',
    difficult: 'Medium'
  },
  {
    route: '/reaction-test',
    icon: <FaBolt className="mm-gi-bolt" />,
    iconBg: 'linear-gradient(135deg, #FFB703 40%, #F72585 100%)',
    title: 'Speed Tap',
    description: 'How fast can you react?',
    badge: 'Hot',
    difficult: 'Fast'
  },
  {
    route: '/typing-challenge',
    icon: <FaKeyboard className="mm-gi-type" />,
    iconBg: 'linear-gradient(135deg, #3A0CA3 30%, #4CC9F0 100%)',
    title: 'Word Typer',
    description: 'Test your typing speed',
    difficult: 'Medium'
  },
  {
    route: '/sudoku',
    icon: <FaThLarge className="mm-gi-sudoku" />,
    iconBg: 'linear-gradient(135deg, #FFB703 0%, #3A0CA3 90%)',
    title: 'Sudoku Master',
    description: 'Solve classic puzzles—easy to hard!',
    difficult: 'Hard'
  },
  {
    route: '/sliding-tile',
    icon: <FaPuzzlePiece className="mm-gi-tile" />,
    iconBg: 'linear-gradient(135deg, #F72585 15%, #4CC9F0 100%)',
    title: 'Tile Slider',
    description: 'Arrange tiles into order—how quick are you?',
    difficult: 'Medium'
  }
];

// PUBLIC_INTERFACE
function GamesPage(props) {
  // 1. Try to get theme from props, context, or fallback to body class for dark mode
  // Accepts props: darkMode, COLORS, neonShadow, fontFamilyArcade (just like TopGamesPage)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof props.darkMode === 'boolean') return props.darkMode;
    // fallback to body class
    return document.body.classList.contains('dark');
  });

  // Allow color palette override from props
  const COLORS = props.COLORS || DEFAULT_COLORS;
  // font family consistency
  const fontFamilyArcade = props.fontFamilyArcade || "'Press Start 2P', 'VT323', monospace";
  // neon shadow utility
  const neonShadow = props.neonShadow || ((color, i = 2) =>
    Array.from({ length: i })
      .map((_, ix) => `0 0 ${4 + ix * 4}px ${color}`)
      .join(','));

  // Listen for changes if parent theme changes via props
  useEffect(() => {
    if (typeof props.darkMode === 'boolean') setDarkMode(props.darkMode);
  }, [props.darkMode]);
  // Listen for class changes on body (supporting real-time context)
  useEffect(() => {
    function handleThemeChange() {
      if (typeof props.darkMode !== 'boolean') {
        setDarkMode(document.body.classList.contains('dark'));
      }
    }
    window.addEventListener('storage', handleThemeChange);
    // optionally: observe classList on <body> as well
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => {
      window.removeEventListener('storage', handleThemeChange);
      observer.disconnect();
    };
  }, [props.darkMode]);

  // Dynamic styles
  const bgStyle = {
    background: darkMode
      ? 'linear-gradient(135deg, #0A0A0A, #18102A 80%)'
      : 'linear-gradient(135deg, #fdfdfd 0%, #e5f8ff 110%)',
    minHeight: '100vh',
    width: '100vw',
    padding: '54px 0 0 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    transition: 'background 0.5s'
  };

  return (
    <div
      className={`mm-games-bg${darkMode ? ' mm-dark' : ' mm-light'}`}
      style={bgStyle}
      data-theme={darkMode ? 'dark' : 'light'}
    >
      <div className="mm-games-inner" style={{ fontFamily: fontFamilyArcade }}>
        {/* Arcade heading */}
        <h1
          className="mm-games-heading"
          style={{
            background: darkMode
              ? 'linear-gradient(87deg, #00ffd2 33%, #32fb74 58%, #4CC9F0 98%)'
              : 'linear-gradient(91deg, #3A0CA3 10%, #4CC9F0 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: darkMode ? COLORS.blue : COLORS.purple,
            textShadow: neonShadow(darkMode ? COLORS.blue : COLORS.purple, 3),
            marginBottom: 14
          }}
        >
          <span
            role="img"
            aria-label="joystick"
            style={{
              marginRight: 13,
              fontSize: 31,
              textShadow: neonShadow(darkMode ? COLORS.yellow : COLORS.purple, 2)
            }}
          >
            🕹️
          </span>
          Choose a Game to Play!
        </h1>
        {/* Subheading with animation */}
        <div
          className="mm-games-subheading"
          aria-live="polite"
          style={{
            color: darkMode ? '#e4f9ed' : '#242ecc',
            background: 'none',
            opacity: 1,
            fontFamily: "'Poppins', Arial, Helvetica, sans-serif"
          }}
        >
          Ready to challenge your reflexes, memory, and brain power?<br />
          Pick a game below and beat your high score!
        </div>
        {/* Responsive games grid */}
        <section className="mm-games-grid" aria-label="Game selection grid">
          {GAME_LIST.map((game) => (
            <a
              className="mm-gamecard"
              href={game.route}
              key={game.route}
              tabIndex={0}
              style={{
                textDecoration: 'none',
                background: darkMode
                  ? '#1C1C1C'
                  : 'linear-gradient(132deg, #ecfaff 86%, #f8fafd 100%)',
                border: `2.5px solid ${darkMode ? COLORS.blue : COLORS.purple}`,
                boxShadow: darkMode
                  ? `0 0 11px 3px #32fb74bb, 0 0 16px 7px #4cc9f077`
                  : `0 0 12px 2px #c2dbfc45, 0 0 10px 4px #a7c4ff22`,
                color: darkMode ? '#fffbe6' : '#1A1A1A',
                transition: 'background 0.3s, box-shadow 0.23s'
              }}
              aria-label={`Play ${game.title}`}
            >
              <div
                className="mm-gamecard-icon"
                style={{
                  background: game.iconBg,
                  filter: darkMode ? 'brightness(0.97)' : 'brightness(1.12)',
                  boxShadow: neonShadow(
                    darkMode
                      ? game.iconBg.includes('#F72585')
                        ? COLORS.pink
                        : COLORS.blue
                      : COLORS.purple,
                    2
                  )
                }}
              >
                {game.icon}
              </div>
              <div className="mm-gamecard-header-row">
                <span
                  className="mm-gamecard-title"
                  style={{
                    color: darkMode ? COLORS.blue : COLORS.purple,
                    textShadow: neonShadow(darkMode ? COLORS.blue : COLORS.purple, 2)
                  }}
                >
                  {game.title}
                </span>
                {game.badge && (
                  <span
                    className="mm-gamecard-badge"
                    style={{
                      background: darkMode
                        ? 'linear-gradient(87deg,#00ffd2 30%,#F72585 120%)'
                        : 'linear-gradient(83deg, #3A0CA3 20%, #4CC9F0 100%)',
                      color: darkMode ? '#fffbe6' : '#fff',
                      boxShadow: neonShadow(COLORS.pink, 1)
                    }}
                  >
                    {game.badge}
                  </span>
                )}
              </div>
              <div
                className="mm-gamecard-desc"
                style={{
                  color: darkMode ? '#e4f9ed' : '#3A0CA3',
                  textShadow: neonShadow(darkMode ? COLORS.yellow : COLORS.purple, 1)
                }}
              >
                {game.description}
              </div>
              <div className="mm-gamecard-meta">
                <span
                  className="mm-gamecard-diff"
                  style={{
                    color: darkMode ? '#8cf2ff' : COLORS.purple,
                    background: darkMode ? '#241e2d48' : '#e1e7f344',
                    textShadow: neonShadow(COLORS.blue, 1)
                  }}
                >
                  {game.difficult}
                </span>
                {/* Future: <span className="mm-gamecard-tag mm-gamecard-completed">Completed</span> */}
              </div>
              <button
                className="mm-gamecard-play"
                tabIndex={-1}
                style={{
                  background: darkMode
                    ? 'linear-gradient(89deg, #00ffd2 20%, #32fb74 98%)'
                    : 'linear-gradient(97deg, #3A0CA3 15%, #4CC9F0 95%)',
                  color: darkMode ? '#181c1f' : '#fff',
                  border: `2px solid ${darkMode ? COLORS.blue : COLORS.purple}`,
                  boxShadow: neonShadow(darkMode ? COLORS.yellow : COLORS.blue, 1),
                  fontFamily: fontFamilyArcade
                }}
              >▶ Play</button>
            </a>
          ))}
        </section>
      </div>
    </div>
  );
}

export default GamesPage;
