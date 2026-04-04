const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.static(path.join(__dirname, 'public')));

let users = {};
let messages = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    users[socket.id] = username;
    socket.emit('previousMessages', messages);
    socket.broadcast.emit('userJoined', username);
  });

  socket.on('chatMessage', (msg) => {
    const message = {
      username: users[socket.id],
      message: msg,
      timestamp: new Date().toLocaleTimeString()
    };
    messages.push(message);
    if (messages.length > 50) messages.shift();
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    if (users[socket.id]) {
      io.emit('userLeft', users[socket.id]);
      delete users[socket.id];
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🐦 SparrowChat running on port ${PORT}`);
});
