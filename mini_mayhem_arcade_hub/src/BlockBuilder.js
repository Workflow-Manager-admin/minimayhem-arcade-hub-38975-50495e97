import React from "react";

/**
 * PUBLIC_INTERFACE
 * BlockBuilder - Placeholder for the Block Builder game.
 */
function BlockBuilder() {
  return (
    <div
      style={{
        minHeight: "50vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Press Start 2P', VT323, monospace",
        color: "#4CC9F0",
        background: "transparent",
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: "2.3em", marginBottom: 20 }}>🧱</div>
      <h1 style={{ fontWeight: 900, letterSpacing: 2 }}>
        Block Builder (Coming Soon)
      </h1>
      <p style={{ maxWidth: 500 }}>
        The Block Builder game will appear here! Stay tuned for falling blocks, stacking action, and arcade fun.
      </p>
    </div>
  );
}

export default BlockBuilder;
