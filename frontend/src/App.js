import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import Tile from "./Tile";

// Connect to backend game server
const socket = io("http://localhost:4000");

function App() {
  const [state, setState] = useState(null);    
  const [myId, setMyId] = useState(null);        
  const [buyModal, setBuyModal] = useState(false); 
  const [landedTile, setLandedTile] = useState(null); 

  // Socket Setup
  useEffect(() => {
    socket.on("connect", () => setMyId(socket.id));
    socket.on("gameState", (gameState) => setState(gameState));
    socket.on("landedOnProperty", (tile) => {
      setLandedTile(tile);
      setBuyModal(true);
    });

    return () => {
      socket.off("connect");
      socket.off("gameState");
      socket.off("landedOnProperty");
    };
  }, []);

  // Game Actions
  const rollDice = () => socket.emit("rollDice");            
  const buyProperty = () => {                            
    socket.emit("buyProperty", landedTile);
    setBuyModal(false);
  };
  const skipProperty = () => {                  
    socket.emit("skipProperty");
    setBuyModal(false);
  };

  if (!state) return <div className="loading"> Loading Game </div>;

  return (
    <div className="board-container">
      <div className="board">
        {/* Board Tiles */}
        {state.tiles.map((tile, index) => {
          const players = Object.values(state.players).filter(
            (p) => p.pos % state.tiles.length === index
          );
          const owners = tile.owner ? state.players[tile.owner]?.name : null;

          return (
            <Tile
              key={index}
              tile={tile}
              index={index}
              playersHere={players}
              ownerName={owners}
            />
          );
        })}

        {/* Center Board */}
        <div className="center-board">
          <h1 className="game-title">Dice Roller Game</h1>

          {/* Roll Dice */}
          {state.currentTurn === myId && !buyModal && (
            <button onClick={rollDice} className="roll-button">
              🎲 Roll Dice
            </button>
          )}

          {/* Player Stat */}
          <div className="stats-container">
            {Object.values(state.players).map((p) => (
              <div
                key={p.id}
                className={`player-box ${state.currentTurn === p.id ? "active-turn" : ""}`}
              >
                <h2>{p.name}</h2>
                <p> Balance: ${p.money}</p>
              </div>
            ))}
          </div>

          {/* Buy Property */}
          {buyModal && landedTile && (
            <div className="modal-inside-board">
              <div className="modal">
                <h2>{landedTile.name}</h2>
                <p>Price: ${landedTile.price}</p>
                <p>Rent: ${landedTile.rent}</p>
                <div className="modal-buttons">
                  <button onClick={buyProperty}>Buy</button>
                  <button onClick={skipProperty}>Skip</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;