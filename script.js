const gameBoard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];

  const markCell = (symbol, index) => (board[index] = symbol);

  const resetBoard = () => {
    for (let i = 0; i < 9; i++) {
      board[i] = 5;
    }
    console.log("no");
  };

  const getCell = (index) => board[index];

  return { markCell, resetBoard, getCell, board };
})();

const player = (name, symbol) => ({ name, symbol });

console.log(gameBoard.board);
