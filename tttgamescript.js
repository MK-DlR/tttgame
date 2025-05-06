/* tttgamescript.js */

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
    // check if the specific cell is empty (value = 0)
    if (board[row][column].getValue() !== 0) {
      // cell is already taken
      console.log("This cell is already taken. Try another one.");
      return false;
    }

    // cell is available, add the player's marker
    board[row][column].addMarker(player);
    return true;
  };

  // print board to console
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { board, getBoard, dropMarker, printBoard }; // interface for application to interact with the board
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
  const board = Gameboard;

  let gameOver = false;

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

  const playRound = (row, column) => {
    // exit early if game is finished
    if (gameOver) {
      console.log("The game is over. Start a new game to play again.");
      return;
    }
    // store result of dropMarker
    const moveSuccessful = board.dropMarker(
      row,
      column,
      getActivePlayer().marker
    );
    console.log(
      `Dropping ${
        getActivePlayer().name
      }'s marker into cell row ${row}, column ${column}...`
    );

    // check for win conditions
    function checkWin(board) {
      if (!moveSuccessful) return;

      // check rows
      for (let i = 0; i < board.length; i++) {
        const val = board[i][0].getValue();
        if (
          val !== 0 &&
          val === board[i][1].getValue() &&
          val === board[i][2].getValue()
        ) {
          return val;
        }
      }

      // check columns
      for (let i = 0; i < board[0].length; i++) {
        const val = board[0][i].getValue();
        if (
          val !== 0 &&
          val === board[1][i].getValue() &&
          val === board[2][i].getValue()
        ) {
          return val;
        }
      }

      // check diagonals
      const center = board[1][1].getValue();
      if (
        center !== 0 &&
        ((center === board[0][0].getValue() &&
          center === board[2][2].getValue()) ||
          (center === board[0][2].getValue() &&
            center === board[2][0].getValue()))
      ) {
        return center;
      }

      return null;
    }

    const winner = checkWin(board.getBoard());
    if (winner) {
      console.log(`${players[winner - 1].name} wins!`);
      gameOver = true;
      return;
    }

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

// test game function
function testGame() {
  game.playRound(0, 0);
  game.playRound(1, 0);
  game.playRound(0, 1);
  game.playRound(1, 1);
  game.playRound(0, 2); // Winning move
}
