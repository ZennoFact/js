// ウィンドウのリサイズ
var timer = false;
$(window).resize(function() {
  W = innerWidth;
  H = innerHeight;
  canvas.width = W;
  canvas.height = H;
});

function play() {
  $('#sound')[0].currentTime = 0;
  $('#sound')[0].play();
}
