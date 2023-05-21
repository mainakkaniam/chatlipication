const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http').createServer(app);
const PORT = process.env.PORT || 4000;
const socketIO = require('socket.io')(http, {
  cors: {
    origin: "https://chatlipication-9ufl.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  }
});

app.use(cors());

let users = [];

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  
  socket.on("message", data => {
    socketIO.emit("messageResponse", data);
  });

  socket.on("typing", data => {
    socket.broadcast.emit("typingResponse", data);
  });

  socket.on("newUser", data => {
    users.push(data);
    socketIO.emit("newUserResponse", users);
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    users = users.filter(user => user.socketID !== socket.id);
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello" });
});

http.listen( "chatlipication-9ufl.vercel.app", () => {
  console.log(`Server listening on chatlipication-9ufl.vercel.app`);
});
