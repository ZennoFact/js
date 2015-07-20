function Observer() {
  this.listeners = {};
}

Observer.prototype.on = function (event, func) {
  if (! this.listeners[event] ) {
    this.listeners[event] = [];
  }
  this.listeners[event].push(func);
};

Observer.prototype.off = function (evvent, func) {
  var ref = this.listeners[event],
      len = ref.length;
  for (var i = 0; i < len; i++) {
    var listeners = this.listeners[i];
    if (listeners === func) {
      this.listeners.splice(i, 1);
    }
  };
}

Observer.prototype.trigger = function (event) {
  var ref = this.listeners[event];

  for (var i = 0, len = ref.length; i < len; i++) {
    var listener = ref[i];
    if (typeof listener === "function") {
      listener();
    }
  }
};

var observer = new Observer();
var greet = function () {
  console.log("Good morning!");
};
observer.on("morning", greet);
observer.trigger("morning");

var seyEvening = function () {
  console.log("Goog Evening!");
}
observer.on("evening", seyEvening);
observer.trigger("evening");
