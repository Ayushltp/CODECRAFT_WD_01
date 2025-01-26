const gameBoard = document.getElementById("gameBoard");
const statusDiv = document.getElementById("status");
const resetButton = document.getElementById("resetButton");
const twoPlayerMode = document.getElementById("twoPlayerMode");
const vsComputerMode = document.getElementById("vsComputerMode");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popupContent");

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameActive = false;
let vsComputer = false;

// Create the game board
function createBoard() {
    gameBoard.innerHTML = "";
    board.forEach((_, index) => {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = index;
        cell.addEventListener("click", handleCellClick);
        gameBoard.appendChild(cell);
    });
}

// Handle cell clicks
function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (!gameActive || board[index]) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add("taken");

    if (checkWin()) {
        highlightWinningCells();
        showPopup(`${currentPlayer} Wins!`);
        gameActive = false;
        return;
    }

    if (!board.includes(null)) {
        showPopup("It's a tie!");
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDiv.textContent = vsComputer && currentPlayer === "O" ? "Computer's Turn" : `Player ${currentPlayer}'s Turn`;

    if (vsComputer && currentPlayer === "O") setTimeout(makeBestMove, 600);
}

// Implement Minimax for the Computer
function makeBestMove() {
    const bestMove = minimax(board, true).index;
    const cell = document.querySelector(`.cell[data-index="${bestMove}"]`);
    handleCellClick({ target: cell });
}

// Minimax Algorithm
function minimax(newBoard, isMaximizing) {
    if (checkWin("O")) return { score: 1 };
    if (checkWin("X")) return { score: -1 };
    if (!newBoard.includes(null)) return { score: 0 };

    const moves = [];
    for (let i = 0; i < newBoard.length; i++) {
        if (!newBoard[i]) {
            const move = {};
            move.index = i;
            newBoard[i] = isMaximizing ? "O" : "X";
            move.score = minimax(newBoard, !isMaximizing).score;
            newBoard[i] = null;
            moves.push(move);
        }
    }

    return moves.reduce((best, move) =>
        (isMaximizing && move.score > best.score) || (!isMaximizing && move.score < best.score) ? move : best
    );
}

// Highlight winning cells
function highlightWinningCells() {
    const winningCombination = getWinningCombination();
    if (winningCombination) {
        winningCombination.forEach(index =>
            document.querySelector(`.cell[data-index="${index}"]`).classList.add("winning")
        );
    }
}

// Check for a winning combination
function checkWin(player = currentPlayer) {
    const winningPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6],            // Diagonals
    ];

    return winningPatterns.some(pattern => pattern.every(index => board[index] === player));
}

function getWinningCombination() {
    const winningPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    return winningPatterns.find(pattern => pattern.every(index => board[index] === currentPlayer));
}

function showPopup(message) {
    popupContent.textContent = message;
    popup.style.display = "block";
}

function startGame(vsComp) {
    board.fill(null);
    currentPlayer = "X";
    gameActive = true;
    vsComputer = vsComp;
    createBoard();
    statusDiv.textContent = `Player ${currentPlayer}'s Turn`;
    resetButton.disabled = false;
    popup.style.display = "none";
}

// Event Listeners
twoPlayerMode.addEventListener("click", () => startGame(false));
vsComputerMode.addEventListener("click", () => startGame(true));
resetButton.addEventListener("click", () => startGame(vsComputer));

// Initialize
createBoard();
