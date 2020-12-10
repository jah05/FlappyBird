function drawAll() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  //draw background
  context.drawImage(bg, 0, 0, canvas.width, canvas.height - groundHeight);

  pipes.update();
  pipes.applyVel();
  pipes.draw();
  console.log(pipes.check(bird.x, bird.y, bird.height, bird.width));

  ground.applyVel();
  ground.checkBound();
  ground.draw();

  bird.applyAcc();
  bird.applyVel();
  bird.applyRotationChange();
  // console.log(bird.velocity);
  bird.checkBound();
  bird.draw();

  window.requestAnimationFrame(drawAll);
}

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var canvas = document.getElementById("mainCanvas");
var context = canvas.getContext("2d");

// scale to flappy bird bg img size
canvas.width = (windowHeight - 20) * 480 / 640;
canvas.height = windowHeight - 20;
// canvas.width = 480;
// canvas.height = 640;

var bg = new Image();
bg.src = "sprites/background-day.png";

var birdXSpeed = 1.5;

groundHeight = canvas.width * 112 / 336;
ground = new Ground(birdXSpeed, canvas.width, groundHeight);

var sizeFactor = 0.8;
var bird = new Bird(canvas.width/2 - 50, (canvas.height - groundHeight)/2, groundHeight, sizeFactor=sizeFactor);

// var pipe = new PipePair(birdXSpeed, groundHeight, 70, canvas.width);
var pipes = new Pipes(3, birdXSpeed, groundHeight, 80);
document.addEventListener("keydown", flap);
window.requestAnimationFrame(drawAll);
