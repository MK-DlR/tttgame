/* tttgamescript.js */

/*
note: 
have as little global code as possible
put as much as possible within factories
if only a single instance is needed (gameboard, displayController, etc)
wrap the factory inside an IIFE
all functionality should fit in the various objects (game, player, gameboard)
*/

// factory within IIFE to create gameboard
const createGame = (function () {
  const gameBoard = {}; // create gameboard array
  console.log("gameBoard goes here"); // testing
  return gameBoard;
})();

// factory to create players
function createPlayer(name, marker) {
  const playerName = name;
  const playerMarker = marker;
  let playerScore = 0; // testing
  const giveScore = () => playerScore++; // increment user score; testing

  return { playerName, playerMarker, giveScore };
}

// creating test player
const adrien = createPlayer("adrien", "X");
adrien.giveScore();

// logging test player info
console.table({
  playerName: adrien.playerName,
  playerMarker: adrien.playerMarker,
  playerScore: adrien.giveScore(),
});

// 1c. controlling the flow of the game itself also requires an object
