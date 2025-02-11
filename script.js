const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [2, 4, 6], [0, 4, 8]
];

function handleMove(event) {
  const index = event.target.getAttribute("data-index");

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  event.target.classList.add(currentPlayer.toLowerCase());

  if (checkWinner()) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  switchPlayer();

  setTimeout(() => {
    if (currentPlayer === "O" && gameActive) {
      mediumAI();
    }
  }, 500);
}

function checkWinner() {
  return winningConditions.some(condition => {
    const [a, b, c] = condition;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function resetGame() {
  board.fill("");
  gameActive = true;
  currentPlayer = "X";
  statusText.textContent = "Player X's turn";
  cells.forEach(cell => cell.classList.remove("x", "o"));
}

function mediumAI() {
  if (!gameActive) return;

  let availableCells = board.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);

  let bestMove = findWinningMove("O") || findWinningMove("X");

  if (bestMove === null) {
    bestMove = availableCells[Math.floor(Math.random() * availableCells.length)];
  }

  if (bestMove !== null) {
    board[bestMove] = "O";
    cells[bestMove].classList.add("o");
  }

  if (checkWinner()) {
    statusText.textContent = "AI Wins!";
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  switchPlayer();
}

function findWinningMove(player) {
  for (let condition of winningConditions) {
    let [a, b, c] = condition;
    let values = [board[a], board[b], board[c]];

    if (values.filter(v => v === player).length === 2 && values.includes("")) {
      return condition[values.indexOf("")];
    }
  }
  return null;
}

cells.forEach(cell => cell.addEventListener("click", handleMove));
resetButton.addEventListener("click", resetGame);
