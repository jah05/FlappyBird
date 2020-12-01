function drawAll() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  //draw background
  context.drawImage(bg, 0, 0, canvas.width, canvas.height - groundHeight);
  context.drawImage(ground, 0, canvas.height - groundHeight, canvas.width, groundHeight);

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

var bg = new Image();
bg.src = "sprites/background-day.png";
var ground = new Image();
ground.src = "sprites/base.png";
groundHeight = canvas.width * 112 / 336;
var sizeFactor = 0.8;
var bird = new Bird(canvas.width/2, canvas.height/2, context, sizeFactor=sizeFactor);

window.requestAnimationFrame(drawAll);
