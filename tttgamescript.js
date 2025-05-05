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
const Gameboard = (function () {
  const rows = 3;
  const columns = 3;
  const board = []; // create gameboard array

  // nested for loop to create 2D array for gameboard
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  console.table(board);
  // get entire gameboard
  const getBoard = () => board;

  // drop player marker
  const dropMarker = (row, column, player) => {
    // check available cells
    const availableCells = board
      .filter((row) => row[column].getValue() === 0)
      .map((row) => row[column]);
    if (!availableCells.length) return; // if no available cells, move is invalid
    board[row][column].addMarker(player); // if cell is valid, drop player marker
  };

  // print board to console
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { board, dropMarker, printBoard }; // interface for application to interact with the board
})();

/*
squares on the board
0: empty
1: player 1's marker
2: player 2's marker
*/
function Cell() {
  let value = 0;
  // accept player marker to change value
  const addMarker = (player) => {
    value = player;
  };

  // retrieve current value of cell
  const getValue = () => value;

  return {
    addMarker,
    getValue,
  };
}

// control the game turns and win conditions
function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      marker: 1,
    },
    {
      name: playerTwoName,
      marker: 2,
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column, player) => {
    console.log(
      `Dropping ${getActivePlayer().name}'s marker into cell ${Cell}...`
    );
    board.dropMarker(row, column, player, getActivePlayer().marker);

    // check for win conditions
    function checkWin(board) {
      // check rows
      for (let i = 0; i < board.length; i++) {
        if (
          board[i][0].getValue() === board[i][1].getValue() &&
          board[i][1].getValue() === board[i][2].getValue()
        ) {
          return board[i][0];
        }
      }
      // check columns
      for (let i = 0; i < board[0].length; i++) {
        if (
          board[0][i].getValue() === board[1][i].getValue() &&
          board[1][i].getValue() === board[2][i].getValue()
        ) {
          return board[0][i];
        }
      }
      // check diagonals
      if (
        board[0][0].getValue() === board[1][1].getValue() &&
        board[1][1].getValue() === board[2][2].getValue()
      ) {
        return board[0][0];
      }
      if (
        board[0][2].getValue() === board[1][1].getValue() &&
        board[1][1].getValue() === board[2][0].getValue()
      ) {
        return board[0][2];
      }
      return null;
    }

    console.log(checkWin(board)); // doesn't seem to be working

    // switch player turn
    switchPlayerTurn();
    printNewRound();
  };
  // initial play game message
  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
}

const game = GameController();

/*
// factory to create players
function player(name, marker) {
  const playerName = name;
  const playerMarker = marker;
  let playerScore = 0; // testing
  const giveScore = () => playerScore++; // increment user score; testing

  return { playerName, playerMarker, giveScore };
}

// creating test player
const adrien = player("adrien", "X");
adrien.giveScore();

// logging test player info
console.table({
  playerName: adrien.playerName,
  playerMarker: adrien.playerMarker,
  playerScore: adrien.giveScore(),
});
*/
