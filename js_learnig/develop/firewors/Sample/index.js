window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(cb) {setTimeout(cb, 17);};

// サイズやスピードを変更するのはここの情報を変更するよ。
var speed = 6; // 光の速度　初期値 8
var size = 20; // 光のサイズ　初期値 4
var number = 33; // 花火の爆発の個数

var canvas = document.getElementById( "canvas" ),
  ctx = canvas.getContext( "2d" ),
  fwBallArray = [],
  fireworks = [],
  W = innerWidth,
  H = innerHeight,
  mouseX = 0,
  mouseY = 0;

canvas.width = W;
canvas.height = H;

// canvas.addEventListener( "mousedown", onDown, false );
canvas.addEventListener('dragover', handleDragOver, false);
canvas.addEventListener('drop', handleFileSelect, false);

// TODO: Step1 描画の開始
render();

var counter = 1;
function render() {
  // ctx.clearRect(0,0,W,H);




  // requestanimationframeをつかって、ブラウザの更新のタイミングに実行する
  requestAnimationFrame( render );
}


var output = [];
function handleFileSelect(e) {
  e.stopPropagation();
  e.preventDefault();

  var files = e.dataTransfer.files; // FileList object.

  // files is a FileList of File objects. List some properties.
  var output = [];
    // output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
  for (var i = 0, f; f = files[i]; i++) {
    //             f.size, ' bytes, last modified: ',
    //             f.lastModifiedDate.toLocaleDateString(), '</li>');
    // Only process image files.
    if (!f.type.match('image.*')) {
      continue;
    }

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        // Render thumbnail.
        var li = document.createElement('li');
        var imagePath = e.target.result;
        li.innerHTML = ['<img class="thumb" src="', imagePath,
                          '" title="', escape(theFile.name), '"/>'].join('');
        // TODO:
        // document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
        // $("#icon_list > ul").append(li);
        // fwBallArray.push(new FireWorkBall(ctx, 500, 1, imagePath));

        // 試しにパーティクルを表示
        imageToParticle(imagePath, 0, 0);

        // 試しに画像を描画
        // var img = new Image();
        // img.src = imagePath;
        // ctx.drawImage(img, 0, 0);
      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }
}

function handleDragOver(e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

if (window.File && window.FileReader && window.FileList && window.Blob) {
  console.log("OK");
} else {
  alert('The File APIs are not fully supported in this browser.');
}

// 画像をパーティクルに変換
function imageToParticle(imgPath, x, y) {
  var img = new Image();
  img.src = imgPath;
  img.onload = function(){
    /*読み込み終了後ここで画像を加工して表示する*/
    var temp = document.createElement('canvas');
    var context = temp.getContext('2d');
    var w = img.width;
    var h = img.height;
    temp.width = w;
    temp.height = h;
    context.drawImage(img, x, y, temp.width, temp.height);
    var src = context.getImageData(0,0,temp.width,temp.height);
    var imgData = context.createImageData(temp.width, temp.height);
    for (var i = 0; i <= temp.height * 4; i += 4) {
      for (var j = 0; j <= temp.width * 4; j += 4) {
        if (j % 12 == 0 && i % 12 == 0) {
          var index = i * temp.width + j;
          var color = src.data[index] +  ', ' + src.data[index + 1] + ', ' + src.data[index + 2];
          var bit = new BitWork(ctx, j, i, 0, 0, color);
          bit.draw();
          console.log(j + ", " + i);
        }
      }
    }
  }
}

// 画像を花火に
function ImageWorks(ctx, x, y, imageData) {
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.counter = size * 3;
  this.fires = [];
  this.img = imageData;
}

ImageWorks.prototype.createFire = function () {
  // for (var i = 0; i < number; i++) {
  //   this.bits.push(new BitWork(this.ctx, this.x, this.y, i * 11, 6, "106, 255, 106"));
  // }
  // for (var i = 0; i < 24; i++) {
  //   this.bits.push(new BitWork(this.ctx, this.x, this.y, i * 15 + 5, 5, "106, 255, 106"));
  // }
  // for (var i = 0; i < 18; i++) {
  //   this.bits.push(new BitWork(this.ctx, this.x, this.y, i * 20, 4, "106, 106, 255"));
  // }
  // for (var i = 0; i < 15; i++) {
  //   this.bits.push(new BitWork(this.ctx, this.x, this.y, i * 24 + 9, 3, "106, 106, 255"));
  // }
  // for (var i = 0; i < 12; i++) {
  //   this.bits.push(new BitWork(this.ctx, this.x, this.y, i * 30, 2, "106, 255, 106"));
  // }
  // for (var i = 0; i < 9; i++) {
  //   this.bits.push(new BitWork(this.ctx, this.x, this.y, i * 40 + 3, 1, "106, 255, 106"));
  // }
  // for (var i = 0; i < 1; i++) {
  //   this.bits.push(new BitWork(this.ctx, this.x, this.y, 0, 0, "106, 106, 255"));
  // }
};

ImageWorks.prototype.render = function () {
  if ( this.counter === 50) {
    // 試しにスピードの調整をしてみた
    this.fires.forEach(function(e){
      e.speed /= 2;
    });
  } else if ( this.counter === 30 ) {
    this.fires.forEach(function(e){
      e.speed /= 2;
    });
  } else if ( this.counter <= 0 ) {
    // 爆発終了
    // 配列からの分離
    var index = $.inArray(this, fireworks);
    fireworks.splice(index, 1);
  }

  this.draw();

  this.counter--;
};

ImageWorks.prototype.draw = function () {
  this.fires.forEach(function(e){ e.updatePosition(); })
  this.fires.forEach(function(e){ e.render(); });
};

// 火花クラス
function BitWork(ctx, x, y, angle, speed, color) {
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.speed = speed / 3;
  this.height = H / 3 + parseInt(Math.random() * 3) * 33;
  this.size = size / 2;
  this.color = color;
  this.angle = angle;
  this.radians = this.angle * Math.PI / 180;
  this.g = 0.0001;
  this.t = 0;
  this.alpha = 1;
}

BitWork.prototype.render = function () {
  this.updatePosition();
  this.draw();
};

BitWork.prototype.updatePosition = function () {
  this.explode();
};

BitWork.prototype.draw = function () {
  ctx = this.ctx;
  ctx.beginPath();
  ctx.fillStyle = this.gradient();
  ctx.arc( this.x, this.y, this.size, Math.PI*2, false); // 位置指定
  ctx.fill();
  ctx.closePath();


};

// 爆発メソッド
BitWork.prototype.explode = function (first_argument) {
  this.x += Math.cos(this.radians) * this.speed;
  this.y += Math.sin(this.radians) * this.speed;
  this.t++;
  // 重力加速度の計算
  this.y += 1 / 2 * + this.g * (this.t * 0.7) * (this.t * 0.7);
  this.counter--;
};

BitWork.prototype.gradient = function(){
// function gradient(ctx, r, g, b, a) {
  // var col = "153, 255, 106";
  var g = ctx.createRadialGradient( this.x, this.y, 0, this.x, this.y, this.size);
  if (this.t >= 80 ) {
    this.alpha -= 0.01;
  }

  // Final Step（Step7） 光の見え方の改造
  g.addColorStop(0,   "rgba(" + this.color + ", " + this.alpha + ")");
  g.addColorStop(0.1, "rgba(" + this.color + ", " + this.alpha * 0.4 + ")");
  g.addColorStop(0.9, "rgba(" + this.color + ", " + this.alpha * 0.1 + "");
  g.addColorStop(1,   "rgba(" + this.color + ", 0.0)");

  return g;
}


// onload = function() {
//   imageDraw();
// }

function imageDraw() {
  var img = new Image();
  imgPath = "./images/card.png";
  img.src = imgPath;
  // img.crossOrigin = 'Anonymous';
  img.onload = function(){
    /*読み込み終了後ここで画像を加工して表示する*/
    var temp = document.createElement('canvas');
    var context = temp.getContext('2d');
    var w = img.width;
    var h = img.height;
    temp.width = w;
    temp.height = h;
    context.drawImage(img, 0,0,temp.width,temp.height);
    // ctx.drawImage(img, 0, 0);
    var src = context.getImageData(0,0,temp.width,temp.height);
    //var src = ctx.getImageData(0,0,temp.width,temp.height);
    var imgData = context.createImageData(temp.width, temp.height);
    for (var i = 0; i < src.data.length; i += 4) {
      if (i % 16 == 0) {
        var pixel = parseInt((src.data[i] + src.data[i + 1] + src.data[i + 2]) / 3);
        imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = pixel;
        imgData.data[i + 3] = src.data[i + 3];

        var bit = new BitWork(ctx, i / 4, i / (temp.width * 4), angle, speed, imgData.data[i] +  ', ' + imgData.data[i + 1] + ', ' + imgData.data[i + 2]);
        bit.draw();
      }
    }
    //ctx.putImageData(imgData, 0, 0);
  }
  //読み込んだ画像ソースを入れる

}
