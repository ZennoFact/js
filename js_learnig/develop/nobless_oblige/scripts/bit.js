var fulcrumArray = [];

function Bit(ctx, input, x, y, time, step, angle, baseAngle) {
  this.ctx = ctx;
  this.pos = {
    x: x,
    y: y
  };
  this.input = input;
  this.time = time;
  this.life = life;
  // this.color = "244, 244, 244";
  this.step = step;
  this.angle = angle;
  this.radian = this.angle * Math.PI / 180;
  this.baseAngle = baseAngle;
  var data = generatData(input, step);
  this.type = data.type;
  this.size = data.size;
  this.speed = data.speed;
  this.draw = data.draw;
}

Bit.prototype.render = function() {
  // this.speed--;
  this.updatePosition();
  this.draw(this.ctx, this.pos, this.radian, this.speed);
};

Bit.prototype.updatePosition = function() {
  this.pos.x += Math.cos(this.radian) * this.speed;
  this.pos.y += Math.sin(this.radian) * this.speed;
  this.life--;
  if (this.life === 0) {
    timeline.push(this);
    vertexArray.push({
      x: this.x,
      y: this.y,
      angle: this.angle,
      baseAngle: this.baseAngle
    });
    var i = fulcrumArray.indexOf(this);
    delete fulcrumArray[i];
  } else if (this.life === 5 && this.type === "SQUEA_TRUE") {
    console.log(this.baseAngle + ":" + this.angle);
    this.radian = (this.baseAngle - this.angle) * Math.PI / 180;
  }
};

Bit.prototype.gradient = function() {
  // var col = "153, 255, 106";
  var g = this.context.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);

  // Final Step（Step7） 光の見え方の改造
  g.addColorStop(0, "rgba(" + this.color + ", 1)");
  g.addColorStop(0.2, "rgba(" + this.color + ", 0.2)");
  g.addColorStop(1, "rgba(" + this.color + ", 0)");

  // g.addColorStop(0,   "rgba(" + this.color + ", 1)");
  // g.addColorStop(0.5, "rgba(" + this.color + ", 0.2)");
  // g.addColorStop(1,   "rgba(" + this.color + ", 0)");

  return g;
}
