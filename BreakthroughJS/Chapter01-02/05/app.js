function createCounter() {
  var count = 0;
  return function() {
    count++;
    console.log(count);
  }
}

var counter1 = createCounter();
counter1();
counter1();
counter1();

var counter2 = createCounter();
counter2();
counter2();
counter2();

count = 100;

counter1();
