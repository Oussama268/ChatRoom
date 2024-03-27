
const express = require("express");
const app = express()
const http = require("http")
const { Server } = require("socket.io");
const cors = require('cors');




app.get('/socket.io', (req, res) => {
    app.use(cors())


const server = http.createServer(app);

const io = new Server(server , {
    cors:{
        origin : ["http://localhost:5173"],
        methods: ["GET" , "POST"]

    }
})


io.on("connection" , (socket) => {
    const newUser = {
        id: socket.id,
        name: `User ${socket.id.substring(0, 5)}`
      };
    socket.emit('user connected', newUser);

 
    socket.on('disconnect', () => {
        io.emit('user disconnected', newUser.id);
    });


    socket.on("send-message" ,  (messageArr) => {
        io.emit("receive-message" , messageArr)

    })

})
    
});








module.exports = app;
