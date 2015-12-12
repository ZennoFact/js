// window.requestAnimationFrame =
//   window.requestAnimationFrame ||
//   window.mozRequestAnimationFrame ||
//   window.webkitRequestAnimationFrame ||
//   window.msRequestAnimationFrame ||
//   function(cb) {setTimeout(cb, 17);};


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

// minMatrix 使用開始
// matIVクラスをインスタンス化
var mat = new matIV();
// 行列の生成と初期化
var mMatrix = mat.identity(mat.create());
var vMatrix = mat.identity(mat.create());
var pMatrix = mat.identity(mat.create());
var vpMatrix = mat.identity(mat.create());
var mvpMatrix = mat.identity(mat.create());

// モデル座標変換行列
// 行列に平行移動を加える
var move = [0.5, 0.5, 0.0];
mat.translate(mMatrix, move, mMatrix);

// View座標変換行列
// 行列にViewを設定する
var cameraPosition = [0.0, 0.0, 3.0]; // カメラの位置の指定
var centerPoint = [0.0, 0.0, 0.0];    // 注視点の指定
var cameraUp = [0.0, 1.0, 0.0];       // カメラを天井がどの方向にあるかの指定
mat.lookAt(cameraPosition, centerPoint, cameraUp, vMatrix);

// プロジェクション座標変換の行列（どの範囲を切り取るか）
// プロジェクションのための情報を揃える
var fovy = 45; // 視野角の設定(度数法の数値で設定)
var aspect = canvas.width / canvas.height; // アスペクト比の設定
var near = 0.1; // 空間の最前面の設定
var far = 10.0; // 空間の奥行きの終端の設定
mat.perspective(fovy, aspect, near, far, pMatrix);

// MVPマトリックスの生成（すべての行列を掛け合わせて１つにまとめる）
mat.multiply(pMatrix, vMatrix, vpMatrix); // pにvを掛ける
mat.multiply(vpMatrix, mMatrix, mvpMatrix); // pvに，さらにmを掛ける。mvpの並びの逆順に掛けていく

var uniLocation = gl.getUniformLocation(programs, 'mvpMatrix');
gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);

// 描画
// 描画用の配列に頂点データを結び付け
gl.drawArrays(gl.TRIANGLES, 0, triangleData.p.length / 3);
// 描画開始
gl.flush();


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
