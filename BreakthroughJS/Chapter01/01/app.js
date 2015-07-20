function Human (name) {
  this.name = name;
}

Human.prototype.greet = function() {
  console.log('Hello' + this.name);
};

var zenno = new Human('zenno');
zenno.greet();
