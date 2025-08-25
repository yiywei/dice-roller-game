# Dice Roller Game

The purpose of this repository is to build a web-based board game where players can roll dice to purchase properties, collect rent, and build their own city. The game will feature interactive elements, multiplayer functionality, and opportunities for players to compete as they expand their cities.

## Purpose
The goal is to create a real-time board game where users can:  
- Roll dice to move around the board  
- Buy properties and earn income  
- Collect rent from your opponents  
- Compete to become the wealthiest player  

## Tech Stack
### Backend (Node.js + Express + Socket.IO)
- Stores game state: players, properties, and earnings
- Enable users to roll dice and move around board
- Allows players to purchase property, and collect rent 
- Syncs updates in real-time to all connected players  

### Frontend (React + socket.io-client)
- Renders the board, players, dice, and cards  
- Handles user actions: roll dice, buy property, pay rent
- Uses React Context API for local state  
- Communicates with backend via socket.io-client

## Setup

### Run Application
```bash
- npm start to run the entire project
- npm install to install node module packages
- npm run client to run the react application
- npm run server to run the nodejs application
```