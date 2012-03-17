(function() {
  var app, io, oprahs;

  oprahs = [];

  app = require('express').createServer();

  io = require('socket.io').listen(app);

  app.listen(15765);

  app.get('/', function(req, res) {
    return res.sendfile("" + __dirname + "/index.html");
  });

  io.sockets.on('connection', function(socket) {
    socket.on('new_oprah', function(data) {
      oprahs.push({
        id: socket.id,
        location: [Math.round(Math.random() * 600), Math.round(Math.random() * 400)]
      });
      return io.sockets.emit('populate_oprahs', oprahs);
    });
    socket.on('oprah_location_changed', function(data) {
      var _ref;
      if ((_ref = oprahs[socket.id]) != null) _ref.location = [data.x, data.y];
      return io.sockets.emit('oprah_location_changed', {
        id: socket.id,
        location: [data.x, data.y]
      });
    });
    socket.on('oprah_said_something_profound', function(message) {
      var _ref;
      if ((_ref = oprahs[socket.id]) != null) _ref.message = message;
      return io.sockets.emit('oprah_said_something_profound', {
        id: socket.id,
        message: message
      });
    });
    return socket.on('disconnect', function() {
      var newOprahs;
      newOprahs = [];
      oprahs.forEach(function(oprah) {
        if (oprah.id !== socket.id) return newOprahs.push(oprah);
      });
      oprahs = newOprahs;
      return io.sockets.emit('oprah_gone', {
        id: socket.id
      });
    });
  });

}).call(this);
