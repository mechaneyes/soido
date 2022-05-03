// Keep track of our socket connection
var socket;
var x, y, z;
var grow = 10;
var red, green, blue;
var diameter = 10;

var clickDot01;
var touchDot01;

// this syncs the window height
const syncWindowHeight = () => {
  document.documentElement.style.setProperty(
    "--window-inner-height",
    `${window.innerHeight}px`
  );
};

window.addEventListener("resize", syncWindowHeight);

function preventDefault(e) {
  e.preventDefault();
}

// let theCanvas

window.onload = (event) => {
  let static = document.querySelector(".container");
  console.log("static", static);

  // for iOS 15, prevents re-hiding of footer
  static.addEventListener("pointermove", (e) => {
    console.log("pointermove");
    e.preventDefault();
  });

  // bonus for iOS 14, prevents re-hiding of footer
  static.addEventListener("touchmove", (e) => {
    console.log("touchmove");
    e.preventDefault();
  });

  syncWindowHeight();

  document.documentElement.style.setProperty(
    "--window-inner-height",
    `${window.innerHeight}px`
  );

  document.body.style.setProperty(
    "--window-inner-height",
    `${window.innerHeight}px`
  );
};

function setup() {
  createCanvas(windowWidth, windowHeight);

  // background(11, 98, 145);
  background(0);

  clickDot01 = new ClickDot();
  touchDot01 = new TouchDot();

  // Start a socket connection to the server

  socket = io("http://localhost");
  // socket = io('http://soido.herokuapp.com/');

  // socket = io('https://lit-ravine-4197.herokuapp.com/');
  // socket = io('http://'+window.location.hostname);

  // This does the work of actually painting the dots to the screen
  socket.on(
    "painter",

    // When we receive data
    function (data) {
      console.log("Received: " + data.x + " " + data.y);

      // Draw a circle
      fill(data.red, data.green, data.blue);
      noStroke();
      ellipse(data.x, data.y, data.z, data.z);

      // Working to get dots to disappear, first in first out

      // var lastElement = history[history.length - 1];
      // console.log('lastElement: ' + history[history.length - 1]);

      // setTimeout(function() {
      //     // console.log(history[0]);
      //     clear();
      // // }, 1 * 60 * 1000);
      // }, 10000);
    }
  );

  // - - - - - DISABLING HISTORY - - - - -

  // Paint the history of previous stokes to the
  // screen when a new user connects. No blank canvas.

  // socket.on('connect', function(history) {
  //   console.log('connected');

  //   socket.on('new painter', function(data){
  //     console.log('data: ' + data);

  //     // console.log('data.message[i].x: ' + data.message[i].x);

  //     data.forEach( function (arrayItem) {

  //       console.log('arrayItem.x : ' + arrayItem.x);
  //       // console.log('arrayItem.y : ' + arrayItem.y);

  //       fill(arrayItem.red, arrayItem.green, arrayItem.blue);
  //       noStroke();
  //       ellipse(arrayItem.x, arrayItem.y, arrayItem.z, arrayItem.z);

  //     });

  //   });

  // });

  // Counting and emitting number of simultaneous users

  socket.on("counter", function (data) {
    // console.log('Num Painters: ' + data.message);

    var oneOrMore = data.message;

    if (data.message == 1) {
      $("#numUsers").html(data.message + " Painter");
    } else {
      $("#numUsers").html(data.message + " Painters");
    }
  });
}

function draw() {
  if (touchIsDown) {
    touchDot01.paintIt();
  } else if (mouseIsPressed) {
    clickDot01.paintIt();
  } else {
    clickDot01.resetIt();
    touchDot01.resetIt();
  }
}

function ClickDot() {
  // this.diameter = 10;

  this.paintIt = function () {
    this.red = random(255);
    this.green = random(255);
    this.blue = random(255);

    fill(this.red, this.green, this.blue);
    noStroke();

    // Removed painting here and now painting from broadcast data on receipt
    // ellipse(mouseX, mouseY, this.diameter, this.diameter);
    this.diameter += 3;
    senddeets(mouseX, mouseY, this.diameter, this.red, this.green, this.blue);
  };

  this.resetIt = function () {
    this.diameter = 10;
  };
}

function TouchDot() {
  this.paintIt = function () {
    this.red = random(255);
    this.green = random(255);
    this.blue = random(255);

    fill(this.red, this.green, this.blue);
    noStroke();

    // Removed painting here and now painting from broadcast data on receipt
    // ellipse(touchX, touchY, this.diameter, this.diameter);
    this.diameter += 16;
    senddeets(touchX, touchY, this.diameter, this.red, this.green, this.blue);
  };

  this.resetIt = function () {
    this.diameter = 10;
  };
}

// Function for sending to the socket

function senddeets(xpos, ypos, diam, red, green, blue) {
  // We are sending!
  console.log("dot details: " + xpos + " " + ypos + " " + diam);

  // Create an object
  var data = {
    x: xpos,
    y: ypos,
    z: diam,
    red: red,
    green: green,
    blue: blue,
  };

  // Send that object to the socket
  socket.emit("painterPusher", data);

  socket.emit("counter", data);
}
