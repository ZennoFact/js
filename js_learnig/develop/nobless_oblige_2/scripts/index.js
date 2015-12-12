window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(cb) {
    setTimeout(cb, 17);
  };

// サイズやスピードを変更するのはここの情報を変更するよ。
var speed = 1; // 結晶の成長速度　初期値 8
var size = 4; // 結晶の幅　初期値 8

var canClick = true;

var canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  vertexArray = [],
  timeline = [],
  W = innerWidth,
  H = innerHeight,
  step = 0,
  deadline = 0,
  center = {
    x: W / 2,
    y: H / 2
  },
  life = 10;

// step1-1 -> canvas.width = W;
// step1-2 -> canvas.height = H;
canvas.width = W;
canvas.height = H;
// step2 -> addKeydownEvent();
addKeydownEvent();

var counter = 0;
// 描画サイクルを開始する
function render() {
  // step3 -> ctx.clearRect(0,0,W,H);
  // 今回は，移動ではないので，消さない
  // ctx.clearRect(0,0,W,H);

  if (20 < step) return false;

  fulcrumArray.forEach(function(e) {
    e.render();
  });


  // requestanimationframeをつかって、ブラウザの更新のタイミングに実行する
  requestAnimationFrame(render);
}

// step -> 4
var shadeColor = newColor(64, 32, 255);

// 描画の開始
render();



function newColor(r, b, g) {
  return r + ", " + b + ", " + g;
}

function getDistance(x1, x2, y1, y2) {　
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}



// キーボード入力の取得
function addKeydownEvent() {
  $(window).keydown(function(e) {
    if (e.keyCode === 116) {
      location.reload();
    } else if (e.keyCode === 32) {
      // Spaceキー操作時の処理
      $("#test").text('Pressed Space Key!!');
    }
    if (canClick) {
      convertToCharacter(e.keyCode);
      convertToBit(e.keyCode);
    }
  });
}
// TODO: このメソッドは，分割すべきなのかどうか。intのままで面白いことできそうなら，必要ないけれど，入力された文字も表示して，入力するたびに「儚く」散っていけばいいななんて思う
var MAX;
var MIN;

function convertToCharacter(keyCode) {
  if (keyCode < 65 || 90 < keyCode) return false;
  counter++;
  $("#test").text('#' + counter + ':' + String.fromCharCode(keyCode) + ':' + keyCode);
}

function convertToBit(keyCode) {
  // TODO: set currenttime - starttime
  var time = 0;
  fulcrumArray = [];
  switch (keyCode) {
    case 65:
      if (step === 0) {
        // for (var i = 0; i < 60; i++) {
        //   fulcrumArray.push(new Bit(context, keyCode, center.x, center.y, time, step, i * 60, i * 60));
        // }

        
      } else {

      }
      step++;
      break;
    case 66:
      if (step === 0) {
        var bitData = generatData(data[keyCode].first_type);
        for (var i = 0; i < 60; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 60, data[keyCode].first_type, 10, i * 60));
        }
      } else {
        var bitData = generatData(data[keyCode].second_type);
        for (var i = 0; i < vertexArray.length; i++) {
          fulcrumArray.push(new Bit(context, vertexArray[i].x, vertexArray[i].y, bitData.size, bitData.speed, keyCode, time, vertexArray[i].angle, bitData.type, 10, vertexArray[i].baseAngle));
        }
        vertexArray = [];
      }
      step++;
      break;
    case 67:
      if (step === 0) {
        for (var i = 0; i < 6; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 60, "SIX_TRUE", 10, i * 60));
        }
      } else {
        var branch = -45;
        var i = 0;
        for (var j = 0; j < vertexArray.length * 3; j++) {
          fulcrumArray.push(new Bit(context, vertexArray[i].x, vertexArray[i].y, size, speed, keyCode, time, vertexArray[i].angle + branch, "TREE_TRUE", 10, vertexArray[i].baseAngle));
          branch += 45;
          if (j % 3 === 2) {
            i++;
            branch = -45;
          }
        }
        vertexArray = [];
      }
      step++;
      break;
    case 68:
      if (step === 0) {
        for (var i = 0; i < 6; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 60, "SIX_TRUE", 10, i * 60));
        }    console.log("test");
      } else {
        var branch = -35;
        var i = 0;
        for (var j = 0; j < vertexArray.length * 2; j++) {
          fulcrumArray.push(new Bit(context, vertexArray[i].x, vertexArray[i].y, size, speed * 2, keyCode, time, vertexArray[i].angle + branch, "SQUEA_TRUE", 10, vertexArray[i].baseAngle));
          branch *= -1;
          if (j % 2 === 1) {
            i++;
          }
        }
        vertexArray = [];
      }
      step++;
      break;
    case 69:
      if (step === 0) {
        for (var i = 0; i < 4; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 90, "FOUR_TRUE", 10, i * 90));
        }
      } else {
        var branch = 40;
        var i = 0;
        for (var j = 0; j < vertexArray.length * 2; j++) {
          fulcrumArray.push(new Bit(context, vertexArray[i].x, vertexArray[i].y, size, speed, keyCode, time, vertexArray[i].angle + branch, "TWO_TRUE", 10, vertexArray[i].baseAngle));
          if (j % 2 === 1) {
            i++;
          }
          branch *= -1;
        }
        vertexArray = [];
      }
      step++;
      break;
    case 70:
      if (step === 0) {
        for (var i = 0; i < 4; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 90, "FOUR_TRUE", 10, i * 90));
        }
      } else {
        var branch = 40;
        var i = 0;
        for (var j = 0; j < vertexArray.length * 2; j++) {
          fulcrumArray.push(new Bit(context, vertexArray[i].x, vertexArray[i].y, size, speed, keyCode, time, vertexArray[i].angle + branch, "TWO_TRUE", 10, vertexArray[i].baseAngle));
          if (j % 2 === 1) {
            i++;
            console.log("count up");
          }
          console.log("miss");
          branch *= -1;
        }
        vertexArray = [];
      }
      step++;
      break;
    case 71:
      if (step === 0) {
        for (var i = 0; i < 4; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 90, "FOUR_TRUE", 10, i * 90));
        }
      } else {
        var branch = 40;
        var i = 0;
        for (var j = 0; j < vertexArray.length * 2; j++) {
          fulcrumArray.push(new Bit(context, vertexArray[i].x, vertexArray[i].y, size, speed, keyCode, time, vertexArray[i].angle + branch, "TWO_TRUE", 10, vertexArray[i].baseAngle));
          if (j % 2 === 1) {
            i++;
            console.log("count up");
          }
          console.log("miss");
          branch *= -1;
        }
        vertexArray = [];
      }
      step++;
      break;
    case 72:
      if (step === 0) {
        for (var i = 0; i < 4; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 90, "FOUR_TRUE", 10, i * 90));
        }
      } else {
        var branch = 40;
        var i = 0;
        for (var j = 0; j < vertexArray.length * 2; j++) {
          fulcrumArray.push(new Bit(context, vertexArray[i].x, vertexArray[i].y, size, speed, keyCode, time, vertexArray[i].angle + branch, "TWO_TRUE", 10, vertexArray[i].baseAngle));
          if (j % 2 === 1) {
            i++;
            console.log("count up");
          }
          console.log("miss");
          branch *= -1;
        }
        vertexArray = [];
      }
      step++;
      break;
    case 73:
      if (step === 0) {
        for (var i = 0; i < 3; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 120, "SIX_WAY", 10, i * 120));
        }
      } else {
        var branch = 30;
        var i = 0;
        for (var j = 0; j < vertexArray.length * 2; j++) {
          fulcrumArray.push(new Bit(context, vertexArray[i].x, vertexArray[i].y, size, speed, keyCode, time, vertexArray[i].baseAngle + branch, "TWO_FALSE", 10, vertexArray[i].baseAngle));
          if (j % 2 === 1) {
            i++;
            console.log("count up");
          }
          console.log("miss");
          branch *= -1;
        }
        vertexArray = [];
      }
      step++;
      break;
    case 74:
      if (step === 0) {
        for (var i = 0; i < 3; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 120, "SIX_WAY", 10, i * 120));
        }
      } else {
        var branch = 30;
        var i = 0;
        for (var j = 0; j < vertexArray.length * 2; j++) {
          fulcrumArray.push(new Bit(context, vertexArray[i].x, vertexArray[i].y, size, speed, keyCode, time, vertexArray[i].baseAngle + branch, "TWO_FALSE", 10, vertexArray[i].baseAngle));
          if (j % 2 === 1) {
            i++;
            console.log("count up");
          }
          console.log("miss");
          branch *= -1;
        }
        vertexArray = [];
      }
      step++;
      break;
    case 75:
      if (step === 0) {
        for (var i = 0; i < 3; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 120, "SIX_WAY", 10, i * 120));
        }
      } else {
        var branch = 30;
        var i = 0;
        for (var j = 0; j < vertexArray.length * 2; j++) {
          fulcrumArray.push(new Bit(context, vertexArray[i].x, vertexArray[i].y, size, speed, keyCode, time, vertexArray[i].baseAngle + branch, "TWO_FALSE", 10, vertexArray[i].baseAngle));
          if (j % 2 === 1) {
            i++;
            console.log("count up");
          }
          console.log("miss");
          branch *= -1;
        }
        vertexArray = [];
      }
      step++;
      break;
    case 76:
      if (step === 0) {
        for (var i = 0; i < 3; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 120, "SIX_WAY", 10, i * 120));
        }
      } else {
        var branch = 30;
        var i = 0;
        for (var j = 0; j < vertexArray.length * 2; j++) {
          fulcrumArray.push(new Bit(context, vertexArray[i].x, vertexArray[i].y, size, speed, keyCode, time, vertexArray[i].baseAngle + branch, "TWO_FALSE", 10, vertexArray[i].baseAngle));
          if (j % 2 === 1) {
            i++;
            console.log("count up");
          }
          console.log("miss");
          branch *= -1;
        }
        vertexArray = [];
      }
      step++;
      break;
    case 77:
      if (step === 0) {
        for (var i = 0; i < 3; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 120, "SIX_WAY", 10, i * 120));
        }
      } else {
        for (var i = 0; i < vertexArray.length; i++) {

        }
        vertexArray = [];
      }
      step++;
      break;
    case 78:
      if (step === 0) {
        for (var i = 0; i < 5; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 72, "SIX_WAY", 10, i * 72));
        }
      } else {
        for (var i = 0; i < vertexArray.length; i++) {

        }
        vertexArray = [];
      }
      step++;
      break;
    case 79:
      if (step === 0) {
        for (var i = 0; i < 6; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 60, "SIX_WAY", 10, i * 60));
        }
      } else {
        for (var i = 0; i < vertexArray.length; i++) {

        }
        vertexArray = [];
      }
      step++;
      break;
    case 80:
      if (step === 0) {
        for (var i = 0; i < 3; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 120, "SIX_WAY", 10, i * 120));
        }
      } else {
        for (var i = 0; i < vertexArray.length; i++) {

        }
        vertexArray = [];
      }
      step++;
      break;
    case 81:
      if (step === 0) {
        for (var i = 0; i < 4; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 90, "SIX_WAY", 10, i * 90));
        }
      } else {
        for (var i = 0; i < vertexArray.length; i++) {

        }
        vertexArray = [];
      }
      step++;
      break;
    case 82:
      if (step === 0) {
        for (var i = 0; i < 5; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 72, "SIX_WAY", 10, i * 72));
        }
      } else {
        for (var i = 0; i < vertexArray.length; i++) {

        }
        vertexArray = [];
      }
      step++;
      break;
    case 83:
      if (step === 0) {
        for (var i = 0; i < 6; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 60, "SIX_WAY", 10, i * 60));
        }
      } else {
        for (var i = 0; i < vertexArray.length; i++) {

        }
        vertexArray = [];
      }
      step++;
      break;
    case 84:
      if (step === 0) {
        for (var i = 0; i < 5; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 72, "SIX_WAY", 10, i * 72));
        }
      } else {
        for (var i = 0; i < vertexArray.length; i++) {

        }
        vertexArray = [];
      }
      step++;
      break;
    case 85:
      if (step === 0) {
        for (var i = 0; i < 9; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 40, "SIX_WAY", 10, i * 40));
        }
      } else {
        for (var i = 0; i < vertexArray.length; i++) {

        }
        vertexArray = [];
      }
      step++;
      break;
    case 86:
      if (step === 0) {
        for (var i = 0; i < 6; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 120, "SIX_WAY", 10, i * 60));
        }
      } else {
        for (var i = 0; i < vertexArray.length; i++) {

        }
        vertexArray = [];
      }
      step++;
      break;
    case 87:
      if (step === 0) {
        for (var i = 0; i < 5; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 72, "SIX_WAY", 10, i * 72));
        }
      } else {
        for (var i = 0; i < vertexArray.length; i++) {

        }
        vertexArray = [];
      }
      step++;
      break;
    case 88:
      if (step === 0) {
        for (var i = 0; i < 4; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 90, "SIX_WAY", 10, i * 90));
        }
      } else {
        for (var i = 0; i < vertexArray.length; i++) {

        }
        vertexArray = [];
      }
      step++;
      break;
    case 89:
      if (step === 0) {
        for (var i = 0; i < 3; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 120, "SIX_WAY", 10, i * 120));
        }
      } else {
        for (var i = 0; i < vertexArray.length; i++) {

        }
        vertexArray = [];
      }
      step++;
      break;
    case 90:
      if (step === 0) {
        for (var i = 0; i < 6; i++) {
          fulcrumArray.push(new Bit(context, center.x, center.y, size, speed, keyCode, time, i * 120, "SIX_WAY", 10, i * 60));
        }
      } else {
        for (var i = 0; i < vertexArray.length; i++) {

        }
        vertexArray = [];
      }
      step++;
      break;
    default:
      console.log('This keycode not used');
  }
}
