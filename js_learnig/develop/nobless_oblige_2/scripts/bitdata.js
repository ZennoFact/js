// function generatAngle(type) {
//   var angle = type.split('_', 1);
//   return parseInt(angle);
// }

function generatData(input, step) {
  var type = (step === 0) ? data[input].first_type : data[input].second_type;
  var sizeType = type.split('_')[1];
  var speed = (sizeType === 'big') ? 2 : 1;
  var size = (sizeType === 'big') ? 6 : 4;
  var draw = (step === 0) ? data[input].firstStep : data[input].secondStep;
  return {
    type: type,
    speed: speed,
    size: size,
    draw: draw
   }
}

var data = {
  65: {
      name: 'a',
      first_type: '6way_big',
      firstStep: function (ctx, pos, radian, speed) {
        ctx.beginPath();
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.moveTo(pos.x, pos.y);
        var newX = pos.x + Math.cos(radian) * speed;
        var newY = pos.y + Math.sin(radian) * speed;
        ctx.lineTo(newX, newY);
        ctx.stroke();
        ctx.closePath();
      },
      second_type: 'flower_big',
      secondStep: function () {

      }
  },
  66: {
      name: 'b',
      first_type: '6way_small',
      second_type: 'flower_small',
  },
  67: {
      name: 'c',
      first_type: 'hexagon_big',
      second_type: '',
  },
  68: {
      name: 'd',
      first_type: 'hexagon_small',
      second_type: '',
  },
  69: {
      name: 'e',
      first_type: 'hexgon-hexa_big',
      second_type: '',
  },
  70: {
      name: 'f',
      first_type: 'hexgon-hexa_small',
      second_type: '',
  },
  71: {
      name: 'g',
      first_type: 'hexagon-hexagram_big',
      second_type: '',
  },
  72: {
      name: 'h',
      first_type: 'hexagon-hexagram_small',
      second_type: '',
  },
  73: {
      name: 'i',
      first_type: 'hexagon-flower_big',
      second_type: '',
  },
  74: {
      name: 'j',
      first_type: 'hexagon-flower_big',
      second_type: '',
  },
  75: {
      name: 'k',
      first_type: 'mini-hexa_big',
      second_type: '',
  },
  76: {
      name: 'l',
      first_type: 'mini-hexa_small',
      second_type: '',
  },
  77: {
      name: 'm',
      first_type: 'hexagon-circle_big',
      second_type: '',
  },
  78: {
      name: 'n',
      first_type: 'hexagon-circle_small',
      second_type: '',
  },
  79: {
      name: 'o',
      first_type: 'flower_big',
      second_type: '',
  },
  80: {
      name: 'p',
      first_type: 'flower_small',
      second_type: '',
  },
  81: {
      name: 'q',
      first_type: '6way-leaf_big',
      second_type: '',
  },
  82: {
      name: 'r',
      first_type: '6way-leaf_small',
      second_type: '',
  },
  83: {
      name: 's',
      first_type: '6way-curve_big',
      second_type: '',
  },
  84: {
      name: 't',
      first_type: '6way-curve_small',
      second_type: '',
  },
  85: {
      name: 'u',
      first_type: 'hexagon-tri_big',
      second_type: '',
  },
  86: {
      name: 'v',
      first_type: 'hexagon-tri_small',
      second_type: '',
  },
  87: {
      name: 'w',
      first_type: 'hexagon-bigcircle_big',
      second_type: '',
  },
  88: {
      name: 'x',
      first_type: 'hexagon-bigcircle_small',
      second_type: '',
  },
  89: {
      name: 'y',
      first_type: '10way_big',
      second_type: '',
  },
  90: {
      name: 'z',
      first_type: '10way_small',
      second_type: '',
  }
}
