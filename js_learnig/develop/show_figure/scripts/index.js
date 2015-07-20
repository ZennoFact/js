window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(cb) {setTimeout(cb, 17);};


// サイズやスピードを変更するのはここの情報を変更するよ。
var speed = 8; // 光の速度　初期値 8
var size = 4; // 光のサイズ　初期値 4
var charMode = true; // 1文字ずつ出すときは true 。文章で出すときは false 。
var type = 4; // 作る図形の種類の数

var canvas = document.getElementById( "canvas" ),
  ctx = canvas.getContext( "2d" ),
  arcs = [],
  tries = [],
  rects = [],
  stars = [],
  particles = [arcs, tries, rects, stars],
  W = innerWidth,
  H = innerHeight,
  mouseX = 0,
  mouseY = 0;

canvas.width = W;
canvas.height = H;

canvas.addEventListener( "mousedown", onDown, false );
canvas.addEventListener( "mousemove", onMove, false );
canvas.addEventListener( "mouseup", onUp, false );

var isDraging = false;
// ドラッグしたら，光が出る
function onDown(e) {
  isDraging = true;
  mouseX = e.pageX;
  mouseY = e.pageY;
}

function onMove(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
}

function onUp(e) {
  isDraging = false;
}

function Particle(ctx, x, y) {
  this.ctx = ctx;
  this.x = x || 0;
  this.y = y || 0;
  this.size = size;
  this.step = (parseInt(Math.random() * 200) + 100) / 2;
  this.life = 0;
  this.moreBig = true;
  this.type = parseInt(Math.random() * type),
  this.angle = 0;

  // 色の指定
  var r = parseInt(Math.random() * 10) * 15 + 105;
  var b = parseInt(Math.random() * 10) * 15 + 105;
  var g = parseInt(Math.random() * 10) * 15 + 105;
  this.color = r + ', ' + b + ', ' + g;

  // 速度用のオブジェクトv
  this.v = {
    x: Math.random()　*　speed　-　speed / 2, // x方向の速度
    y: Math.random()　*　speed　-　speed / 2 // y方向の速度
  };
}

Particle.prototype.render = function(){
  this.updatePosition();
  // TODO: Step6 ウィンドウの壁に当たると跳ね返る
  this.wrapPosition();

  // 番外編　Step? 文字の表示に切り替え
  this.draw();
}

Particle.prototype.draw = function(){
  var ctx = this.ctx;

  ctx.beginPath();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.save();

  ctx.translate(this.x, this.y);
  var angle = this.angle * Math.PI / 180;
  ctx.rotate(angle);

  // TODO: Step4　円の装飾
  // ctx.fillStyle = "#99ff66";
  ctx.strokeStyle = "rgba(" + this.color + ", 1)" ;
  ctx.lineWidth = 5;

  if(this.type == 0) {
    createArc(this);
  } else if(this.type == 1) {
    createTriangle(this);
  } else if(this.type == 2) {
    createRect(this);
  } else if (this.type == 3) {
    createStar(this);
  }
  ctx.stroke();

  ctx.closePath();

  ctx.restore();
  ctx.save();

  this.angle++;

}

function createArc(particle) {
  ctx.arc( 0, 0, particle.size / 2, Math.PI*2, false); // 位置指定
}

function createTriangle(particle) {
  ctx.moveTo(0, 0);
  ctx.lineTo(0 - particle.size / 2, 0 + particle.size * 0.9);
  ctx.lineTo(0 + particle.size / 2, 0 + particle.size * 0.9);
  ctx.lineTo(0, 0);
  ctx.lineTo(0 - particle.size / 2, 0 + particle.size * 0.9);
}

function createRect(particle) {
  ctx.strokeRect( 0, 0, particle.size, particle.size );
}

function createStar(particle) {
  ctx.moveTo(0, 0);
  ctx.lineTo(0 - particle.size * 0.18, 0 + particle.size * 0.25);
  ctx.lineTo(0 - particle.size * 0.53, 0 + particle.size * 0.3); // 左上
  ctx.lineTo(0 - particle.size * 0.3, 0 + particle.size * 0.5);
  ctx.lineTo(0 - particle.size * 0.4, 0 + particle.size * 0.9); // 左下
  ctx.lineTo(0, 0 + particle.size * 0.72);
  ctx.lineTo(0 + particle.size * 0.4, 0 + particle.size * 0.9); // 右下
  ctx.lineTo(0 + particle.size * 0.3, 0 + particle.size * 0.5);
  ctx.lineTo(0 + particle.size * 0.53, 0 + particle.size * 0.3); // 右上
  ctx.lineTo(0 + particle.size * 0.18, 0 + particle.size * 0.25);
  ctx.lineTo(0, 0);
  ctx.lineTo(0 - particle.size * 0.18, 0 + particle.size * 0.25);

}

Particle.prototype.updatePosition = function() {
  // TODO: Step2　円を動かす
  moveParticle(this);
  // TODO: Step5　サイズの変更
  changeParticleSize(this);
}

function moveParticle(particle) {
  particle.x += particle.v.x;
  particle.y += particle.v.y;
}

function changeParticleSize(particle) {
  // 光のサイズの変更（小→大→小）
  if (particle.moreBig) {
    particle.size += 0.5;
    particle.life += 1;
  } else {
    particle.size -= 0.25;
  }

  // 大きくなる⇔小さくなるの反転と，光の消滅の処理
  // if (particle.size == 0) {
  //   var index = $.inArray(particle, particles);
  //   particles.splice(index, 1);
  // } else if (particle.life > particle.step) {
  //   particle.moreBig = false;
  // }
  if (particle.size == 0) {
    var index = $.inArray(particle, particles[particle.type]);
    particles[particle.type].splice(index, 1);
  } else if (particle.life > particle.step) {
    particle.moreBig = false;
  }
}

Particle.prototype.wrapPosition = function(){
  if(this.x < 0 || this.x > W - this.size) this.v.x *= -0.8;
  if(this.y < 0 || this.y > H - this.size) this.v.y *= -0.8;

}

// 1.図形を描画
// 描画サイクルを開始する

// TODO: Step1 描画の開始
render();

function render() {
  // TODO: step3 前回までの描画を消す
  ctx.clearRect(0,0,W,H);

  // 光の追加
  if ( isDraging ) {
    var positionx =  mouseX,
        positiony =  mouseY;
    particle = new Particle(ctx, positionx, positiony);
    // particle = new Particle(ctx, W / 2, H / 2);
    particles[particle.type].push( particle );
    particles.sort(function (a, b) {
      var x = a.color;
      var y = b.color;
      if (x > y) return 1;
      if (x < y) return -1;
      return;
    });
  }

  // ctx.beginPath();
  for (var i = 0; i < particles.length; i++) {
    particles[i].forEach(function(e){ e.render(); });
  }

  //
  // ctx.stroke();
  // ctx.closePath();

  // requestanimationframeをつかって、ブラウザの更新のタイミングに実行する
  requestAnimationFrame( render );
}
