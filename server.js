// Based off of Shawn Van Every's Live Web

// HTTP Portion
var http = require("http");
// URL module
var url = require("url");
var path = require("path");

// Using the filesystem module
var fs = require("fs");

var server = http.createServer(handleRequest);
// server.listen(9000);
// console.log('Server started on port 9000');
var port_number = server.listen(process.env.PORT || 9000);

function handleRequest(req, res) {
  // What did we request?
  var pathname = req.url;

  // If blank let's ask for index.html
  if (pathname == "/") {
    pathname = "/index.html";
  }

  // Ok what's our file extension
  var ext = path.extname(pathname);

  // Map extension to file type
  var typeExt = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
  };

  // What is it?  Default to plain text
  var contentType = typeExt[ext] || "text/plain";

  // User file system module
  fs.readFile(
    __dirname + pathname,

    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500);
        return res.end("Error loading " + pathname);
      }

      // Otherwise, send the data, the contents of the file
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  );
}

// Counting simultaneous painters
var numPainters = 0;

// Holder for data on previous paint strokes
history = [];

// WebSocket
var io = require("socket.io").listen(server);

// Register a callback function to run after an individual connection
// Run for each individual user that connects
io.sockets.on(
  "connection",
  function (socket) {
    // When the visitor paints on the canvas the details are sent to this function
    // to broadcast the painting, then adds to the array tracking drawing the history
    socket.on("painterPusher", function (data) {
      console.log(
        "Server Received: 'dotter' " +
          data.x +
          " " +
          data.y +
          " " +
          data.z +
          " " +
          data.red
      );

      // Send it to all other clients
      // Removed local painter and am now painting from broadcast data
      // * * * * * * * *
      io.emit("painter", data);
    });

    // Incrementing number of simultaneous painters
    numPainters++;
    io.emit("counter", { message: numPainters });

    // Decrementing simultaneous painters
    socket.on("disconnect", function () {
      // console.log("Client has disconnected");

      numPainters--;
      io.emit("counter", { message: numPainters });
      // console.log(numPainters + " People Painting");
    });
  }
);
