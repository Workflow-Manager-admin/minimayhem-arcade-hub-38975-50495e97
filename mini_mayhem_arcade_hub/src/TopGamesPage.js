import React, { useEffect, useState } from 'react';
import './TopGamesPage.css';

// PUBLIC_INTERFACE
function TopGamesPage({ darkMode, neonShadow, fontFamilyArcade, COLORS }) {
  // Data/loading/error state
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);

  // Fetch Top Deals on mount
  useEffect(() => {
    setLoading(true);
    setErr(false);
    fetch('https://www.cheapshark.com/api/1.0/deals?sortBy=Deal%20Rating&pageSize=15')
      .then(r => {
        if (!r.ok) throw new Error('Bad network');
        return r.json();
      })
      .then(data => {
        setGames(data || []);
        setLoading(false);
      })
      .catch(e => {
        setErr(true);
        setLoading(false);
      });
  }, []);

  // Fallback styling if not provided
  neonShadow = neonShadow || ((color, i=2) =>
    Array.from({length:i}).map((_,ix)=>`0 0 ${4+ix*4}px ${color}`).join(','));
  fontFamilyArcade = fontFamilyArcade || "'Press Start 2P', 'Orbitron', 'VT323', monospace";
  COLORS = COLORS || {
    pink: '#F72585', purple: '#3A0CA3', blue: '#4CC9F0', yellow: '#FFB703', black: '#0D0D0D'
  };

  // Loader spinner
  const Spinner = () => (
    <div className="mm-tg-spinner" aria-label="Loading top games">
      <div className="arcade-loader" />
      <span style={{
        marginTop: 14,
        fontFamily: fontFamilyArcade,
        fontSize: '1em',
        color: COLORS.pink,
        textShadow: neonShadow(COLORS.pink,2)
      }}>Loading...</span>
    </div>
  );

  // Error UI
  const ErrorMsg = () => (
    <div className="mm-tg-error" tabIndex={0} aria-live="polite">
      <div style={{
        fontSize: '1.3em',
        color: COLORS.pink,
        textShadow: neonShadow(COLORS.pink,2),
        marginBottom: 7,
        fontFamily: fontFamilyArcade
      }}>
        Uh-oh! Unable to fetch top games.
      </div>
      <div style={{
        fontFamily: fontFamilyArcade,
        color: COLORS.blue,
        textShadow: neonShadow(COLORS.blue,1)
      }}>
        Please check your connection and try again soon.
      </div>
    </div>
  );

  // Card render
  function GameCard({ game }) {
    const gameColors = [COLORS.pink, COLORS.purple, COLORS.blue, COLORS.yellow];
    const borderColor = gameColors[game.gameID % 4];
    return (
      <div
        className="mm-topgame-card"
        tabIndex={0}
        style={{
          background: darkMode
            ? 'linear-gradient(135deg, #19103D 60%, #22083D 120%)'
            : 'linear-gradient(135deg, #fcfbfd 60%, #b8cee4 140%)',
          color: COLORS.neonText || '#fffbe6',
          border: `2.3px solid ${borderColor}`,
          boxShadow: neonShadow(borderColor, 5),
          fontFamily: "'Orbitron', 'Press Start 2P', monospace",
        }}
      >
        <div className="mm-topgame-image">
          <img
            src={game.thumb}
            alt={game.title}
            loading="lazy"
            style={{ borderRadius: 9, boxShadow: neonShadow(COLORS.blue,1) }}
          />
        </div>
        <div className="mm-topgame-title" style={{
          color: borderColor,
          textShadow: neonShadow(borderColor,2)
        }}>{game.title}</div>
        <div className="mm-topgame-rating">
          <span role="img" aria-label="Deal rating">🔥</span>
          <span style={{ marginLeft: 2 }}>{game.dealRating}</span>
        </div>
        <div className="mm-topgame-prices">
          <span className="mm-topgame-sale" style={{
            color: COLORS.yellow,
            textShadow: neonShadow(COLORS.yellow,1)
          }}>${game.salePrice}</span>{' '}
          <span className="mm-topgame-original"
            style={{
              textDecoration: 'line-through',
              color: COLORS.purple,
              marginLeft: 5
            }}
          >
            ${game.normalPrice}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mm-topgames-bg"
      style={{
        minHeight: '100vh',
        paddingTop: 112,
        background: darkMode
          ? 'radial-gradient(ellipse at 60% 15%, #6129e6 0%, #0d0d27 65%)'
          : 'linear-gradient(135deg, #fff 0%, #c7e0fa 120%)',
        fontFamily: fontFamilyArcade,
        transition: 'background 0.5s'
      }}
    >
      <div className="mm-topgames-container">
        <h1
          className="mm-topgames-heading"
          style={{
            color: COLORS.blue,
            fontFamily: "'Press Start 2P', 'Orbitron', monospace",
            fontWeight: 900,
            letterSpacing: '.06em',
            fontSize: '2.2rem',
            textShadow: neonShadow(COLORS.blue,5),
          }}
        >🎲 Top Game Deals</h1>
        <div
          className="mm-topgames-subheading"
          style={{
            color: COLORS.yellow,
            fontFamily: "'Orbitron', 'Press Start 2P', monospace",
            fontSize: 17,
            marginBottom: 14,
            textShadow: neonShadow(COLORS.yellow,3),
            background: 'none',
            lineHeight: 1.5
          }}
        >The best rated game deals (CheapShark API) right now!</div>
        {loading && <Spinner />}
        {err && !loading && <ErrorMsg />}
        {!loading && !err && (
          <div className="mm-topgames-grid">
            {games.map((game) =>
              <GameCard key={game.dealID} game={game} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default TopGamesPage;
