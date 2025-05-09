// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000
// serving static file 
app.use(express.static('public'));
// chat message 
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
  const time = new Date().toLocaleTimeString();
  const fullMsg = `[${time}] <${socket.username || 'Guest'}> ${msg}`;
  socket.broadcast.emit('chat message', fullMsg);
  socket.emit('chat message', fullMsg); // only once to sender
});


  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});



// route handling (fallback)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
//socket.io real-time logic 
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join room', ({ room, prevRoom }) => {
    socket.leave(prevRoom);
    socket.join(room);
    console.log(`User switched to room: ${room}`);
  });

  socket.on('chat message', (data) => {
    io.to(data.room).emit('chat message', data); // emit only in that room
  });
// Detecting Disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
//Starting the Server
http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
