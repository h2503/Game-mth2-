//find html canvas
const canvas = document.getElementById("game");
//set canvas context to 2d
const ctx = canvas.getContext("2d");

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 6;
let score = -3;
//gridding the canvas to tilea
let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;
//head starting position and size
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;
//apple size
let appleX = 10;
let appleY = 10;
//set snake position that changes to event listener
let xVelocity = 0;
let yVelocity = 0;
let inputsXVelocity = 0;
let inputsYVelocity = 0;
//sfx sound
const beep = new Audio("beep.mp3");
//max highscore
const NO_OF_HIGH_SCORES = 10;

//game loop that continuously update the game
function drawGame() {
  //repeatively move the snake position
  xVelocity = inputsXVelocity;
  yVelocity = inputsYVelocity;
  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }
  //function call
  clearScreen();
  checkAppleCollision();
  drawApple();
  drawSnake();
  drawScore();
  //increase snake speed at score>30
  if (score > 30) {
    speed = 9;
  }
  //increase snake speed at score>51
  if (score > 51) {
    speed = 11;
  }
  //increase snake speed at score>90
  if (score > 90) {
    speed = 13;
  }
  //update interval of 1sec
  setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;
  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }
  //walls collision
  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }
  //body collision
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }
  //gameover message
  if (gameOver) {
    ctx.font = "35px Common Pixel";
    ctx.fillStyle = "white";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "green";
    ctx.fillText("GAME OVER!!", canvas.width / 5, canvas.height / 3);
    ctx.fillText("Your score is", canvas.width / 8, canvas.height /2);
    ctx.fillText(+ score +"!", canvas.width / 2, canvas.height /1.5);
    checkHighScore(score);//update score 
  }
  return gameOver;
}

//all the functions that moves & add snake head body /apple spawn that will be updated on drawGame()

//score styling
function drawScore() {
  ctx.fillStyle = "yellow";
  ctx.font = "15px Common Pixel";
  ctx.fillText("SCORE " + score, canvas.width -230, 15);//adjust score position
}
//styling the canvas
function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
//snake styling
function drawSnake() {
  ctx.fillStyle = "white";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }
  snakeParts.push(new SnakePart(headX, headY)); //put an item at the end of the list next to the head
  while (snakeParts.length > tailLength) {
    snakeParts.shift(); // remove the furthest item from the snake parts if have more than our tail size.
  }
//head of the snake
  ctx.fillStyle = "green";
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}
//change snake position at a time
function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}
//apple styling
function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}
//Apple random spawn and collision (add tail and add score)
function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    appleX = Math.floor(Math.random() * tileCount);//randomising apple spawn x position
    appleY = Math.floor(Math.random() * tileCount);//randomising apple spawn y position
    tailLength++;//add taillength by 1 tile
    score+=3;//add score by 3
    beep.play();//beep for every apple eaten
  }
}

//navigation using D-PAD & WASD
document.body.addEventListener("keydown", keyDown);
function keyDown(event) {
  //38 is arrow up  & 87 is W key
  if (event.keyCode == 38 || event.keyCode == 87) {
     //changing the XYvelocity to change snake position upward at a time
    if (inputsYVelocity == 1) return;
    inputsYVelocity = -1;
    inputsXVelocity = 0;
  }
  //40 is arrow down  & 83 is S key
  if (event.keyCode == 40 || event.keyCode == 83) {
    //changing the XYvelocity to change snake position downward at a time
    if (inputsYVelocity == -1) return;
    inputsYVelocity = 1;
    inputsXVelocity = 0;
  }
  //37 is arrow left  & 65 is A key
  if (event.keyCode == 37 || event.keyCode == 65) {
    //changing the XYvelocity to change snake position left at a time
    if (inputsXVelocity == 1) return;
    inputsYVelocity = 0;
    inputsXVelocity = -1;
  }
  //39 is arrow right  & 68 is D key
  if (event.keyCode == 39 || event.keyCode == 68) {
    //changing the XYvelocity to change snake position right at a time
    if (inputsXVelocity == -1) return;
    inputsYVelocity = 0;
    inputsXVelocity = 1;
  }
}

drawGame();

//load score at load
function showHighScores() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const highScoreList = document.getElementById('highScores');
    highScoreList.innerHTML = "";//to avoid duplicate
    for (let i = 0; i < highScores.length; i++) {
        let nameStr = highScores[i].name.substring(0, 6);//display first 5 characters of names
        let highScoreListItem = document.createElement('li');//declaring highScoreListItem by creating li element
        highScoreListItem.innerHTML = nameStr + " - " + highScores[i].score;//contstructing li inner HTML
        highScoreList.appendChild(highScoreListItem);
    }
}

function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;
  if (score > lowestScore) {//highscore condition
    const name = prompt('You got a new highscore! Enter name(6 Chars. Max), else you will lose your score:');//prompt name input
      if (name === null || name==="" || name===" " || name==="  " || name==="   " || name==="    " || name==="     " || name==="      "){//not leaving input blank
        return; 
      }
    const newScore = { score, name };
    saveHighScore(newScore, highScores);
    showHighScores();
  }
}

function saveHighScore(score, highScores) {
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score); //reverse display (high to low)
  highScores.splice(NO_OF_HIGH_SCORES);//limit the score display to 10 scores
  localStorage.setItem('highScores', JSON.stringify(highScores)); //set item to local storage in string
}

showHighScores();

//Buttons event
//restart button
function restartBtn(){
  window.location.href = "index.html";
}
//Mute SFX button
function sfxBtn(){
  var sfx = document.getElementById("sfx");
  if(sfx.style.textDecorationLine === "line-through" && beep.muted===true){
    sfx.style.textDecorationLine = "";
    beep.muted=false;
  } else {
    sfx.style.textDecorationLine = "line-through";
    beep.muted=true;
  }
}
//Mute Music button
const button = document.querySelector("#musicBtn");
const audio = document.querySelector("audio");
button.addEventListener("click", () => {
  if (audio.paused) {
    audio.volume = 0.2;
    audio.play();
    button.style.removeProperty('text-decoration-line');   
  } else {
    audio.pause();
    button.style.textDecorationLine = "line-through";
  }  
})