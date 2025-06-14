import React from 'react';
import './GamesPage.css';
import { FaCube, FaMemory, FaBolt, FaKeyboard, FaThLarge, FaPuzzlePiece } from 'react-icons/fa';

/**
 * PUBLIC_INTERFACE
 * GamesPage - The arcade hub's game selection UI.
 * - Pixel/pixelated neon headings
 * - Animated subheading
 * - Responsive 2–3 column grid with 6 interactive cards
 * - Arcade/pixel fonts, neon effects, dark mode compatibility
 * - Easy to extend with new games
 */
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
function GamesPage() {
  // Arcade/pixel fonts used everywhere, see App.css for font import
  // Dark mode support is automatic via :root/body; local color vars here as fallback
  return (
    <div className="mm-games-bg">
      <div className="mm-games-inner">
        {/* Arcade heading */}
        <h1 className="mm-games-heading">
          <span role="img" aria-label="joystick" style={{ marginRight: 13, fontSize: 31 }}>🕹️</span>
          Choose a Game to Play!
        </h1>
        {/* Subheading with animation */}
        <div className="mm-games-subheading" aria-live="polite">
          Ready to challenge your reflexes, memory, and brain power?<br />
          Pick a game below and beat your high score!
        </div>
        {/* Responsive games grid */}
        <section className="mm-games-grid" aria-label="Game selection grid">
          {GAME_LIST.map(game => (
            <a
              className="mm-gamecard"
              href={game.route}
              key={game.route}
              tabIndex={0}
              style={{ textDecoration: 'none' }}
              aria-label={`Play ${game.title}`}
            >
              <div className="mm-gamecard-icon" style={{ background: game.iconBg }}>
                {game.icon}
              </div>
              <div className="mm-gamecard-header-row">
                <span className="mm-gamecard-title">{game.title}</span>
                {game.badge && <span className="mm-gamecard-badge">{game.badge}</span>}
              </div>
              <div className="mm-gamecard-desc">{game.description}</div>
              <div className="mm-gamecard-meta">
                <span className="mm-gamecard-diff">{game.difficult}</span>
                {/* Could include (future): <span className="mm-gamecard-tag mm-gamecard-completed">Completed</span> */}
              </div>
              <button className="mm-gamecard-play" tabIndex={-1}>▶ Play</button>
            </a>
          ))}
        </section>
      </div>
    </div>
  );
}

export default GamesPage;
