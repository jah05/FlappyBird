class Pipes {
  constructor(numPipes, velocity, groundHeight, gap, pipeScale=0.6) {
    this.numPipes = numPipes;
    this.velocity = velocity;
    this.groundHeight = groundHeight;
    this.gap = gap;
    this.pipes = [];
    this.pipeScale = pipeScale;
    // find interval length between pipes
    this.interval = (canvas.width - (this.pipeScale * 52) * numPipes) / (numPipes-1);
    this.initializePipes();
    //variable to keep track of the next pipe
    this.birdPipePos = 0; // pos0 || pos1 || pos2 ...
  }

  initializePipes() {
    var nextX = canvas.width;
    for(var i=0; i<this.numPipes; i++) {
      // create the array of pipes;
      this.pipes.push(new PipePair(this.velocity, this.groundHeight, this.gap, nextX));
      nextX += this.interval + 52 * this.pipeScale;
    }
  }

  applyVel() {
    for(var i=0; i<this.pipes.length; i++) {
      this.pipes[i].applyVel();
    }
  }

  update() {
    // remove out of frame pipes and adds one in the back;
    if(this.pipes.length > 0) {
      if(!this.pipes[0].inFrame()) {
        this.pipes.shift(); //remove the first element because it is out of screen
        this.birdPipePos -= 1; // if the a pipe moves out move back ordinal position
        // add the new pipe in the back
        this.pipes.push(new PipePair(this.velocity, this.groundHeight, this.gap,
          this.pipes[this.pipes.length - 1].x + this.interval + 52 * this.pipeScale));
      }
    }
  }

  draw() {
    for(var i=0; i<this.pipes.length; i++) {
      this.pipes[i].draw();
    }
  }

  check(birdX, birdY, birdHeight, birdWidth) {
    var birdAlive = true;
    for(var i=0; i<this.pipes.length && birdAlive; i++) {
      // if a pipe makes contact with the bird return true;
      if(this.pipes[i].hit(birdX, birdY, birdHeight, birdWidth)) {
        birdAlive = false;
      }
    }
    return birdAlive;
  }

  passed(birdX, birdWidth) {
    if(this.pipes[this.birdPipePos].x + this.pipes[this.birdPipePos].pipeScale * 52 < birdX - birdWidth/2) {
      this.birdPipePos += 1; // if when bird passes pipe add to ordinal position
      return true;
    }
  }
}

class PipePair {
  constructor(velocity, groundHeight, gap, x) {
    this.x = x;
    this.velocity = velocity;
    this.pipe1 = new Image();
    this.pipe2 = new Image();
    this.pipe1.src = "sprites/pipeNorth.png";
    this.pipe2.src = "sprites/pipeSouth.png";

    var tHeight = canvas.height - groundHeight - gap; // find available space
    var pipe1Height = Math.random() * tHeight; // random height
    var pipe2Height = tHeight - pipe1Height; // find remaining height

    this.pipeScale = 0.6;

    this.y1 = -(378 * this.pipeScale - pipe1Height); // find offset y pos
    this.y2 = (canvas.height - groundHeight) + (378 * this.pipeScale - pipe2Height) - 377 * this.pipeScale;
  }

  applyVel() {
    this.x -= this.velocity;
  }

  inFrame() {
    // checks if the pipe is in frame
    if(this.x + this.pipeScale * 52 <= 0) {
      return false;
    }
    return true;
  }

  draw() {
    context.drawImage(this.pipe1, this.x, this.y1, this.pipe1.width * this.pipeScale, this.pipe1.height * this.pipeScale);
    context.drawImage(this.pipe2, this.x, this.y2, this.pipe2.width * this.pipeScale, this.pipe2.height * this.pipeScale);
  }

  hit(birdX, birdY, birdHeight, birdWidth) {
    if(birdX + birdWidth/2 > this.x && birdX - birdWidth/2 < this.x + 52 * this.pipeScale) {
      if(birdY-birdHeight/2 < this.y1 + 378 * this.pipeScale) { // if it is within pipe1
        return true;
      }
      else if(birdY + birdHeight/2 > this.y2) { // if it is within pipe2;
        return true;
      }
    }

    return false;
  }
}

class Ground{
  constructor(velocity, width, height,) {
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    // two grounds so we can rotate when one moves out of frame
    this.pos1 = [0, canvas.height - this.height]; //ground 1
    this.pos2 = [canvas.width-10, canvas.height - this.height]; //ground 2
    this.img1 = new Image();
    this.img2 = new Image();
    this.img1.src = "sprites/base.png";
    this.img2.src = "sprites/base.png";
  }

  initialize() {
    this.pos1 = [0, canvas.height - this.height]; //ground 1
    this.pos2 = [canvas.width-10, canvas.height - this.height];
  }

  applyVel() {
    this.pos1[0] -= this.velocity;
    this.pos2[0] -= this.velocity;
  }

  checkBound() {
    if(this.pos1[0] + this.width - 10 <= 0) {
      // switch ground2 to ground1
      this.pos1 = this.pos2;
      this.pos2 = [canvas.width-10, canvas.height - this.height];
    }
  }

  draw() {
    context.drawImage(this.img1, this.pos1[0], this.pos1[1], this.width, this.height);
    context.drawImage(this.img2, this.pos2[0], this.pos2[1], this.width, this.height);
  }
}

class Bird {
  constructor(x, y, groundHeight, sizeFactor=2) {
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.src = "sprites/yellowbird-midflap.png";
    this.height = 34 * sizeFactor;
    this.width = 24 * sizeFactor;
    this.sizeFactor = sizeFactor;
    this.groundHeight = groundHeight;
    this.gravity = 0.5;
    this.velocity = 0;
    this.angle = 0; // radians
    this.angAcc = 0.05; // radians
  }

  applyVel() {
    this.y += this.velocity;
  }

  applyAcc() {
    this.velocity += this.gravity;
  }

  applyRotationChange () {
    // if bird is falling rotate
    if(this.velocity > 0 && this.angle < Math.PI / 2) {
      this.angle += this.angAcc;
    }
    // if rotation is too much stop it;
    else if(this.velocity > 0 && this.angle < Math.PI / 2) {
      this.angle = Math.PI/2
    }
    // when flap the bird is upright
    else {
      this.angle = 0;
    }
  }

  checkBound() {
    if(this.y + this.img.height - 13>= canvas.height - groundHeight) {
      this.velocity = 0;
      this.gravity = 0;
    }
    else if(this.y - this.img.height/2 <= 0) {
      this.velocity = 0;
    }
    else {
      this.gravity = 0.4;
    }
  }

  async flap(event) {
    var key = event.keyCode;
    if((key == '87') || (key == '38')){
      this.img.src = "sprites/yellowbird-upflap.png";
      this.velocity = -6; // boost upwards

      // flap motion
      await new Promise(r => setTimeout(r, 250)); // wait
      this.img.src = "sprites/yellowbird-downflap.png";
      await new Promise(r => setTimeout(r, 250)); // wait
      this.img.src = "sprites/yellowbird-midflap.png";
    }
  }

  draw() {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.angle);
      context.drawImage(this.img, 0-this.img.width * this.sizeFactor/2,
        0-this.img.height * this.sizeFactor/2, this.img.width * this.sizeFactor,
        this.img.height * this.sizeFactor);
      context.restore();
  }
}

function flap(event) {
  bird.flap(event);
}
