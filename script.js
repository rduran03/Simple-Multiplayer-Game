document.addEventListener('DOMContentLoaded', () => {
    //Dimensions for the board
    const ROWS = 6;
    const COLS = 7;
    let currentPlayer = 'red';
    let gameOver = false;
    let againstCPU = false;
    //Array for the board
    const board = [];
    for (let row = 0; row < ROWS; row++) {
        board[row] = Array(COLS).fill(null);
    }

    const gameBoard = document.getElementById('game-board');
    const resetButton = document.getElementById('reset-button');
    const cpuButton = document.getElementById('cpu-button');
    //Creates the board game
    function createBoard() {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => dropDisc(col));
                gameBoard.appendChild(cell);
            }
        }
    }
    //Allows for the placement of the discs on click
    function dropDisc(col) {
        if (gameOver) return;
        for (let row = ROWS - 1; row >= 0; row--) {
            if (!board[row][col]) {
                board[row][col] = currentPlayer;
                const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                const disc = document.createElement('div');
                disc.classList.add('disc', currentPlayer);
                cell.appendChild(disc);
                animateDrop(disc);
                if (checkWin(row, col)) {
                    gameOver = true;
                    alert(`${currentPlayer.toUpperCase()} wins!`);
                    return;
                }
                if (!checkTie()){
                    switchPlayer();
                    if (againstCPU && currentPlayer === 'yellow'){
                        setTimeout(() => makeCPUMove(), 1000);
                    }
                }
                else{
                    alert('It\'s a tie!');
                    gameOver = true;
                    return;
                }
                return;
            }
        }
    }

    function animateDrop(disc) {
        disc.style.animation = 'dropAnimation 0.5s ease-out';
        disc.addEventListener('animationend', () => {
            disc.style.animation = '';
        });
    }
    //Checks for win in various ways such as horizontally, vertically, and diagonally.
    function checkWin(row, col) {
        //horizontally
        for (let c = 0; c <= COLS - 4; c++) {
            if (
                board[row][c] === currentPlayer &&
                board[row][c + 1] === currentPlayer &&
                board[row][c + 2] === currentPlayer &&
                board[row][c + 3] === currentPlayer
            ) {
                return true;
            }
        }
        //vertically
        for (let r = 0; r <= ROWS - 4; r++) {
            if (
                board[r][col] === currentPlayer &&
                board[r + 1][col] === currentPlayer &&
                board[r + 2][col] === currentPlayer &&
                board[r + 3][col] === currentPlayer
            ) {
                return true;
            }
        }
        //diagonally 
        for (let r = 0; r <= ROWS - 4; r++) {
            for (let c = 0; c <= COLS - 4; c++) {
                if (
                    board[r][c] === currentPlayer &&
                    board[r + 1][c + 1] === currentPlayer &&
                    board[r + 2][c + 2] === currentPlayer &&
                    board[r + 3][c + 3] === currentPlayer
                ) {
                    return true;
                }
            }
        }
        for (let r = 0; r <= ROWS - 4; r++) {
            for (let c = 3; c < COLS; c++) {
                if (
                    board[r][c] === currentPlayer &&
                    board[r + 1][c - 1] === currentPlayer &&
                    board[r + 2][c - 2] === currentPlayer &&
                    board[r + 3][c - 3] === currentPlayer
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    function checkTie() {
        return board.every(row => row.every(cell => cell !== null));
    }
    //Allows for the switching of players
    function switchPlayer() {
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
    }

    function makeCPUMove() {
        // Implements CPU, very basic CPU that places disc in random free space.
        const availableCols = [];
        for (let col = 0; col < COLS; col++) {
            if (!board[0][col]) {
                availableCols.push(col);
            }
        }
        const randomCol = availableCols[Math.floor(Math.random() * availableCols.length)];
        dropDisc(randomCol);
    }

    function resetGame() {
        //Clears the board and resets.
        gameBoard.innerHTML = '';
        currentPlayer = 'red';
        gameOver = false;
        for (let row = 0; row < ROWS; row++) {
            board[row] = Array(COLS).fill(null);
        }
        //Recreate the game
        createBoard();
    }

    resetButton.addEventListener('click', resetGame);

    cpuButton.addEventListener('click', () => {
        againstCPU = !againstCPU;
        cpuButton.textContent = againstCPU ? 'Play against Human' : 'Play against CPU';
        resetGame(); //Resets the game when the button is used.
    });

    //Create the board.
    createBoard();
});
