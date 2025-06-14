import React, { useRef, useState, useEffect, useCallback } from "react";

/**
 * PUBLIC_INTERFACE
 * BlockBuilder - MiniMayhem Arcade's pixel stacker block game.
 * - Falling blocks you must stop and stack as high as possible!
 * - Score by precision: better alignment, more points.
 * - Game over if blocks miss too far/offscreen.
 * - Controls: SPACE/click/tap to drop, R to restart.
 * - Dark/light mode and fun arcade visuals.
 */
const BLOCK_COLORS = [
  "#4CC9F0", // Neon Blue
  "#F72585", // Pink
  "#FFB703", // Neon Yellow
  "#3A0CA3", // Neon Purple
  "#32fb74", // Green
];

// Core game settings
const CANVAS_W = 340;
const CANVAS_H = 480;
const INITIAL_BLOCK_W = 108;
const BLOCK_H = 24;
const BASE_SPEED = 1.52; // pixels/frame
const SPEED_INC = 0.07;  // per block

function getDarkMode() {
  if (typeof document !== "undefined") {
    return document.body.classList.contains("dark");
  }
  return true;
}

function getShadow(color) {
  // Multi-level neon drop shadow for thick pixel-glow
  return [
    `0 0 2.5px ${color}66`,
    `0 0 7px ${color}cc`,
    `0 0 18px ${color}99`,
    `0 0 30px ${color}44`
  ].join(",");
}

// Calculate overlap and cut
function computeBlockPlacement(newBlock, prevBlock) {
  const nx = newBlock.x, nw = newBlock.w;
  const px = prevBlock.x, pw = prevBlock.w;
  const overlapStart = Math.max(nx, px);
  const overlapEnd = Math.min(nx + nw, px + pw);
  const overlap = Math.max(0, overlapEnd - overlapStart);

  // How much is perfectly aligned
  const perfectAlign = (Math.abs(nx - px) < 0.5);

  // Remaining portion
  return {
    overlap,
    offset: nx - px,
    perfectAlign
  };
}

// Get local high score
function getHighScoreLS() {
  return Number.parseInt(localStorage.getItem("block_builder_high") || "0", 10);
}
function setHighScoreLS(score) {
  localStorage.setItem("block_builder_high", score + "");
}

function formatScore(s) {
  return s.toLocaleString();
}

// PUBLIC_INTERFACE
function BlockBuilder() {
  // Blocks: [{x, y, w, color}]
  const [blocks, setBlocks] = useState([]);
  const [falling, setFalling] = useState(null);
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(getHighScoreLS());
  const [status, setStatus] = useState("init"); // init, running, over
  const [darkMode, setDarkMode] = useState(getDarkMode());

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const animCount = useRef(0);

  // Listen for dark/light mode body toggle
  useEffect(() => {
    const handler = () => setDarkMode(getDarkMode());
    window.addEventListener("storage", handler);
    const obs = new MutationObserver(handler);
    obs.observe(document.body, { attributes: true, attributeFilter: [ "class" ] });
    return () => {
      window.removeEventListener("storage", handler);
      obs.disconnect();
    };
  }, []);

  // Reset game to initial state
  const resetGame = useCallback(() => {
    const firstBlock = {
      x: (CANVAS_W - INITIAL_BLOCK_W) / 2,
      y: CANVAS_H - BLOCK_H,
      w: INITIAL_BLOCK_W,
      color: BLOCK_COLORS[0],
    };
    setBlocks([firstBlock]);
    setFalling({
      x: 0,
      y: 40,
      w: INITIAL_BLOCK_W,
      color: BLOCK_COLORS[1],
      dir: 1, // 1 = right, -1 = left
      speed: BASE_SPEED,
      index: 1,
    });
    setScore(0);
    setStatus("running");
    animCount.current = 0;
  }, []);

  // On first mount
  useEffect(() => {
    resetGame();
    // Clean up animation frame
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line
  }, []);

  // Animate loop
  useEffect(() => {
    if (status !== "running" || !falling) return;
    // Falling block logic: moves horizontally, drop on user input
    function animate() {
      rafRef.current = requestAnimationFrame(animate);
      animCount.current++;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      // Clear
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // BG
      ctx.fillStyle = darkMode
        ? "#18102A"
        : "#ffffff";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Draw stacked blocks
      for (let i = 0; i < blocks.length; ++i) {
        const b = blocks[i];
        drawBlock(ctx, b, i === blocks.length - 1 ? 1 : 0.87, darkMode, false);
      }

      // Draw the falling block
      drawBlock(ctx, falling, 1, darkMode, true);

      // Draw score & guides
      drawScoreOverlay(ctx, score, high, status, darkMode);

      // Animate horizontal motion (not for drop, just for hover)
      if (!falling.drop) {
        let x = falling.x + falling.dir * falling.speed;
        // Reverse direction at bounds
        if (x <= 0) {
          x = 0;
          falling.dir = 1;
        } else if (x + falling.w >= CANVAS_W) {
          x = CANVAS_W - falling.w;
          falling.dir = -1;
        }
        setFalling((old) => ({...old, x, dir: falling.dir}));
      } else {
        // Animate downwards after user triggers drop
        setFalling((old) => {
          if (!old) return null;
          let newY = old.y + 6.2; // Drop speed
          if (
            blocks.length > 0 &&
            newY + BLOCK_H >= blocks[blocks.length - 1].y - 1
          ) {
            newY = blocks[blocks.length - 1].y - BLOCK_H;
            // Finalize drop!
            setTimeout(() => { placeBlock(); }, 30);
          }
          return {...old, y: newY};
        });
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line
  }, [status, falling, blocks, darkMode]);

  // Handle block placement on drop
  const placeBlock = useCallback(() => {
    if (!falling) return;
    const prevBlock = blocks[blocks.length - 1];
    const { overlap, offset, perfectAlign } = computeBlockPlacement(falling, prevBlock);

    if (overlap < 7.5 || falling.x + falling.w < 0 || falling.x > CANVAS_W) {
      // Game over (missed/offscreen)
      setStatus("over");
      if (score > high) {
        setHigh(score);
        setHighScoreLS(score);
      }
      return;
    }
    // Score: perfect alignment = big bonus, else scaled by overlap/width
    let inc = 10 + Math.floor(overlap / falling.w * 100);
    if (perfectAlign) inc += 100;
    setScore(s => s + inc);

    // New block (chopped to overlap area)
    let nextW = overlap;
    let nextX = Math.max(falling.x, prevBlock.x);
    // random color, but not same as last
    let newColor = BLOCK_COLORS[(blocks.length + 1) % BLOCK_COLORS.length];
    const next = {
      x: nextX,
      y: prevBlock.y - BLOCK_H,
      w: nextW,
      color: newColor,
    };

    // If stack reaches the ceiling, win! Or, keep going...
    if (next.y < 21) {
      setStatus("over");
      if (score > high) {
        setHigh(score);
        setHighScoreLS(score);
      }
      return;
    }
    setBlocks((b) => [...b, next]);
    // Spawn next falling block, faster/smaller
    setFalling({
      x: 0,
      y: 40,
      w: nextW,
      color: BLOCK_COLORS[(blocks.length + 2) % BLOCK_COLORS.length],
      dir: 1,
      speed: BASE_SPEED + SPEED_INC * blocks.length,
      index: blocks.length + 1,
      drop: false,
    });
  }, [falling, blocks, high, score]);

  // Handle user action: SPACE/click/touch => drop
  const handleDrop = useCallback(() => {
    if (status !== "running" || !falling || falling.drop) return;
    setFalling((old) => ({
      ...old,
      drop: true,
    }));
  }, [status, falling]);

  // Keyboard/mouse/tap
  useEffect(() => {
    function handler(e) {
      // Prevent scrolling for SPACE/UP (keep arcade focus)
      if (
        status === "running" &&
        ["Space", "ArrowDown", "Enter"].includes(e.code)
      ) {
        e.preventDefault();
      }
      // Drop block with SPACE/ENTER/ArrowDown
      if (
        status === "running" &&
        (e.code === "Space" || e.code === "Enter" || e.code === "ArrowDown")
      ) {
        handleDrop();
      }
      // Restart with R
      if (status === "over" && (e.key?.toLowerCase?.() || "") === "r") {
        resetGame();
      }
    }
    window.addEventListener("keydown", handler, { passive: false });
    return () => window.removeEventListener("keydown", handler);
  }, [status, handleDrop, resetGame]);

  // Click/tap container triggers drop, also focus for keyboard
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e) => {
      // Only allow click if game running & not while falling
      if (status === "running" && falling && !falling.drop) {
        handleDrop();
        el.focus();
      }
    };
    el.addEventListener("click", handler);
    el.addEventListener("touchstart", handler, { passive: false });
    // Accessibility: focus canvas for keyboard input automatically
    el.tabIndex = 0;
    el.focus();
    return () => {
      el.removeEventListener("click", handler);
      el.removeEventListener("touchstart", handler);
    };
  }, [status, falling, handleDrop]);

  // Dark mode updates
  useEffect(() => {
    setDarkMode(getDarkMode());
  }, []);

  // Game over: confetti/fun
  useEffect(() => {
    if (status === "over" && score > high) {
      // New high score!
      // Maybe flash or simple effect
    }
  }, [status, score, high]);

  // Helper functions for drawing (canvas, pixelated)
  function drawBlock(ctx, block, alpha, dark, isFalling) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.fillStyle = block.color;
    ctx.shadowColor = block.color;
    ctx.shadowBlur = isFalling ? 13 : 8;
    ctx.strokeStyle = dark ? "#222" : "#ddd";
    ctx.lineWidth = isFalling ? 3 : 2.5;
    ctx.rect(block.x, block.y, block.w, BLOCK_H);
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
    // 4px pixel border highlight
    ctx.beginPath();
    ctx.strokeStyle = "#fff8";
    ctx.lineWidth = 0.8;
    ctx.rect(block.x + 2.4, block.y + 2.8, block.w - 5, BLOCK_H - 5);
    ctx.stroke();
    ctx.restore();
  }

  function drawScoreOverlay(ctx, score, high, status, dark) {
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.font = "bold 15px 'Press Start 2P',VT323,monospace";
    ctx.textAlign = "left";
    ctx.fillStyle = dark ? "#fffbe6" : "#222";
    ctx.fillText(`SCORE: ${formatScore(score)}`, 18, 32);
    ctx.textAlign = "right";
    ctx.fillStyle = dark ? "#ffc740" : "#3A0CA3";
    ctx.font = "bold 14px 'Press Start 2P',VT323,monospace";
    ctx.fillText(`HIGH: ${formatScore(high)}`, CANVAS_W - 14, 32);

    if (status === "over") {
      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "bold 24px 'Press Start 2P', VT323, monospace";
      ctx.strokeStyle = dark ? "#F72585" : "#3A0CA3";
      ctx.lineWidth = 4.3;
      ctx.strokeText("GAME OVER", CANVAS_W / 2, CANVAS_H / 2 - 6);
      ctx.fillStyle = "#fffbe6";
      ctx.shadowColor = "#F72585";
      ctx.shadowBlur = 19;
      ctx.fillText("GAME OVER", CANVAS_W / 2, CANVAS_H / 2 - 6);

      ctx.font = "bold 15px 'Press Start 2P', VT323, monospace";
      ctx.fillStyle = "#FFD803";
      ctx.shadowColor = "#FFD803";
      ctx.shadowBlur = 11;
      ctx.fillText(
        "Press R to Restart",
        CANVAS_W / 2,
        CANVAS_H / 2 + 38
      );
      ctx.fillStyle = dark ? "#4CC9F0" : "#3A0CA3";
      ctx.shadowBlur = 0;
      ctx.fillText(
        score >= high ? "NEW HIGH SCORE!" : "",
        CANVAS_W / 2,
        CANVAS_H / 2 + 62
      );
      ctx.restore();
    }
    ctx.restore();
  }

  // Pixel arcade border (CSS)
  const arcadeBorder = darkMode
    ? `0 0 14px 0 #4cc9f0d0, 0 0 35px 7px #3A0CA366`
    : `0 0 11px 0 #90baffb0, 0 0 24px 4px #4CC9F066`;

  // Main render
  return (
    <div
      ref={containerRef}
      tabIndex={0}
      aria-label="Block Builder Game Area"
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(127deg, #101731 68%, #25154b 140%)"
          : "linear-gradient(97deg, #fefcff 0%, #b8e5f4 130%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        fontFamily: "'Press Start 2P', VT323, monospace",
        userSelect: "none",
        outline: "none",
        paddingTop: 29,
        transition: "background 0.37s",
      }}
      onKeyDown={() => {}} // focusable for accessibility
      data-theme={darkMode ? "dark" : "light"}
      className="bb-arcade-container"
    >
      {/* Game title and instructions */}
      <div
        className="bb-title"
        style={{
          fontFamily: "'Press Start 2P', VT323, monospace",
          fontSize: "1.35rem",
          textAlign: "center",
          margin: "18px 0 7px 0",
          color: darkMode ? "#4CC9F0" : "#3A0CA3",
          textShadow: getShadow(darkMode ? "#4CC9F0" : "#3A0CA3"),
          letterSpacing: ".03em",
          fontWeight: 900,
        }}
      >
        <span role="img" aria-label="block icon">🧱</span> Block Builder
      </div>
      <div
        className="bb-instructions"
        style={{
          fontSize: "0.93em",
          color: darkMode ? "#FFB703" : "#3A0CA3",
          textAlign: "center",
          maxWidth: 350,
          margin: "0 0 14px 0",
          textShadow: getShadow(darkMode ? "#FFB703" : "#3A0CA3"),
          background: darkMode
            ? "#22263b55"
            : "#f7faffaa",
          borderRadius: 10,
          fontWeight: 700,
          padding: "5px 14px",
        }}
      >
        Stack the blocks! <b>Press <kbd>SPACE</kbd></b>, <b>click</b>, or <b>tap</b> to drop the block. 
        Align perfectly for bonus. Avoid dropping off the edge. <span style={{
          whiteSpace: "nowrap"
        }}><b>R</b> to Restart.</span>
      </div>
      {/* Game area */}
      <div
        className="bb-canvas-wrapper"
        style={{
          borderRadius: 20,
          background: darkMode
            ? "linear-gradient(120deg, #1D1937 80%, #4CC9F055 170%)"
            : "linear-gradient(123deg, #fcfcfc 0%, #90cdf477 100%)",
          boxShadow: arcadeBorder,
          border: `3.6px solid ${darkMode ? "#4CC9F0" : "#3A0CA3"}`,
          padding: 8,
          marginBottom: 19,
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{
            display: "block",
            width: CANVAS_W,
            height: CANVAS_H,
            imageRendering: "pixelated",
            background: "transparent",
            borderRadius: 13,
            outline: "none",
            boxShadow: darkMode
              ? "0 0 15px #3A0CA3aa,0 0 3px #4cc9f0"
              : "0 0 7px #90e9ff88,0 0 1px #3a0ca377",
          }}
          tabIndex={-1}
        />
      </div>
      {/* Score legend, mobile touch restart, high score */}
      <div
        className="bb-score-panel"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          fontFamily: "'Press Start 2P', VT323, monospace",
          fontWeight: 700,
          fontSize: "1em",
          color: darkMode ? "#4CC9F0" : "#3A0CA3",
          textShadow: getShadow(darkMode ? "#4CC9F0" : "#3A0CA3"),
          marginBottom: status === "over" ? 23 : 2,
        }}
      >
        <span>
          <span style={{ color: "#FFB703", textShadow: getShadow("#FFB703") }}>
            Score
          </span>: {formatScore(score)}
        </span>
        <span>
          <span style={{ color: "#3A0CA3", textShadow: getShadow("#3A0CA3") }}>
            High
          </span>: {formatScore(high)}
        </span>
      </div>
      {status === "over" && (
        <div
          className="bb-gameover-panel"
          style={{
            marginTop: 8,
            color: "#F72585",
            fontFamily: "'Press Start 2P', VT323, monospace",
            fontWeight: 900,
            fontSize: ".97em",
            letterSpacing: ".02em",
            textShadow: getShadow("#F72585"),
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Game Over!
          <br />
          {score >= high ? (
            <span>
              🏅 <span style={{ color: "#FFD803" }}>New High Score!</span> 🏅
            </span>
          ) : (
            <span>Press <kbd>R</kbd> or tap below to try again</span>
          )}
          <button
            style={{
              display: "inline-block",
              marginTop: 10,
              fontFamily: "'Press Start 2P', VT323, monospace",
              background: darkMode
                ? "linear-gradient(90deg,#F72585 80%,#FFB703)"
                : "linear-gradient(90deg,#3A0CA3 60%,#4CC9F0)",
              border: "none",
              color: "#fff",
              borderRadius: 8,
              fontWeight: 900,
              fontSize: "1.04em",
              textShadow: getShadow("#FFD803"),
              boxShadow: "0 0 7px #ffd80388",
              padding: "0.45em 1.3em",
              outline: "none",
              cursor: "pointer",
            }}
            onClick={resetGame}
            tabIndex={0}
            aria-label="Restart Block Builder"
          >
            Restart
          </button>
        </div>
      )}
      {/* Legend for dark/light mode */}
      <div style={{
        marginTop: 27,
        color: darkMode ? "#aaa" : "#536080",
        fontSize: ".87em",
        fontFamily: "'VT323', 'Orbitron', monospace",
        textAlign: "center",
        opacity: .74,
      }}>
        Theme: {darkMode ? "Dark" : "Light"}
      </div>
      {/* Fun bottom neon lines */}
      <div style={{
        marginTop: 30,
        width: 120,
        height: 7,
        background: `linear-gradient(90deg, #F72585, #4CC9F0, #FFB703 130%)`,
        filter: "blur(1.3px)",
        borderRadius: 11,
        opacity: 0.8
      }} />
    </div>
  );
}

export default BlockBuilder;
