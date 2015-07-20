function Human(name) {
  this.name = name;
}

function greet(arg1, arg2) {
  console.log(arg1 + this.name + arg2);
}

var isao = new Human("Isao");
greet.call(isao, "Hello. My name is ", "!!");

greet.apply(isao, ["Hello. My name is ", "!!"])

var greetMorning = greet.bind(isao);
greetMorning("Hello. My name is ", "!!");
