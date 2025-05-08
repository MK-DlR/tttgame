/* tttgamescript.js */

/*
general gameplay code
below here
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

  // get entire gameboard
  const getBoard = () => board;

  // drop player marker
  const dropMarker = (row, column, player) => {
    // check if the specific cell is empty (value = 0)
    if (board[row][column].getValue() !== 0) {
      // if cell is already taken
      const gameAlert = document.querySelector(".alerts");

      // display cell is already taken
      gameAlert.textContent = "This cell is already taken. Try another one.";
      console.log("This cell is already taken. Try another one.");
      return false;
    }

    // cell is available, add player marker
    board[row][column].addMarker(player);
    const gameAlert = document.querySelector(".alerts");
    gameAlert.textContent = "";
    return true;
  };

  // print board to console
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  /*
  squares on the board
  0: empty
  1: player 1's marker - change to X/O/emoji
  2: player 2's marker - change to X/O/emoji
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

  // reset game function
  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  };

  // interface for application to interact with the board
  return { board, getBoard, resetBoard, dropMarker, printBoard, Cell };
})();

// control the game turns and win conditions
function GameController() {
  const board = Gameboard;

  // allow gameplay
  let gameOver = false;

  // Set default player names
  let playerOneName = "Player 1";
  let playerTwoName = "Player 2";

  // player names and markers
  const players = [
    {
      name: playerOneName,
      marker: 1,
      score: 0,
    },
    {
      name: playerTwoName,
      marker: 2,
      score: 0,
    },
  ];

  // get initial player names if provided in the input fields
  function initializePlayerNames() {
    const playerOneInput = document.getElementById("player1");
    const playerTwoInput = document.getElementById("player2");

    if (playerOneInput && playerOneInput.value.trim() !== "") {
      players[0].name = playerOneInput.value.trim();
    }

    if (playerTwoInput && playerTwoInput.value.trim() !== "") {
      players[1].name = playerTwoInput.value.trim();
    }

    // update score display with current names
    updateScoreDisplay();
  }

  // add event listeners to player name forms
  function setupPlayerNameForms() {
    const playerOneForm = document.getElementById("p1");
    const playerTwoForm = document.getElementById("p2");

    if (playerOneForm) {
      playerOneForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const playerOneInput = document.getElementById("player1");
        // trim whitespace from input
        if (playerOneInput && playerOneInput.value.trim() !== "") {
          players[0].name = playerOneInput.value.trim();
          updateScoreDisplay();
          updatePlayerTurn();
        }
      });
    }

    if (playerTwoForm) {
      playerTwoForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const playerTwoInput = document.getElementById("player2");
        // trim whitespace from input
        if (playerTwoInput && playerTwoInput.value.trim() !== "") {
          players[1].name = playerTwoInput.value.trim();
          updateScoreDisplay();
          updatePlayerTurn();
        }
      });
    }
  }

  // update score display with current player names
  function updateScoreDisplay() {
    const trackWins = document.querySelector(".tracker");
    trackWins.innerHTML = `<h3>Player Scores</h3><br>
    <b>${players[0].name}:</b> ${players[0].score} | <b>${players[1].name}:</b> ${players[1].score}`;
  }

  // update player turn display
  function updatePlayerTurn() {
    const playerTurnDiv = document.querySelector(".turn");
    if (playerTurnDiv) {
      playerTurnDiv.textContent = `${getActivePlayer().name}'s turn...`;
    }
  }

  let activePlayer = players[0];

  // switch players between turns
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    // allow for individual cell hover colors
    const boardDiv = document.querySelector(".board");
    boardDiv.classList.remove("player1-turn", "player2-turn");
    boardDiv.classList.add(
      activePlayer === players[0] ? "player1-turn" : "player2-turn"
    );
  };
  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
    updatePlayerTurn();
  };

  // handles each round and marker placing
  const playRound = (row, column) => {
    // exit early if game is finished
    if (gameOver) {
      const finishedGame = document.querySelector(".alerts");

      // display game is over
      finishedGame.textContent =
        "The game is over. Start a new game to play again.";
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
      }'s marker into row ${row}, column ${column}...`
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

    // check for winner
    const winner = checkWin(board.getBoard());
    if (winner) {
      // winner notification
      console.log(`${players[winner - 1].name} wins!`);
      // increment winner's score
      players[winner - 1].score++;
      // alert winner
      alert(`🎉 ${players[winner - 1].name} wins! 🎉`);
      updateScoreDisplay();
      console.table(players);
      // end gameplay after win
      gameOver = true;
      return;
    }

    // check for full board
    const isBoardFull = board
      .getBoard()
      .every((row) => row.every((cell) => cell.getValue() !== 0));

    if (isBoardFull) {
      console.log("Board is full.");
      alert("It's a draw!");
      gameOver = true;
      return;
    }
    // switch player turn
    if (moveSuccessful) {
      switchPlayerTurn();
      printNewRound();
    }
  };

  // reset game
  function resetGameboard() {
    board.resetBoard();
    gameOver = false;
    activePlayer = players[0];
    console.log("Game has been reset");
    const gameAlert = document.querySelector(".alerts");

    // clear content
    gameAlert.textContent = "";

    displayController.updateDisplay();
    updatePlayerTurn();
  }

  // initialize the game
  function init() {
    initializePlayerNames();
    setupPlayerNameForms();

    const newGame = document.querySelector(".button");
    if (newGame) {
      newGame.addEventListener("click", resetGameboard);
    }

    // initial play game message
    printNewRound();
  }

  // call init function when creating the game controller
  init();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    resetGameboard,
  };
}

// object to handle the display/DOM logic
// single instance of displayController factory within IIFE
const displayController = (function () {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  // Helper function to convert marker to emoji
  const markerToEmoji = (value) => {
    if (value === 1) return "✖️";
    if (value === 2) return "⭕";
    return "";
  };

  const updateDisplay = () => {
    // clear the board
    boardDiv.textContent = "";

    // get newest version of board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // display player's turn
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    // render board squares
    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.textContent = markerToEmoji(cell.getValue()); // use helper here
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        boardDiv.appendChild(cellButton);
      });
    });
  };

  // add event listener for the board
  function clickHandlerBoard(e) {
    const target = e.target;
    if (!target.classList.contains("cell")) return;

    const row = parseInt(target.dataset.row);
    const column = parseInt(target.dataset.column);
    game.playRound(row, column);
    updateDisplay();
  }

  boardDiv.addEventListener("click", clickHandlerBoard);

  // initial render
  updateDisplay();

  return {
    updateDisplay, // expose updateDisplay so it can be called after resetting
  };
})();

const game = GameController();

/* 
codes and functions 
below here 
are for testing purposes
*/

// test game function
function testGame() {
  game.playRound(0, 0);
  game.playRound(1, 0);
  game.playRound(0, 1);
  game.playRound(1, 1);
  game.playRound(0, 2); // Winning move
}

// test move function
function testMove() {
  game.playRound(1, 1);
}

// test reset function
function manualReset() {
  game.resetGameboard();
}
