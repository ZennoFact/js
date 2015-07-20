window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(cb) {setTimeout(cb, 17);};

// 変数初期化
var mouseX = 0;
var mouseY = 0;
var H = innerHeight;
var W = innerWidth;
var canvas = document.getElementById( "canvas" );
var ctx = canvas.getContext( "2d" );
canvas.width = W;
canvas.height = H;
var particles = [];
var m = [ 'default', 'shooting', 'spread', 'follow' ]; // shooting, spread or follow

// 命令の設定
// 全モード共通の命令
render(); // Step1-1 描画の開始
var size = 4; // Step1-2 文字のサイズ　初期値 4
var number = 4; // Step1-3 生成する星の個数　初期値 5

var isMoving = false; // Step2-1 星の移動の開始 初期設定 false
var isRefreshing = false; // Step2-2 前回までの描画を消す 初期設定 false
var speedX =　4; // Step2-3 横方向の文字の速度　初期値 4
var speedY =　4; // Step2-3 縦方向の文字の速度　初期値 4

var color = 'random'; // Step7　星の装飾 初期値　'68, 222, 222'

var myWord = '☆'; // Step8 表示する文字の変更

var isChar = false; // Step9　1文字（true）⇔文章（false）の切り替え
// 全モード共通の命令ここまで

// モード変更
var mode = 1; /* 0:星の生成のみ，1:一方向への移動, 2:まき散らす, 3:マウスを追跡 */

// ばらまきモードの命令
var isReflecting = false; // Step3 ウィンドウの壁に当たると跳ね返る 初期設定 false

var isResizing = false; // Step4　拡大と縮小　初期設定 false
// ばらまきモードの命令ここまで

// 追跡モードの命令
var isSmoothing = false; // <span class="color">Step5-1</span> なめらかに移動
var delayRate = 1; // Step5-2 追尾の遅延倍率 0.6~

var sequenceMode = false; // Step6-1 先頭を起点にサイズを変更
var sequenceRate = 1; // Step6-2 最後の星のサイズ 初期値 1倍
// 追跡モードの命令ここまで
// 命令の設定ここまで

// マウスイベントの追加
canvas.addEventListener( "mousedown", onDown, false );
canvas.addEventListener( "mousemove", onMove, false );
canvas.addEventListener( "mouseup", onUp, false );

var isDraging = false;
// ドラッグしたら，文字が出る
function onDown(e) {
  if (m[mode] === 'default') {
    particles = [];
  }

  if (m[mode] === 'spread') {
    isDraging = true;
    mouseX = e.pageX;
    mouseY = e.pageY;
  } else if (m[mode] === 'shooting') {
    if ( particles.length === 0) {
      for (var i = 0; i < number; i++) {
        var particle = new Particle(ctx, Math.random() * W, Math.random() * H);
        particle.v.x = speedX;
        particle.v.y = speedY;
        particles.push( particle );
      }
    } else {
      for (var i = 0; i < particles.length; i++) {
        particles[i] = new Particle(ctx, Math.random() * W, Math.random() * H, i % myWord.length);
      }
    }
  } else if (m[mode] === 'follow') {
    for (var i = 0; i < number; i++) {
      var particle = new Particle(ctx, Math.random() * W, Math.random() * H, i % myWord.length);
      particles.push( particle );
    }
    if (sequenceMode) {
      var temp = sequenceRate - 1;
      var rate = temp / (number - 1);
      for (var i = 0; i < number; i++) {
        particles[i].size *= (1 + rate * i);
      }
    }
  } else {
    for (var i = 0; i < number; i++) {
      var particle = new Particle(ctx, Math.random() * W, Math.random() * H, i % myWord.length);
      particles.push( particle );
    }
  }
}

function onMove(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
}

function onUp(e) {
  if (m[mode]=== 'spread') {
    isDraging = false;
  } else if (m[mode]=== 'follow') {
    particles = [];
  }
}

function Particle(ctx, x, y, index) {
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.prevX = x;
  this.prevY = y;
  this.size = size;
  this.width = 0;
  this.step = (Math.floor(Math.random() * 120) + 100) / 2;
  this.life = 0;
  this.moreBig = true;
  if ( index == null ) {
    this.rnd =  Math.floor(Math.random() * (myWord.length));
  } else {
    this.rnd = index;
  }
  // 色の指定
  this.color = getColor(color);

  // 速度用のオブジェクトv
  this.v = {
    x: ( m[mode] === "spread" ) ? Math.random()　*　speedX　-　speedX / 2 : speedX, // x方向の速度
    y: ( m[mode] === "spread" ) ? Math.random()　*　speedY　-　speedY / 2 : speedY// y方向の速度
  };
}

Particle.prototype.render = function(){
  this.updatePosition()
  this.draw();
};

// 文字の描画
Particle.prototype.draw = function () {
  ctx = this.ctx;
  ctx.beginPath();

  ctx.fillStyle = "rgba(" + this.color + ", 1)" ;
  // ctx.fillStyle = "rgba(" + getFlash(this.color, this.color) + ", 1)" ;
  ctx.font = this.size + "px 'ＭＳ ゴシック'";
  if (isChar) {
    var words = myWord.split('');
    ctx.fillText(words[this.rnd], this.x, this.y);
  } else {
    ctx.fillText(myWord, this.x, this.y);
  }

  ctx.fill();
  ctx.closePath();
};

Particle.prototype.updatePosition = function() {
  if (isMoving) {
    this.move();
  }
};

Particle.prototype.move = function () {
  if (m[mode]=== 'shooting') {
    this.shooting();
  } else if (m[mode]=== 'spread' ) {
    this.spread();
  } else if (m[mode]=== 'follow') {
    this.follow();
  }
};

Particle.prototype.shooting = function () {
  this.x += this.v.x;
  this.y += this.v.y;
  this.changePosition();
};

Particle.prototype.spread = function () {
  this.x += this.v.x;
  this.y += this.v.y;

  if (isReflecting) {
    this.wrapPosition();
  }
  if(isResizing) {
    this.changeSize();
  }
};

Particle.prototype.follow = function () {
  var index;
  index = $.inArray(this, particles);
  this.prevX = this.x;
  this.prevY = this.y;
  if(index == 0) {
    this.x = mouseX;
    this.y = mouseY;
  } else {
    var prev;
    if (isSmoothing) prev = index -1;
    else prev = 0;
    this.x += (particles[prev].prevX - this.x) / (index * delayRate);
		this.y += (particles[prev].prevY - this.y) / (index * delayRate);
  }
}

Particle.prototype.changeSize = function () {
  // 文字のサイズの変更（小→大→小）
  if (this.moreBig) {
    this.size += 0.25;
    this.life += 0.5;
  } else {
    this.size -= 0.25;
  }

  // 大きくなる⇔小さくなるの反転と，文字の消滅の処理
  if (this.size == 0) {
    var index = $.inArray(this, particles);
    particles.splice(index, 1);
  } else if (this.life > this.step) {
    this.moreBig = false;
  }
};

Particle.prototype.wrapPosition = function(){
  if(this.x < 0) this.v.x *= -1;
  if(this.x > W) this.v.x *= -1;
  if(this.y < 0) this.v.y *= -1;
  if(this.y > H) this.v.y *= -1;
};

Particle.prototype.changePosition = function () {
  if(this.x < 0) this.x = W;
  if(this.x > W) this.x = 0;
  if(this.y < 0) this.y = H;
  if(this.y > H) this.y = 0;
};

// 1.図形を描画
// 描画サイクルを開始する
function render() {
  if (isRefreshing) {
    ctx.clearRect(0,0,W,H);
  }


  if (m[mode]=== 'spread') {
    // 文字の追加
    if ( isDraging ) {
      var positionx =  mouseX,
          positiony =  mouseY;
      // particle = new Particle(ctx, innerWidth / 2, innerHeight / 2);
      var particle = new Particle(ctx, positionx, positiony, null);
      particles.push( particle );
    }
  }

  particles.forEach(function(e){ e.render(); });

  // requestanimationframeをつかって、ブラウザの更新のタイミングに実行する
  requestAnimationFrame( render );
}
