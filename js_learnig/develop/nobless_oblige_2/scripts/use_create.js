var stage = new createjs.Stage("canvas");
var circle = new createjs.Shape();
circle.graphics.beginFill("#ffffff").drawCircle(0, 0, 50);
circle.x = 100;
circle.y = 100;
stage.addChild(circle);

console.log("#2");

stage.update();
