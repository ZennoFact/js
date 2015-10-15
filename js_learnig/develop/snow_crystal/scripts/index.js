window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(cb) {setTimeout(cb, 17);};

// $(function(){
var canvas = $( "#canvas" )[0],
gl = canvas.getContext('webgl'),
W = window.innerWidth,
H = window.innerHeight;

// step1-1 -> canvas.width = W;
// step1-2 -> canvas.height = H;
// canvas.width = W;
// canvas.height = H;
canvas.width = 512;
canvas.height = 512;
// WebGLコンテキストオブジェクトの取得確認
if (!gl) {
  alert('WebGL not supported!');
}

// 色の指定
gl.clearColor(0.0, 0.0, 0.2, 1.0);

// canvasエレメントをクリア
gl.clear(gl.COLOR_BUFFER_BIT);

// WebGLは頂点の描画をすることが基本になる。その頂点を利用して図形を作成する

// 三角形を形成する頂点データの受けとり
var triangleData = genTriangle();
// 頂点データからバッファを生成
var vertexBuffer = gl.createBuffer();
// バッファのバインド処理　一時的なバッファをWebGLコンテキストと結び付ける
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
// 頂点データのバッファへの書き込み
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleData.p), gl.STATIC_DRAW);
// シェーダとプログラムオブジェクト
// HTMLに埋め込んであるシェーダのソースコードを取得
var vertexSource = $('#vs')[0].text;
var fragmentSource = $('#fs')[0].text;

// // シェーダオブジェクトの生成（定数次第で頂点シェーダになるかフラグメントシェーダになるかが変わる）
// var vertexShader = gl.createShader(gl.VERTEX_SHADER);
// var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
// // シェーダ同士を結び付けるプログラムオブジェクトの生成
// var programs = gl.createProgram();
// //　シェーダへのソースコードの割り当て
// gl.shaderSource(vertexShader, vertexSource);
// // シェーダのコンパイル
// gl.compileShader(vertexShader);
// // シェーダのアタッチ
// gl.attachShader(programs, vertexShader);
// gl.shaderSource(fragmentShader, fragmentSource);
// gl.compileShader(fragmentShader);
// gl.attachShader(programs, fragmentShader);
//
// // 頂点シェーダとフラグメントシェーダをリンク
// gl.linkProgram(programs);
// // プログラムオブジェクトを選択状態にする（使用を宣言）
// gl.useProgram(programs);

// 上記処理を関数化したものでプログラムオブジェクトを初期化
var programs = shaderProgram(vertexSource, fragmentSource);

// プログラムオブジェクトに三角形の頂点データを登録
var attLocation = gl.getAttribLocation(programs, 'position');
gl.enableVertexAttribArray(attLocation);
gl.vertexAttribPointer(attLocation, 3, gl.FLOAT, false, 0, 0);

// 描画
// 描画用の配列に頂点データを結び付け
gl.drawArrays(gl.TRIANGLES, 0, triangleData.p.length / 3);
// 描画開始
gl.flush();
// });

// シェーダのコンパイルやプログラムオブジェクトの設定などをすべて行ってくれる関数の例（あくまで例）
function shaderProgram(vertexSource, fragmentSource) {
  // シェーダオブジェクトの生成
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  //　シェーダにソースを割り当ててコンパイル
  gl.shaderSource(vertexShader, vertexSource);
  gl.compileShader(vertexShader);
  // コンパイルチェックとエラーメッセージの表示
  if( gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS) ) {
    console.log("VertexShader compile: OK");
  } else {
    alert(gl.getShaderInfoLog(vertexShader))
  }
  gl.shaderSource(fragmentShader, fragmentSource);
  gl.compileShader(fragmentShader);
  if( gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS) ) {
    console.log("FragmentShader compile: OK");
  } else {
    alert(gl.getShaderInfoLog(fragmentShader))
  }

  // プログラムオブジェクトの生成から選択まで
  var programs = gl.createProgram();
  gl.attachShader(programs, vertexShader);
  gl.attachShader(programs, fragmentShader);
  gl.linkProgram(programs);
  // シェーダのリンクが正しく行われたかチェック
  if( gl.getProgramParameter(programs, gl.LINK_STATUS) ) {
    console.log("Program link: OK");
    gl.useProgram(programs);
  } else {
    alert( gl.getProgramInfoLog(programs) );
  }

  return programs
}

function genTriangle() {
  var obj = {};
  obj.p = [
    // １つ目の三角形
    0.0, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, -0.5, 0.0,
    // ２つ目の三角形
    0.0, -0.5, 0.0,
    0.5, 0.5, 0.0,
    -0.5, 0.5, 0.0
  ];
  return obj;
}



// // サイズやスピードを変更するのはここの情報を変更するよ。
// var speed = 6; // 光の速度　初期値 8
// var size = 30; // 光のサイズ　初期値 4
// var number = 33; // 花火の爆発の個数
//
// var canvas = document.getElementById( "canvas" ),
//   ctx = canvas.getContext( "2d" ),
//   fwBallArray = [],
//   fireworks = [],
//   W = innerWidth,
//   H = innerHeight,
//   mouseX = 0,
//   mouseY = 0;
//
// // step1-1 -> canvas.width = W;
// // step1-2 -> canvas.height = H;
// canvas.width = W;
// canvas.height = H;
// // step2 -> addClick();
// addClick();
// // 描画サイクルを開始する
// var counter = 1;
// function render() {
//   // step3 -> ctx.clearRect(0,0,W,H);
//   ctx.clearRect(0,0,W,H);
//   fwBallArray.forEach(function(e){ e.render(); });
//   fireworks.forEach(function(e){ e.render(); });
//
//   // 番外編，以下ののコメントアウトを全部外す
//   // counter--;
//   // if(counter <= 0) {
//   //   fwBallArray.push(new FireWorkBall(ctx, parseInt(Math.random() * (W - 300)) + 150, 0));
//   //   counter = parseInt(Math.random() * 200);
//   // }
//
//
//   // requestanimationframeをつかって、ブラウザの更新のタイミングに実行する
//   requestAnimationFrame( render );
// }
//
// // step -> 4
// var c1 = newColor(106, 255, 106);
// var c2 = newColor(106, 255, 106);
// var c3 = newColor(106, 106, 255);
// var c4 = newColor(106, 106, 255);
// var c5 = newColor(255, 106, 106);
// var c6 = newColor(255, 106, 106);
// var c7 = newColor(106, 255, 255);
// var cm = newColor(255, 106, 255);
// var ce = newColor(255, 255, 106);
//
// // step -> 5 addDaD();
//
//
//
//
//
// // 描画の開始
// render();
//
// function newColor(r, b, g) {
//   return r + ", " + b + ", " + g;
// }
//
// function onDown(e) {
//   // クリックすると，新しい花火が打ちあがる
//   fwBallArray.push(new FireWorkBall(ctx, e.pageX, 0));
// }
//
// // 花火玉クラス
// function FireWorkBall(ctx, x, type, path) {
//   this.ctx = ctx;
//   this.isRising = true;
//   this.x = x;
//   this.y = H;
//   this.speed = speed;
//   this.height = H / 3 + parseInt(Math.random() * 3) * 33;
//   this.size = size;
//   this.color = "244, 244, 244";
//   this.angle = 270;
//   this.radians = this.angle * Math.PI / 180;
//   this.type = type;
//   // TODO:
//   this.path = path;
// }
//
// FireWorkBall.prototype.render = function () {
//   this.updatePosition();
//   this.draw();
// };
//
// FireWorkBall.prototype.updatePosition  = function () {
//   this.shootingUp();
//   if ( ! this.isRising ) {
//     // 爆発開始
//     var firework;
//     if (this.type === 0) {
//       firework = new FireWorks(this.ctx, this.x, this.y);
//     } else {
//       firework = new ImageWorks(this.ctx, this.x, this.y, this.path);
//     }
//     firework.createFire();
//     fireworks.push(firework);
//
//     // 配列からの分離
//     var index = $.inArray(this, fwBallArray);
//     fwBallArray.splice(index, 1);
//   }
// };
//
// FireWorkBall.prototype.draw = function () {
//   tx = this.ctx;
//   ctx.beginPath();
//
//   ctx.fillStyle = this.gradient();
//   ctx.strokeStyle = "rgb(" + this.color + ")";
//   ctx.lineWidth = 5;
//   ctx.moveTo(this.x , this.y + 50);
//   ctx.lineTo(this.x , this.y);
//   // ctx.moveTo(this.lp.x, this.lp.y);
//   // ctx.lineTo(particle.position.x, particle.position.y);
//
//   ctx.stroke();
//   ctx.arc( this.x, this.y, this.size, Math.PI*2, false); // 位置指定
//   ctx.fill();
//   ctx.closePath();
// };
//
// FireWorkBall.prototype.gradient = function(){
//   // var col = "153, 255, 106";
//   var g = this.ctx.createRadialGradient( this.x, this.y, 0, this.x, this.y, this.size);
//
//   // Final Step（Step7） 光の見え方の改造
//   g.addColorStop(0,   "rgba(" + this.color + ", 1)");
//   g.addColorStop(0.2, "rgba(" + this.color + ", 0.2)");
//   g.addColorStop(1,   "rgba(" + this.color + ", 0)");
//
//   // g.addColorStop(0,   "rgba(" + this.color + ", 1)");
//   // g.addColorStop(0.5, "rgba(" + this.color + ", 0.2)");
//   // g.addColorStop(1,   "rgba(" + this.color + ", 0)");
//
//   return g;
// }
//
// // 打ち上げメソッド
// FireWorkBall.prototype.shootingUp = function () {
//   lp = { x: this.x, y: this.y };
//   this.x += Math.cos(this.radians) * this.speed;
//   this.y += Math.sin(this.radians) * this.speed;
//   if (this.y <= this.height + 30) {
//     this.color = "0, 0, 0";
//   }
//   if (this.y <= this.height) {
//     this.isRising = false;
//   }
// };
//
// // 花火クラス
// function FireWorks(ctx, x, y) {
//   this.ctx = ctx;
//   this.x = x;
//   this.y = y;
//   this.counter = size * 3;
//   this.speed = parseInt(Math.random() * 5) + 6;
//   this.fires = [];
// }
//
// FireWorks.prototype.createFire = function () {
//   for (var i = 0; i < number; i++) {
//     this.fires.push(new FireWork(this.ctx, this.x, this.y, i * 11, this.speed, c1));
//   }
//   for (var i = 0; i < 24; i++) {
//     this.fires.push(new FireWork(this.ctx, this.x, this.y, i * 15 + 5, this.speed * 0.84, c2));
//   }
//   for (var i = 0; i < 18; i++) {
//     this.fires.push(new FireWork(this.ctx, this.x, this.y, i * 20, this.speed * 0.68, c3));
//   }
//   for (var i = 0; i < 15; i++) {
//     this.fires.push(new FireWork(this.ctx, this.x, this.y, i * 24 + 9, this.speed * 0.52, c4));
//   }
//   for (var i = 0; i < 12; i++) {
//     this.fires.push(new FireWork(this.ctx, this.x, this.y, i * 30, this.speed * 0.36, c5));
//   }
//   for (var i = 0; i < 9; i++) {
//     this.fires.push(new FireWork(this.ctx, this.x, this.y, i * 40 + 3, this.speed * 0.20, c6));
//   }
//   for (var i = 0; i < 1; i++) {
//     this.fires.push(new FireWork(this.ctx, this.x, this.y, 0, 0, c7));
//   }
// };
//
// FireWorks.prototype.render = function () {
//
//   if ( this.counter === 50) {
//     // 試しに途中で色を変えてみた
//     // 試しにスピードの調整をしてみた
//     this.fires.forEach(function(e){
//       e.color = cm;
//       e.speed /= 2;
//     });
//   } else if ( this.counter === 30 ) {
//     this.fires.forEach(function(e){
//       e.color = ce;
//       e.speed /= 2;
//     });
//   } else if ( this.counter <= 0 ) {
//     // 爆発終了
//     // 配列からの分離
//     var index = $.inArray(this, fireworks);
//     fireworks.splice(index, 1);
//   }
//
//   this.draw();
//
//   this.counter--;
// };
//
// FireWorks.prototype.draw = function () {
//   this.fires.forEach(function(e){ e.updatePosition(); })
//   this.fires.forEach(function(e){ e.render(); });
// };
//
// // 火花クラス
// function FireWork(ctx, x, y, angle, speed, color) {
//   this.ctx = ctx;
//   this.x = x;
//   this.y = y;
//   this.speed = speed / 3;
//   this.height = H / 3 + parseInt(Math.random() * 3) * 33;
//   this.size = size / 2;
//   this.color = color;
//   this.angle = angle;
//   this.radians = this.angle * Math.PI / 180;
//   this.g = 0.0001;
//   this.t = 0;
//   this.alpha = 1;
//   if (this.color === 'non') {
//     this.color = '0, 0, 0';
//     this.alpha = 0;
//   }
// }
//
// FireWork.prototype.render = function () {
//   this.updatePosition();
//   this.draw();
// };
//
// FireWork.prototype.updatePosition = function () {
//   this.explode();
// };
//
// FireWork.prototype.draw = function () {
//   tx = this.ctx;
//   ctx.beginPath();
//   ctx.fillStyle = this.gradient();
//   ctx.arc( this.x, this.y, this.size, Math.PI*2, false); // 位置指定
//   ctx.fill();
//   ctx.closePath();
// };
//
// // 爆発メソッド
// FireWork.prototype.explode = function () {
//   this.x += Math.cos(this.radians) * this.speed;
//   this.y += Math.sin(this.radians) * this.speed;
//   this.t++;
//   // 重力加速度の計算
//   this.y += 1 / 2 * + this.g * (this.t * 0.7) * (this.t * 0.7);
//   this.counter--;
// };
//
// FireWork.prototype.gradient = function(){
//   // var col = "153, 255, 106";
//   var g = this.ctx.createRadialGradient( this.x, this.y, 0, this.x, this.y, this.size);
//   if (this.t >= 80 ) {
//     this.alpha -= 0.01;
//   }
//
//   // Final Step（Step7） 光の見え方の改造
//   // g.addColorStop(0,   "rgba(" + "200, 200, 200" + ", " + this.alpha + ")");
//   g.addColorStop(0,   "rgba(" + this.color + ", " + this.alpha + ")");
//   g.addColorStop(0.1, "rgba(" + this.color + ", " + this.alpha * 0.4 + ")");
//   g.addColorStop(0.9, "rgba(" + this.color + ", " + this.alpha * 0.1 + "");
//   g.addColorStop(1,   "rgba(" + this.color + ", 0.0)");
//
//   return g;
// }
//
//
// // ドラッグアンドドロップ関連の処理
// var output = [];
// function handleFileSelect(e) {
//   e.stopPropagation();
//   e.preventDefault();
//
//   var files = e.dataTransfer.files; // FileList object.
//
//   // files is a FileList of File objects. List some properties.
//   var output = [];
//   for (var i = 0, f; f = files[i]; i++) {
//
//     if (!f.type.match('image.*')) {
//       continue;
//     }
//
//     var reader = new FileReader();
//
//     // Closure to capture the file information.
//     reader.onload = (function(theFile) {
//       return function(e) {
//         // Render thumbnail.
//         var li = document.createElement('li');
//         var imagePath = e.target.result;
//         var flag = true;
//         var lists = $("li");
//         // TODO: かぶった物は表示しない
//         for (var i = 0; i < lists.length; i++) {
//           if (lists[i].title == escape(theFile.name)) {
//             flag = false;
//           }
//         }
//         if (flag) {
//           li.innerHTML = ['<img class="thumb" src="', imagePath,
//                           '" title="', escape(theFile.name), '"/>'].join('');
//         }
//         // TODO:
//         // document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
//         $("#icon_list > ul").append(li);
//         fwBallArray.push(new FireWorkBall(ctx, W / 2, 1, imagePath));
//
//       };
//     })(f);
//
//     // Read in the image file as a data URL.
//     reader.readAsDataURL(f);
//   }
// }
//
// function handleDragOver(e) {
//   e.stopPropagation();
//   e.preventDefault();
//   e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
// }
//
// if (window.File && window.FileReader && window.FileList && window.Blob) {
//   console.log("OK");
// } else {
//   alert('The File APIs are not fully supported in this browser.');
// }
//
// // 画像花火の処理
// function ImageWorks(ctx, x, y, path) {
//   this.ctx = ctx;
//   this.x = x;
//   this.y = y;
//   this.counter = size * 3;
//   this.path = path;
//   this.fires = [];
// }
//
// ImageWorks.prototype.createFire = function () {
//   var self = this;
//   var img = new Image();
// 　
//   img.src = this.path;
//   img.onload = function(){
//     /*読み込み終了後ここで画像を加工して表示する*/
//     var temp = document.createElement('canvas');
//     var context = temp.getContext('2d');
//     // var w = img.width;
//     // var h = img.height;
//     var w = 200;
//     var h = 200;
//     temp.width = w;
//     temp.height = h;
//     context.drawImage(img, this.x, this.y, temp.width, temp.height);
//     var src = context.getImageData(0,0,temp.width,temp.height);
//     var imgData = context.createImageData(temp.width, temp.height);
//     for (var i = 0; i <= temp.height * 4; i += 4) {
//       for (var j = 0; j <= temp.width * 4; j += 4) {
//         if (j % 40 == 0 && i % 40 == 0) {
//           var index = i * temp.width + j;
//           var color = parseInt(src.data[index])+  ', ' + parseInt(src.data[index + 1]) + ', ' + parseInt(src.data[index + 2]);
//           if(!src.data[index + 1]) console.log(color);
//
//           // 度で指定
//           var relativeX = j - temp.width * 2;
//           var relativeY = i - temp.height * 2;
//
//           // var angle = Math.atan2(i / 4 - temp.height / 8, -(j / 4 - temp.width / 8)) * 180 / Math.PI;
//           var angle = Math.atan2(relativeY, relativeX) * 180 / Math.PI;
//
//           // var speed = (Math.abs(relativeY) + Math.abs(relativeX)) / 100;
//           var speed = getDistance(Math.abs(self.x + relativeX), self.x,
//            Math.abs(self.y + relativeY), self.y) / 50;
//
//
//           var x = self.x;
//           var y = self.y;
//
//           if( !isNaN(parseInt(src.data[index])) ) self.fires.push(new FireWork(self.ctx, x, y, angle, speed, color));
//           else self.fires.push(new FireWork(self.ctx, x, y, angle, speed, 'non'));
//         }
//       }
//     }
//   }
// };
//
// function getDistance(x1, x2, y1, y2) {
// 　return Math.sqrt(Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2));
// }
//
// ImageWorks.prototype.render = function () {
//   if ( this.counter === 50) {
//     // 試しにスピードの調整をしてみた
//     this.fires.forEach(function(e){
//       e.speed /= 2;
//     });
//   } else if ( this.counter === 30 ) {
//     this.fires.forEach(function(e){
//       e.speed /= 2;
//     });
//   } else if ( this.counter <= 0 ) {
//     // 爆発終了
//     // 配列からの分離
//     var index = $.inArray(this, fireworks);
//     fireworks.splice(index, 1);
//   }
//
//   this.draw();
//
//   this.counter--;
// };
//
// ImageWorks.prototype.draw = function () {
//   this.fires.forEach(function(e){ e.updatePosition(); })
//   this.fires.forEach(function(e){ e.render(); });
// };
//
// function addClick() {
//   canvas.addEventListener( "mousedown", onDown, false );
// }
//
// function addDaD() {
//   canvas.addEventListener('dragover', handleDragOver, false);
//   canvas.addEventListener('drop', handleFileSelect, false);
// }
