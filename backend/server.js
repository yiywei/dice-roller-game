const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Allow frontend connections 
const io = new Server(server, {
  cors: { origin: "*" },
});

// Define board tiles
const tiles = [
  { name: "START", price: 0, rent: 0 },
  { name: "House", price: 100, rent: 50 },
  { name: "Bakery", price: 150, rent: 80 },
  { name: "Shop", price: 200, rent: 100 },
  { name: "Hotel", price: 180, rent: 90 },
  { name: "Bank", price: 250, rent: 120 },
  { name: "Beach", price: 220, rent: 110 },
  { name: "Subway", price: 160, rent: 70 },
  { name: "Cafe", price: 300, rent: 150 },
  { name: "Factory", price: 280, rent: 140 },
  { name: "Plaza", price: 120, rent: 60 },
  { name: "Hall", price: 350, rent: 175 },
  { name: "Theater", price: 260, rent: 130 },
  { name: "Skyline", price: 340, rent: 170 },
  { name: "Library", price: 200, rent: 100 },
  { name: "Restaurant", price: 180, rent: 90 },
  { name: "Mall", price: 400, rent: 200 },
  { name: "Park", price: 220, rent: 110 },
  { name: "Station", price: 320, rent: 160 },
  { name: "College", price: 380, rent: 190 },
  { name: "Airport", price: 450, rent: 225 },
  { name: "Museum", price: 240, rent: 120 },
  { name: "Stadium", price: 500, rent: 250 },
  { name: "Harbor", price: 300, rent: 150 },
  { name: "University", price: 350, rent: 175 },
  { name: "Hospital", price: 400, rent: 200 },
  { name: "Cinema", price: 280, rent: 140 },
  { name: "Zoo", price: 320, rent: 160 },
  { name: "Bridge", price: 220, rent: 110 },
  { name: "Tower", price: 600, rent: 300 },
  { name: "Aquarium", price: 260, rent: 130 },
  { name: "Market", price: 180, rent: 90 },
  { name: "Castle", price: 700, rent: 350 },
  { name: "Restaurant", price: 0, rent: 0 },
];


let players = {};        
let playerTurn = [];      
let currentTurn = 0;

// Define next turn
function nextTurn() {
  if (playerTurn.length === 0) return;
  currentTurn = (currentTurn + 1) % playerTurn.length;
}

// Get the game state
function getGameState() {
  return {
    tiles,
    players,
    currentTurn: playerTurn.length > 0 ? playerTurn[currentTurn] : null,
  };
}

io.on("connection", (socket) => {
  console.log("Player joined:", socket.id);

  // Add new player
  players[socket.id] = {
    id: socket.id,
    name: `Player ${Object.keys(players).length + 1}`, 
    pos: 0,                                        
    money: 2000,                                   
  };
  playerTurn.push(socket.id);
  io.emit("gameState", getGameState());

  // Handle dice roll 
  socket.on("rollDice", () => {
    const player = players[socket.id];

    if (!player || socket.id !== playerTurn[currentTurn]) return;
    const roll = Math.ceil(Math.random() * 6);
    player.pos = (player.pos + roll) % tiles.length;
    const landedTile = tiles[player.pos];

    // Handle property logic
    if (landedTile.price > 0) {
      if (!landedTile.owner) {
        // Purchase city property
        io.to(socket.id).emit("landedOnProperty", landedTile);
      } else if (landedTile.owner !== socket.id) {
        player.money -= landedTile.rent;

        // Pay owner rent
        if (players[landedTile.owner]) {
          players[landedTile.owner].money += landedTile.rent;
        } else {
          console.warn("Owner not found", landedTile.name);
        }
      }
    }
    nextTurn();
    io.emit("gameState", getGameState());
  });

  // Handle property purchase
  socket.on("buyProperty", (tile) => {
    const player = players[socket.id];
    const index = tiles.findIndex((t) => t.name === tile.name);

    if (player && tiles[index] && !tiles[index].owner) {
      if (player.money >= tiles[index].price) {
        player.money -= tiles[index].price;
        tiles[index].owner = socket.id;
      }
    }
    io.emit("gameState", getGameState());
  });

  // Handle player disconnection
  socket.on("disconnect", () => {
    console.log("Player left:", socket.id);

    // Reset player ownership
    tiles.forEach((t) => {
      if (t.owner === socket.id) {
        delete t.owner;
      }
    });

    delete players[socket.id];
    playerTurn = playerTurn.filter((id) => id !== socket.id);
    if (currentTurn >= playerTurn.length) currentTurn = 0;

    io.emit("gameState", getGameState());
  });
});

// Start server on port 4000
server.listen(4000, () => console.log("Server running on port 4000"));