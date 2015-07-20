window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(cb) {setTimeout(cb, 17);};

var canvas = document.getElementById( "canvas" ),
  ctx = canvas.getContext( "2d" ),
  NUM = 20,
  particles = [],
  W = 500,
  H = 500

canvas.width = W;
canvas.height = H;

for(var i = 0; i < NUM; i++) {
  // 初期位置の設定
  var positionx =  Math.random()*W,
      positiony =  Math.random()*H;
  particle = new Particle(ctx, positionx, positiony);
  particles.push( particle );
}

function Particle(ctx, x, y) {
  this.ctx = ctx;
  this.x = x || 0;
  this.y = y || 0;
  // 速度用のオブジェクトv
  this.v = {
    x: Math.random()*10-5, // x方向の速度
    y: Math.random()*10-5 // y方向の速度
  };
}



Particle.prototype.render = function(){
  this.updatePosition();
  // TODO: Step4 範囲外に消えた点を反対側から戻す
  this.wrapPosition();
  this.draw();
}

Particle.prototype.draw = function(){
  // 4. 描画
  ctx = this.ctx;
  ctx.beginPath();

  // TODO: Step5　円の装飾
  // ctx.fillStyle = "#99ff66";
  ctx.fillStyle = this.gradient();

  ctx.arc( this.x, this.y, 10, Math.PI*2, false); // 位置指定
  ctx.fill();
  ctx.closePath();
}

Particle.prototype.updatePosition = function() {
  // 3. 位置をずらす
  this.x += this.v.x;
  this.y += this.v.y;
}

Particle.prototype.wrapPosition = function(){
  if(this.x < 0) this.x = W;
  if(this.x > W) this.x = 0;
  if(this.y < 0) this.y = H;
  if(this.y > H) this.y = 0;
}

Particle.prototype.gradient = function(){
  var col = "153, 255, 106";
  var g = this.ctx.createRadialGradient( this.x, this.y, 0, this.x, this.y, 10);
  g.addColorStop(0,   "rgba(" + col + ", 1)");
  g.addColorStop(0.5, "rgba(" + col + ", 0.2)");
  g.addColorStop(1,   "rgba(" + col + ", 0)");
  return g
}

// 1.図形を描画
// 描画サイクルを開始する

// TODO: Step1 描画の開始
render();

function render() {
  // TODO: step3 前回までの描画を消す
  ctx.clearRect(0,0,W,H);

  particles.forEach(function(e){ e.render(); });

  // requestanimationframeをつかって、ブラウザの更新のタイミングに実行する

  // TODO: Step2 繰り返し実行する
  requestAnimationFrame( render );
}
