function Human(name) {
  this.name = name;
}

Human.prototype.great = function () {
  console.log("Hello, my name is " + this.name);
};

var isao = new Human("Isao");
isao.great();

var yuki = new Human("Yuki");
yuki.great();
