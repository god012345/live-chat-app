// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000
// serving static file 
app.use(express.static('public'));
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
    io.on('connection', (socket) => {
  socket.on('chat message', (data) => {
    socket.to(data.room).emit('chat message', data); // 🔁 send to others
    socket.emit('chat message', data);               // 🧍 send once to sender
  });
});
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
