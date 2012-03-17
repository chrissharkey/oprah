# Deploying a Node Knockout style app with Oprah, Node.js and Socket.io to Nodester

# A real programmer would have used the knobs at the front of the computer to put this in in binary by hand.

oprahs = []

app = require('express').createServer()
io = require('socket.io').listen app

app.listen 15765
app.get '/', (req, res) -> res.sendfile "#{__dirname}/index.html"

io.sockets.on 'connection', (socket) ->

  socket.on 'new_oprah', (data) ->
    oprahs.push id: socket.id, location: [Math.round(Math.random()*600), Math.round(Math.random()*400)]
    io.sockets.emit 'populate_oprahs', oprahs

  socket.on 'oprah_location_changed', (data) ->
    oprahs[socket.id]?.location = [data.x, data.y]
    io.sockets.emit 'oprah_location_changed', id: socket.id, location: [data.x, data.y] 

  socket.on 'oprah_said_something_profound', (message) ->
    oprahs[socket.id]?.message = message
    io.sockets.emit 'oprah_said_something_profound', id: socket.id, message: message
    
  socket.on 'disconnect', ->
    newOprahs = [];
    oprahs.forEach (oprah) -> newOprahs.push(oprah) unless oprah.id is socket.id
    oprahs = newOprahs;
    io.sockets.emit 'oprah_gone', id: socket.id
