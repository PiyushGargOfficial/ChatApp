const express = require('express');
const socketio = require('socket.io');
const chalk = require('chalk');
const http = require('http');
const PORT = process.env.PORT || 1234;

const app = express();

//Routers
const router = require('./router');

//Middlewares
app.use(router);

const server = http.createServer(app);

const io = socketio(server);

io.on("connection", (socket) => {
    console.log("We have a new connection..");

    socket.on("join", ({
        name,
        room
    }, callback) => {
        console.log(name, room);

    })

    socket.on('disconnect', () => {
        console.log("user has left..");
    })
})

server.listen(PORT, () => {
    console.log(chalk.red(`Server has started on PORT : ${PORT}`))
})