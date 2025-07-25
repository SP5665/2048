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

    document.getElementById("playerName").addEventListener("keydown", function(event) {
        if (event.key == "Enter") {
            this.blur(); //removes the focus from input box
        }
    });
}

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

document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
        checkGameOver();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
        checkGameOver();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();
        checkGameOver();
    }
    else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
        checkGameOver();
    }
    document.getElementById("score").innerText = score;
    if (score>highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
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
    const entry = `${name} - ${score}`; //changes the input to string name - score
    const li = document.createElement("li");
    li.innerText = entry;
    document.getElementById("leaderboardList").appendChild(li);
}

function showGameOver() {
    //make the popup visible
    document.getElementById("game-over").style.display = "block";
    updateLeaderBoard();
}

function checkGameOver() {
    if (!hasEmptyTile() && !canMerge()) {
        showGameOver();
    }
}

function restartGame() {
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
    
    //hide the popup
    document.getElementById("game-over").style.display = "none";
    document.getElementById("playerName").value = ""; //clears the input box

    setTwo();
    setTwo();
}

function resetHighScore() {
    localStorage.removeItem("highscore");
    highscore = 0;
    document.getElementById("highscore").innerText = highscore;
}
