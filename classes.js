class PipePair {
  constructor(x) {
    this.x = x;
    this.src = "pipe-green.png";
  }
}

class Bird {
  constructor(x, y, ctx, sizeFactor=2) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.img = new Image();
    this.img.src = "sprites/yellowbird-midflap.png";
    this.sizeFactor = sizeFactor
  }

  draw() {
    this.ctx.drawImage(this.img, this.x, this.y, this.img.width * this.sizeFactor, this.img.height * this.sizeFactor);
  }
}
