window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(cb) {setTimeout(cb, 17);};

// サイズやスピードを変更するのはここの情報を変更するよ。
var speed = 6; // 光の速度　初期値 8
var size = 30; // 光のサイズ　初期値 4
var number = 33; // 花火の爆発の個数

var canvas = document.getElementById( "canvas" ),
  ctx = canvas.getContext( "2d" ),
  fwBallArray = [],
  // fw1Array = [],
  // fw2Array = [],
  // fwArray = [fw1Array, fw2Array],
  fwArray = [],
  W = innerWidth,
  H = innerHeight,
  mouseX = 0,
  mouseY = 0;

canvas.width = W;
canvas.height = H;

canvas.addEventListener( "mousedown", onDown, false );

function onDown(e) {
  // クリックすると，新しい花火が打ちあがる
  fwBallArray.push(new FireWorkBall(ctx, e.pageX));
}

// 花火玉クラス
function FireWorkBall(ctx, x) {
  this.ctx = ctx;
  this.isRising = true;
  this.x = x;
  this.y = H;
  this.speed = speed;
  this.height = H / 3 + parseInt(Math.random() * 3) * 33;
  this.size = size;
  this.color = "244, 244, 244";
  this.angle = 270;
  this.radians = this.angle * Math.PI / 180;
}

FireWorkBall.prototype.render = function () {
  this.updatePosition();
  this.draw();
};

FireWorkBall.prototype.updatePosition  = function () {
  this.shootingUp();
  if ( ! this.isRising ) {
    // 爆発開始
    var fireworks = [];
    var index = fwArray.length;
    for (var i = 0; i < number; i++) {
      fireworks.push(new FireWork(index, this.ctx, this.x, this.y, i * 11, 6));
    }
    for (var i = 0; i < 24; i++) {
      fireworks.push(new FireWork(index, this.ctx, this.x, this.y, i * 15 + 5, 5));
    }
    for (var i = 0; i < 18; i++) {
      fireworks.push(new FireWork(index, this.ctx, this.x, this.y, i * 20, 4));
    }
    for (var i = 0; i < 15; i++) {
      fireworks.push(new FireWork(index, this.ctx, this.x, this.y, i * 24 + 9, 3));
    }
    for (var i = 0; i < 12; i++) {
      fireworks.push(new FireWork(index, this.ctx, this.x, this.y, i * 30, 2));
    }
    for (var i = 0; i < 9; i++) {
      fireworks.push(new FireWork(index, this.ctx, this.x, this.y, i * 40 + 3, 1));
    }
    for (var i = 0; i < 1; i++) {
      fireworks.push(new FireWork(index, this.ctx, this.x, this.y, 0, 0));
    }
    fwArray.push(fireworks);

    // 配列からの分離
    var index = $.inArray(this, fwBallArray);
    fwBallArray.splice(index, 1);
  }
};

FireWorkBall.prototype.draw = function () {
  tx = this.ctx;
  ctx.beginPath();
  // var lp = { x: particle.position.x, y: particle.position.y };
  ctx.fillStyle = this.gradient();
  ctx.strokeStyle = "rgb(255, 244, 244)";
  ctx.lineWidth = 5;
  ctx.moveTo(this.x , this.y + 50);
  ctx.lineTo(this.x , this.y);

  ctx.stroke();
  ctx.arc( this.x, this.y, this.size, Math.PI*2, false); // 位置指定
  ctx.fill();
  ctx.closePath();
};

FireWorkBall.prototype.gradient = function(){
  // var col = "153, 255, 106";
  var g = this.ctx.createRadialGradient( this.x, this.y, 0, this.x, this.y, this.size);

  // Final Step（Step7） 光の見え方の改造
  g.addColorStop(0,   "rgba(" + this.color + ", 1)");
  g.addColorStop(0.2, "rgba(" + this.color + ", 0.2)");
  g.addColorStop(1,   "rgba(" + this.color + ", 0)");

  // g.addColorStop(0,   "rgba(" + this.color + ", 1)");
  // g.addColorStop(0.5, "rgba(" + this.color + ", 0.2)");
  // g.addColorStop(1,   "rgba(" + this.color + ", 0)");

  return g;
}

// 打ち上げメソッド
FireWorkBall.prototype.shootingUp = function () {
  this.x += Math.cos(this.radians) * this.speed;
  this.y += Math.sin(this.radians) * this.speed;
  if (this.y <= this.height) {
    this.isRising = false;
  }
};

// 花火クラス
function FireWork(index, ctx, x, y, angle, speed) {
  this.index = index;
  this.counter = size * 3;
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.speed = speed / 3;
  this.height = H / 3 + parseInt(Math.random() * 3) * 33;
  this.size = size / 2;
  this.color = "106, 255, 106";
  this.angle = angle;
  this.radians = this.angle * Math.PI / 180;
}

FireWork.prototype.render = function () {
  this.updatePosition();
  this.draw();
};

FireWork.prototype.updatePosition = function () {
  console.log(this.counter);
  this.explode();
  if ( this.counter === 50) {
    // this.color = "106, 106, 255";
    // fwArray[1].push(this);
    // var index = $.inArray(this, fwArray[0][this.index]);
    // fwArray[0][this.index].splice(index, 1);
  } else if ( this.counter <= 0 ) {
    // 爆発終了
    // 配列からの分離
    var index = $.inArray(this, fwArray[this.index]);
    fwArray[this.index].splice(index, 1);
  }
};

FireWork.prototype.draw = function () {
  tx = this.ctx;
  ctx.beginPath();
  ctx.fillStyle = this.gradient();
  ctx.arc( this.x, this.y, this.size, Math.PI*2, false); // 位置指定
  ctx.fill();
  ctx.closePath();
};

// 爆発メソッド
FireWork.prototype.explode = function (first_argument) {
  this.x += Math.cos(this.radians) * this.speed;
  this.y += Math.sin(this.radians) * this.speed;
  this.counter--;
};

FireWork.prototype.gradient = function(){
  // var col = "153, 255, 106";
  var g = this.ctx.createRadialGradient( this.x, this.y, 0, this.x, this.y, this.size);

  // Final Step（Step7） 光の見え方の改造
  g.addColorStop(0,   "rgba(" + this.color + ", 1)");
  g.addColorStop(0.2, "rgba(" + this.color + ", 0.2)");
  g.addColorStop(1,   "rgba(" + this.color + ", 0)");

  return g;
}


// 1.図形を描画
// 描画サイクルを開始する

// TODO: Step1 描画の開始
render();

var counter = 0;
function render() {
  ctx.clearRect(0,0,W,H);

  fwBallArray.forEach(function(e){ e.render(); });
  for (var i = 0; i < fwArray.length; i++) {
    fwArray[i].forEach(function(e){ e.render(); });
  }

  counter++;
  if(counter === 1000) {
    fwBallArray.push(new FireWorkBall(ctx, Math.random() * (W - 300) + 150, 0));
    counter++;
  }

  // requestanimationframeをつかって、ブラウザの更新のタイミングに実行する
  requestAnimationFrame( render );
}
