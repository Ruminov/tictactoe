const gameBoard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];

  const markCell = (symbol, index) => (board[index] = symbol);

  const resetBoard = () => {
    for (let i = 0; i < 9; i++) {
      board[i] = "";
    }
  };

  const getCell = (index) => board[index];
  const getBoard = () => board;

  return { markCell, resetBoard, getCell, getBoard };
})();

const player = (name, symbol) => {
  let score = 0;
  const addScore = () => score++;
  const getScore = () => score;
  const resetScore = () => (score = 0);
  return { name, symbol, addScore, getScore, resetScore };
};

const checkTurn = (player) => {
  const winConditions = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const boardCombination = [];
  gameBoard.getBoard().forEach((item, index) => {
    if (item === player.symbol) {
      boardCombination.push(index);
    }
  });

  return winConditions.some((subArray) =>
    subArray.every((item) => boardCombination.includes(item))
  );
};

const gameExecution = (function () {
  let rounds = 1;
  let roundCompleted = false;
  // Create players
  const player1 = player("Player1", "X");
  const player2 = player("Player2", "O");
  const showScore1 = document.querySelector("div.player-1");
  const showScore2 = document.querySelector("div.player-2");
  const message = document.querySelector(".message");
  const showRound = document.querySelector("div.round");
  let currentPlayer = player1;

  const playTurn = (e) => {
    // Update gameBoard
    const index = e.target.dataset.index;
    gameBoard.markCell(currentPlayer.symbol, index);

    // Check if the round ended
    // End round if the player won
    if (checkTurn(currentPlayer)) {
      currentPlayer.addScore();
      if (currentPlayer.getScore() === 3) {
        endGame(currentPlayer);
        return;
      }

      // Show win message
      showMessage(`${currentPlayer.name} wins the round!`);
      endRound();
      return;
    }

    // End round when a draw is reached
    if (!gameBoard.getBoard().includes("")) {
      showMessage("It's a draw");
      endRound();
      return;
    }

    // Update cell-container
    displayBoard(e);

    // Change player
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    showMessage(`It's the turn of ${currentPlayer.name}`);
  };

  const displayBoard = function () {
    for (let i = 0; i < 9; i++) {
      cellContainer.children[i].textContent = gameBoard.getCell(i);
      cellContainer.children[i].dataset.symbol = gameBoard.getCell(i);
    }
    showRound.textContent = `Round: ${rounds}`;
    showScore1.textContent = `Player1: ${player1.getScore()}`;
    showScore2.textContent = `Player2: ${player2.getScore()}`;
  };

  const showMessage = function (text) {
    message.textContent = text;
  };

  const endRound = function () {
    // Update the round
    roundCompleted = true;
    displayBoard();
    rounds++;
    // Show restart button
    restartButton.style.display = "revert";
  };

  const endGame = (player) => {
    showMessage(`${player.name} wins the game`);
    displayBoard();

    // Reset round count
    rounds = 1;

    // Reset score
    player1.resetScore();
    player2.resetScore();

    // Show restart button
    restartButton.style.display = "revert";
  };

  const getRoundStatus = () => roundCompleted;

  const restartRound = function (e) {
    roundCompleted = false;

    // Hide restart button
    restartButton.style.display = "none";

    // Clean board
    gameBoard.resetBoard();
    displayBoard();

    currentPlayer = player1;

    showMessage("The first player to win 3 rounds wins");
  };

  return { playTurn, restartRound, getRoundStatus };
})();

const cellContainer = document.querySelector("div.cell-container");

cellContainer.addEventListener("click", (e) => {
  if (
    e.target.matches("div.cell") &&
    !e.target.textContent &&
    !gameExecution.getRoundStatus()
  ) {
    gameExecution.playTurn(e);
  }
});

const restartButton = document.querySelector("button.restart-round");
restartButton.addEventListener("click", gameExecution.restartRound);
