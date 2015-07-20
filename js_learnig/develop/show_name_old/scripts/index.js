window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(cb) {setTimeout(cb, 17);};


// サイズやスピードを変更するのはここの情報を変更するよ。
// var myName = "( ﾟДﾟ)";
// IQサプリに使えそうです
var myName = "☆★"; // 名前を入れてね。
var speed = 4; // 光の速度　初期値 4
var size = 4; // 光のサイズ　初期値 4
var charMode = true; // 1文字ずつ出すときは true 。文章で出すときは false 。

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
  this.step = (parseInt(Math.random() * 120) + 100) / 2;
  this.life = 0;
  this.moreBig = true;
  this.rnd =  parseInt(Math.random() * myName.length);

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

  this.drawName();
}

// 文字の描画
Particle.prototype.drawName = function () {
  ctx = this.ctx;
  ctx.beginPath();

  // TODO: Step4　円の装飾
  // ctx.fillStyle = "#99ff66";
  ctx.fillStyle = "rgba(" + this.color + ", 1)" ;
  var names = myName.split('');
  ctx.font = this.size + "px 'ＭＳ ゴシック'";
  if (charMode) {
    var names = myName.split('');
    ctx.font = this.size + "px 'ＭＳ ゴシック'";
    ctx.fillText(names[this.rnd], this.x, this.y);
  } else {
    ctx.font = this.size + "px 'ＭＳ ゴシック'";
    ctx.fillText(myName, this.x, this.y);
  }

  ctx.fill();
  ctx.closePath();
};

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
  } else if (particle.life > particle.step) {
    particle.moreBig = false;
  }
}

Particle.prototype.wrapPosition = function(){
  if(this.x < 0) this.v.x *= -0.8;
  if(this.x > W) this.v.x *= -0.8;
  if(this.y < 0) this.v.y *= -0.8;
  if(this.y > H) this.v.y *= -0.8;
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
    // particle = new Particle(ctx, innerWidth / 2, innerHeight / 2);
    particle = new Particle(ctx, positionx, positiony);
    particles.push( particle );
  }

  particles.forEach(function(e){ e.render(); });

  // requestanimationframeをつかって、ブラウザの更新のタイミングに実行する
  requestAnimationFrame( render );
}
