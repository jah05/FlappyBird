function playAgain(event) {
  var key = event.key;
  if(!birdAlive) {
    if(key=="r") {
      resetGame();
    }
  }
}

function resetGame() {
  bird = new Bird(canvas.width/2 - 50, (canvas.height - groundHeight)/2, groundHeight, sizeFactor=sizeFactor);
  pipes = new Pipes(3, birdXSpeed, groundHeight, 100);
  ground = new Ground(birdXSpeed, canvas.width, groundHeight);
  score = 0;
  birdAlive = true;
}

function drawScore() {
  var scoreDigits = (score.toString()).split('');
  var imageW = 24;
  var imageH = 36;
  var y = 10;
  var x = 10;
  var digitFactor = 0.5;
  for(var i=0; i<scoreDigits.length; i++) {
    var path = "sprites/" + scoreDigits[i] + ".png";
    var digit = new Image();
    digit.src = path;
    context.drawImage(digit, x, y, imageW * digitFactor, imageH * digitFactor);
    x += imageW * digitFactor + 2;
  }
}

function drawAll() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  //draw background
  if(birdAlive){
    pipes.update();
    pipes.applyVel();

    ground.applyVel();
    ground.checkBound();

    bird.applyAcc();
    bird.applyVel();
    bird.applyRotationChange();
    bird.checkBound();
    if(pipes.passed(bird.x, bird.width)) {
      score++;
    }
    console.log(score);
    birdAlive = pipes.check(bird.x, bird.y, bird.height, bird.width)
  }
  context.drawImage(bg, 0, 0, canvas.width, canvas.height - groundHeight);
  pipes.draw();
  ground.draw();
  bird.draw();
  drawScore();
  if(!birdAlive){
    context.font = "bold 13px Arial";
    context.fillStyle = "white";
    context.fillText("Your score was: " + score.toString(), canvas.width/2 - 60, canvas.height/2 + 15);
    context.fillText("[R] TO PLAY AGAIN", canvas.width/2 - 60, canvas.height/2 + 35);
    context.drawImage(gameOver, canvas.width/2 - 192/4, canvas.height/2 - 42/2, 192/2, 42/2);
  }
  window.requestAnimationFrame(drawAll);
}

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

// scale to flappy bird bg img size
canvas.width = (windowHeight - 20) * 480 / 640;
canvas.height = windowHeight - 20;

var birdXSpeed = 1.5;
var sizeFactor = 0.8;
var groundHeight = canvas.width * 112 / 336;
var score = 0;
var birdAlive = true;

var bg = new Image();
bg.src = "sprites/background-day.png";
var gameOver = new Image();
gameOver.src = "sprites/gameover.png";

var ground = new Ground(birdXSpeed, canvas.width, groundHeight);
var bird = new Bird(canvas.width/2 - 50, (canvas.height - groundHeight)/2, groundHeight, sizeFactor=sizeFactor);
var pipes = new Pipes(3, birdXSpeed, groundHeight, 100);

document.addEventListener("keydown", flap);
document.addEventListener("keydown", playAgain);

window.requestAnimationFrame(drawAll);
