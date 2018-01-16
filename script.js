//Variables
var gameArray = [];
var playerTurn; //Boolean
var playerIcon; //Either xImage or oImage
var computerIcon; //The one left over
const winArray = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

//Load images
var xImage = new Image(100, 100);
xImage.src = "http://www.clker.com/cliparts/W/E/4/8/m/J/back-x-th.png";
var oImage = new Image(100, 100);
oImage.src =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/O-Jolle_insigna.png/100px-O-Jolle_insigna.png";

var canvas = document.getElementById("gameboard");
var ctx = canvas.getContext("2d");

//Function that draws the line
function drawCanvas() {
  //Clear canvas
  ctx.rect(0, 0, 300, 300);
  ctx.fillStyle = "white";
  ctx.fill(); 
  
  //Draw lines
  ctx.moveTo(100, 0);
  ctx.lineTo(100, 300);
  ctx.stroke();

  ctx.moveTo(200, 0);
  ctx.lineTo(200, 300);
  ctx.stroke();

  ctx.moveTo(0, 100);
  ctx.lineTo(300, 100);
  ctx.stroke();

  ctx.moveTo(0, 200);
  ctx.lineTo(300, 200);
  ctx.stroke();

  for (var i = 0; i < 9; i++) {
    if (gameArray[i] == "H") {
      ctx.drawImage(
        playerIcon,
        100 * (i - 3 * Math.floor(i / 3)),
        100 * Math.floor(i / 3)
      );
    } else if (gameArray[i] == "C") {
      ctx.drawImage(
        computerIcon,
        100 * (i - 3 * Math.floor(i / 3)),
        100 * Math.floor(i / 3)
      );
    }
  }
}

function newGame() {
  //Reset the game
  gameArray = [];
  for (var i = 0; i < 9; i++) {
    gameArray.push("N");
  }

  //Draw the fresh canvas
  drawCanvas();

  //Computer's first move
  if (!playerTurn) {
    computerMove();
    drawCanvas();
    playerTurn = true;
  }

  //Alternation between player and computer move, triggered by player's click
  $("#gameboard").click(function(e) {
    var gameStatus = ["in progress", -1];

    if (playerTurn) {
      playerTurn = false; //Turn playerTurn off to prevent double-clicks (hopefully)

      //Register click coordinates
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      if (playerMove(x, y)) {
        //If the spot clicked was empty
        gameStatus = checkStatus();
        if (gameStatus[0] != "player win" && gameStatus[0] != "tie") {
          computerMove();
          gameStatus = checkStatus();
        }
        drawCanvas();
      }

      //Check gameStatus and bring up necessary screens
      if (gameStatus[0] == "player win") {
        $("#notification").html("Win");
        document.getElementById('gameboard').style.pointerEvents = 'none';
        setTimeout(function(){
          gameArray = [];
          for (var i = 0; i < 9; i++) {
            gameArray.push("N");
          }
          computerMove();
          drawCanvas();
          $("#notification").html("<br>");
          document.getElementById('gameboard').style.pointerEvents = 'auto';
        }, 3000);
      } else if (gameStatus[0] == "computer win") {
        $("#notification").html("Lose");
        document.getElementById('gameboard').style.pointerEvents = 'none';
        setTimeout(function(){
          gameArray = [];
          for (var i = 0; i < 9; i++) {
            gameArray.push("N");
          }
          computerMove();
          drawCanvas();
          $("#notification").html("<br>");
          document.getElementById('gameboard').style.pointerEvents = 'auto';
        }, 3000);
      } else if (gameStatus[0] == "tie") {
        $("#notification").html("Tie");
        document.getElementById('gameboard').style.pointerEvents = 'none';
        setTimeout(function(){
          gameArray = [];
          for (var i = 0; i < 9; i++) {
            gameArray.push("N");
          }
          computerMove();
          drawCanvas();
          $("#notification").html("<br>");
          document.getElementById('gameboard').style.pointerEvents = 'auto';
        }, 3000);
      }

      playerTurn = true; //Turn playerTurn back on
    }
  });
}

function checkStatus() {
  //Check for wins
  for (var i = 0; i < 8; i++) {
    if (
      gameArray[winArray[i][0]] != "N" &&
      gameArray[winArray[i][0]] == gameArray[winArray[i][1]] &&
      gameArray[winArray[i][0]] == gameArray[winArray[i][2]]
    ) {
      if (gameArray[winArray[i][0]] == "H") {
        return ["player win", i];
      } else {
        return ["computer win", i];
      }
    }
  }

  //Check for ties
  for (var i = 0; i < 9; i++) {
    if (gameArray[i] == "N") {
      return "in progress", -1;
    }
  }
  return ["tie", -1];
}

function computerMove() {
  //Actual logic/////////////////////////
  var availableSpots = [];
  for (var i = 0; i < 9; i++) {
    if (gameArray[i] == "N") {
      availableSpots.push(i);
    }
  }
  var spot = availableSpots[0];
  //Take the last spot left
  if (availableSpots.length == 1) {
    gameArray[spot] = "C";
    return;
  }
  //Check for two-in-a-rows
  for (var i = 0; i < 8; i++) {
    if (availableSpots.indexOf(winArray[i][2]) != -1 && gameArray[winArray[i][0]] != "N" && gameArray[winArray[i][0]] == gameArray[winArray[i][1]] && gameArray[winArray[i][2]] == "N") {
      spot = winArray[i][2];
      gameArray[spot] = "C";
      return;
    }else if (availableSpots.indexOf(winArray[i][0]) != -1 && gameArray[winArray[i][1]] != "N" && gameArray[winArray[i][1]] == gameArray[winArray[i][2]] && gameArray[winArray[i][0]] == "N") {
      spot = winArray[i][0];
      gameArray[spot] = "C";
      return;
    }else if (availableSpots.indexOf(winArray[i][1]) != -1 && gameArray[winArray[i][0]] != "N" && gameArray[winArray[i][0]] == gameArray[winArray[i][2]] && gameArray[winArray[i][1]] == "N") {
      spot = winArray[i][1];
      gameArray[spot] = "C";
      return;
    }
  }
  if (availableSpots.indexOf(4) != -1) {
    spot = 4;
  }else if (availableSpots.indexOf(0) != -1) { //Take corner if possible
    spot = 0;
  }else if (availableSpots.indexOf(2) != -1) {
    spot = 2;
  }else if (availableSpots.indexOf(8) != -1) {
    spot = 8;
  }else if (availableSpots.indexOf(6) != -1) {
    spot = 6;
  }
  gameArray[spot] = "C";
}

//Changes gameArray if spot is empty and returns true if so
function playerMove(x, y) {
  var spot;
  if (x < 100) {
    if (y < 100) {
      spot = 0;
    } else if (y < 200) {
      spot = 3;
    } else {
      spot = 6;
    }
  } else if (x < 200) {
    if (y < 100) {
      spot = 1;
    } else if (y < 200) {
      spot = 4;
    } else {
      spot = 7;
    }
  } else {
    if (y < 100) {
      spot = 2;
    } else if (y < 200) {
      spot = 5;
    } else {
      spot = 8;
    }
  }

  if (gameArray[spot] == "N") {
    gameArray[spot] = "H";
    return true;
  } else {
    return false;
  }
}

$(document).ready(function() {
  $("#start-game").click(function() {
    $("#menu").css("display", "none");
    $("#gameboard").css("display", "inline");

    if ($("input[name = 'x-o']:checked").val() == "X") {
      playerIcon = xImage;
      computerIcon = oImage;
    } else {
      playerIcon = oImage;
      computerIcon = xImage;
    }
    playerTurn = true;
    newGame();
  });
});
