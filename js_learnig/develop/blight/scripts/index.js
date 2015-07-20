window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(cb) {setTimeout(cb, 17);};

var speed = 4; // 光の速度　初期値 8
var size = 8; // 光のサイズ　初期値 4

var canvas = document.getElementById( "canvas" ),
  ctx = canvas.getContext( "2d" ),
  particles = [],
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
  this.step = (parseInt(Math.random() * 220) + 130) / 2;
  this.life = 0;
  this.moreBig = true;

  // 色の指定
  var r = parseInt(Math.random() * 180) + 75;
  var b = parseInt(Math.random() * 180) + 75;
  var g = parseInt(Math.random() * 180) + 75;
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

  this.draw();
}

Particle.prototype.draw = function(){
  ctx = this.ctx;
  ctx.beginPath();

  // TODO: Step4　円の装飾
  // ctx.fillStyle = "#99ff66";
  ctx.fillStyle = this.gradient();
  ctx.arc( this.x, this.y, this.size, Math.PI*2, false); // 位置指定
  ctx.fill();
  ctx.closePath();
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
    particle.size += 0.25;
    particle.life += 0.5;
  } else {
    particle.size -= 0.25;
  }

  // 大きくなる⇔小さくなるの反転と，光の消滅の処理
  if (particle.size == 0) {
    var index = $.inArray(particle, particles);
    particles.splice(index, 1);
  } else if (particle.life > particle.step && particle.moreBig) {
    particle.moreBig = false;
  }
}

Particle.prototype.wrapPosition = function(){
  if(this.x < 0) this.v.x *= -0.8;
  if(this.x > W) this.v.x *= -0.8;
  if(this.y < 0) this.v.y *= -0.8;
  if(this.y > H) this.v.y *= -0.8;
}

Particle.prototype.gradient = function(){
  // var col = "153, 255, 106";
  var g = this.ctx.createRadialGradient( this.x, this.y, 0, this.x, this.y, this.size);

  // Final Step（Step7） 光の見え方の改造
  g.addColorStop(0,   "rgba(" + this.color + ", 1)");
  g.addColorStop(0.2, "rgba(" + this.color + ", 0.2)");
  g.addColorStop(1,   "rgba(" + this.color + ", 0)");

  // g.addColorStop(0,   "rgba(" + this.color + ", 1)");
  // g.addColorStop(0.5, "rgba(" + this.color + ", 0.2)");
  // g.addColorStop(1,   "rgba(" + this.color + ", 0)");

  // サンプル　コメントアウトを切り替えて使用してください。
  // g.addColorStop(0,   "rgba(" + this.color + ", 0)");
  // g.addColorStop(0.3, "rgba(" + this.color + ", 0)");
  // g.addColorStop(0.5,   "rgba(" + this.color + ", 0)");
  // g.addColorStop(0.8,   "rgba(" + this.color + ", 1)");
  // g.addColorStop(1,   "rgba(" + this.color + ", 0)");

  return g;
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
    // test 光の放出を固定位置とマウスの位置で切り替える
    particle = new Particle(ctx, positionx, positiony);
    // particle = new Particle(ctx, innerWidth - 250, innerHeight - 100);
    particles.push( particle );
    particles.sort(function (a, b) {
      var x = a.color;
      var y = b.color;
      if (x > y) return 1;
      if (x < y) return -1;
      return;
    });
  }

  particles.forEach(function(e){ e.render(); });

  // requestanimationframeをつかって、ブラウザの更新のタイミングに実行する
  requestAnimationFrame( render );
}
