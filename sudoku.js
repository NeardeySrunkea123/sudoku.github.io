var numSelected = null;
var tileSelected = null;
var errors = 0;
var startTime = 0;
var elapsedTime = 0;
var timerInterval;
var gamePaused = false; // Variable to track if the game is paused

var board = [
    "---8-----",
    "4---15-3-",
    "-29-4-518",
    "-4----12-",
    "---6-2---",
    "-32----9-",
    "693-5-87-",
    "-5-48---1",
    "-----3---"
];

var solution = [
    "315827946",
    "468915732",
    "729346518",
    "946538127",
    "571692483",
    "832174695",
    "693251874",
    "257489361",
    "184763259"
];

//load the game
window.onload = function () {
    setGame();
    startTimer();
}


function setGame() {
    // Digits 1-9
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
        
    }
    // board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if(r == 2 || r==5){
                tile.classList.add("horizontal-line");
            }
            if(c==2 || c==5){
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function selectNumber() {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

// Function to check if the puzzle has been successfully completed
function checkWin() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            // If any cell is empty or filled incorrectly, return false
            if (tile.innerText !== solution[r][c]) {
                return false;
            }
        }
    }
    // If all cells are filled correctly, return true
    return true;
}

// Function to handle user selection of a tile
function selectTile() {
    if (numSelected && !gamePaused) { // Check if game is not paused
        if (this.innerText != "") {
            return;
        }

        // Compare the result
        let coords = this.id.split("-"); //["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;
            // Check if the puzzle is completed after the user fills a cell
            if (checkWin()) {
                // Display win message
                alert("Congratulations! You have successfully completed the Sudoku puzzle!");
            }
        } else {
            errors += 1;
            document.getElementById("errors").innerText = errors;
        }
    }
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (!gamePaused) { // Only update the timer if the game is not paused
        let currentTime = Date.now();
        elapsedTime += currentTime - startTime; // Update the elapsed time
        startTime = currentTime; // Update the start time for the next interval

        let totalSeconds = Math.floor(elapsedTime / 1000);
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        document.getElementById("timer").innerText = formatTime(minutes) + ":" + formatTime(seconds);
    }
}

function formatTime(time) {
    return time < 10 ? "0" + time : time;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function pauseGame() {
    if (!gamePaused) {
        gamePaused = true;
        stopTimer(); // Stop the timer when the game is paused
    }
}

function resumeGame() {
    if (gamePaused) {
        gamePaused = false;
        startTime = Date.now(); // Reset the start time to the current time
        startTimer(); // Restart the timer after resuming the game
    }
}
function restartGame() {
    // Reset errors count
    errors = 0;
    document.getElementById("errors").innerText = errors;

    // Reset each tile on the Sudoku board
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tileId = r.toString() + "-" + c.toString();
            let tile = document.getElementById(tileId);
            if (board[r][c] === "-") {
                tile.innerText = ""; // Clear the tile
            } else {
                tile.innerText = board[r][c]; // Restore original value
            }
        }
    }

    // Reset the timer
    stopTimer();
    elapsedTime = 0;
    document.getElementById("timer").innerText = "00:00";

    // Start the timer again
    startTimer();
}
function clearBoard() {
    // Clear the Sudoku board by removing all numbers
    let tiles = document.getElementsByClassName("tile");
    for (let tile of tiles) {
        tile.innerText = "";
    }
}

