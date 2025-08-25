import React from "react";
import "./App.css";

// Tile Position
function getTile(i, s) {
  if (i < s) 
    return { gridRow: 1, gridColumn: i + 1 };
  if (i < s + (s - 2)) 
    return { gridRow: i - s + 2, gridColumn: s }; 
  if (i < s * 2 + (s - 2)) 
    return { gridRow: s, gridColumn: s - (i - (s + (s - 2))) }; 
  return { gridRow: s - (i - (s * 2 + (s - 2))), gridColumn: 1 };
}

export default function Tile({ tile, index, playersHere: players, ownerName }) {
  return (
    <div
      className={`tile edge ${tile.owner ? "owned" : ""}`}
      style={getTile(index, 9)}
    >
      <span className="tile-name">{tile.name}</span>
      {tile.price > 0 && <span className="tile-price">${tile.price}</span>}
      {tile.rent > 0 && <span className="tile-rent">Rent: ${tile.rent}</span>}

      {/* Players Token */}
      {players.map((p) => (
        <span key={p.id} className="player-token">
          ⛵️ {p.name}
        </span>
      ))}

      {/* Owner Label */}
      {tile.owner && <span className="owner-tag">{ownerName}</span>}
    </div>
  );
}
