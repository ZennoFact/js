// ウィンドウのリサイズ
var timer = false;
$(window).resize(function() {
  W = innerWidth;
  H = innerHeight;
  canvas.width = W;
  canvas.height = H;
});

function getColor(colorStyle) {
  if (colorStyle === 'random') {
    return colors[Math.floor(Math.random() * colors.length)];
  } else {
    return colorStyle;
  }
}


// NG
// function getFlash(color, default) {
//   if ( color === '42, 42, 42') {
//     return default;
//   } else {
//     return '42, 42, 42';
//   }
// }

var colors = ['235, 33, 66',
              '238, 101, 87',
              '2, 174, 220',
              '245, 142, 126',
              '141, 207, 63',
              '68, 222, 222',
              '248, 130, 60',
              '255, 212, 100',
              '242, 105, 100',
              '244, 244, 242',
              '255, 242, 0',
              '47, 205, 180',
              '14, 122, 196',
              '64, 170, 239',
              '88, 190, 137',
              '251, 168, 72',
              '242, 115, 152',
              '121, 209, 176',
              '253, 196, 79'];
