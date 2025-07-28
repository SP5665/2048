var board;
var score = 0;
var highscore = localStorage.getItem("highscore") || 0;
var rows = 4;
var columns = 4;

document.getElementById("highscore").innerText = highscore;

window.onload = function() {
    setGame();
}

function setGame() {
    // board = [
    //     [2,4,8,16],
    //     [32,64,128,256],
    //     [512,1024,2048,4096],
    //     [8192,0,0,0]
    // ];
    board =[
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

    for (let r=0; r<rows; r++) {
        for (let c=0; c<columns; c++) {
            //<div id="0-0"><div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}

document.getElementById("playerName").addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        this.blur(); //removes the focus and cursor from input box
    }
});

function playSound(id) {
    const sound = document.getElementById(id);
    sound.currentTime = 0; //rewind to start
    sound.play();
}

let isMuted = false;

const muteBtn = document.getElementById("muteBtn");
muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted? "🔇" : "🔊"; //toggle icon
});

document.getElementById("rules-btn").addEventListener("click", () => {
    if (!isMuted) {
        playSound("clickSound");
    }
    if (document.getElementById("rules-popup").style.display === "block") {
        document.getElementById("rules-popup").style.display = "none";
    } else {
        document.getElementById("rules-popup").style.display = "block";
    }
});

function hasEmptyTile() {
    for (let r=0; r<rows; r++) {
        for (let c=0; c<columns; c++) {
            if (board[r][c]==0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }

    let found = false;
    while (!found) {
        //random
        let r = Math.floor(Math.random()*rows);
        let c = Math.floor(Math.random()*columns);
        if (board[r][c]==0) {
            board[r][c]=2;
            //html portion
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = ""; //clear text
    tile.classList.value = ""; //clear the classList
    tile.classList.add("tile");

    if (num>0) {
        tile.innerText = num;
        if (num<=4096) {
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

function canMerge() {
    for (let r=0; r<rows; r++) {
        for (let c=0; c<columns; c++) {
            let current = board[r][c];
            if (c<columns-1 && board[r][c+1]==current) return true;
            if (r<rows-1 && board[r+1][c]==current) return true;
        }
    }
    return false;
}

function launchConfetti() {
    confetti({              //from Canvas Confetti library from the link
        particleCount: 150,
        spread: 150,
        origin: {y: 0.6} //starting position 0.5 being the center
    });
}

let hasBrokenHighScore = false;
let confettiShown = false;

document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
        if (!isMuted) {
            playSound("moveSound");
        }
        setTwo();
        checkGameOver();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        if (!isMuted) {
            playSound("moveSound");
        }
        setTwo();
        checkGameOver();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        if (!isMuted) {
            playSound("moveSound");
        }
        setTwo();
        checkGameOver();
    }
    else if (e.code == "ArrowDown") {
        slideDown();
        if (!isMuted) {
            playSound("moveSound");
        }
        setTwo();
        checkGameOver();
    }
    document.getElementById("score").innerText = score;
    if (score>highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
        if (!hasBrokenHighScore) {
            if (!isMuted) {
            playSound("highScoreSound");
        }
            showHSPopup();
            hasBrokenHighScore = true;
        }
        if (!confettiShown) {
            launchConfetti();
            confettiShown = true;
        }
    }
    document.getElementById("highscore").innerText = highscore;
});

function filterZero(row) {
    return row.filter(num => num!=0) //create a new array without zeroes
}

function slide(row) {
    //[0,2,2,2]
    row = filterZero(row); //get rid of zeroes -> [2,2,2]
    //slide
    for (let i=0; i<row.length-1; i++) {
        //check every 2
        if (row[i]==row[i+1]) {
            row[i]*=2;
            row[i+1]=0;
            score+=row[i];
            if (!isMuted) {
            playSound("mergeSound");
        }
        } //[0,2,2,2] -> [4,0,2]
    }
    row = filterZero(row); //[4,2]

    //add zeroes
    while (row.length<columns) {
        row.push(0);
    } //[4,2,0,0]

    return row;
}

function slideLeft() {
    for (let r=0; r<rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        //html portion
        for (let c=0; c<columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r=0; r<rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        //html portion
        for (let c=0; c<columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c=0; c<columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];

        //html portion
        for (let r=0; r<rows; r++) {
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c=0; c<columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];

        //html portion
        for (let r=0; r<rows; r++) {
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function updateLeaderBoard() {
    const name = document.getElementById("playerName").value || "Player";
    const entry = `${name} - ${score}`; //changes the input to string -> name - score
    const li = document.createElement("li");
    li.innerText = entry;
    document.getElementById("leaderboardList").appendChild(li);
}

function showHSPopup() {
    const popup = document.getElementById("newHSPopup");
    popup.style.display = "block";
    popup.style.opacity = 1;

    //restart animation by resetting it
    popup.style.animation = "none";
    popup.offsetHeight; //trigger overflow (offsetHeight -> margin, padding, border etc)
    popup.style.animation = "fadeOut 5s forwards"
}

function showGameOver() {
    document.getElementById("game-over").style.display = "block"; //make the popup visible
}

function checkGameOver() {
    if (!hasEmptyTile() && !canMerge()) {
        if (!isMuted) {
            playSound("gameOverSound");
        }
        showGameOver();
    }
}

function restartGame() {
    if (!isMuted) {
            playSound("clickSound");
        }
    updateLeaderBoard();
    hasBrokenHighScore = false;
    confettiShown = false;
    score = 0;
    document.getElementById("score").innerText = score;

    board =[
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];

    //clear board visually
    for (let r=0; r<rows; r++) {
        for (let c=0; c<columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, 0);
        }
    }
    
    document.getElementById("game-over").style.display = "none"; //hides the popup
    document.getElementById("playerName").value = ""; //clears the input box

    setTwo();
    setTwo();
}

function resetHighScore() {
    if (!isMuted) {
            playSound("clickSound");
        }
    let confirmed = confirm("Are you sure you want to reset the high score?"); //built-in function
    if (confirmed) {
        localStorage.removeItem("highscore");
        highscore = 0;
        document.getElementById("highscore").innerText = highscore;
    }
}

// 👇 Touch support for mobile devices
let startX, startY;
const swipeThreshold = 30; // You can tweak this number

document.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", function (e) {
    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let deltaX = endX - startX;
    let deltaY = endY - startY;

    if (Math.abs(deltaX) < swipeThreshold && Math.abs(deltaY) < swipeThreshold) {
        // 👇 Ignore small touches
        return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) moveRight();
        else moveLeft();
    } else {
        if (deltaY > 0) moveDown();
        else moveUp();
    }
});
