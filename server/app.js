const express = require("express")
const socketio = require("socket.io")
const chalk = require("chalk")
const http = require("http")
const cors = require("cors")
const PORT = process.env.PORT || 1234

const app = express()

//Routers
const router = require("./router.js")
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js")

//Middlewares
app.use(router)
app.use(cors)
const server = http.createServer(app)

const io = socketio(server)

io.on("connection", socket => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room })
    if (error) return callback(error)

    socket.join(user.room)

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    })

    //Welcomes the user who has joined
    socket.emit("message", {
      user: "admin",
      text: `${user.name},Welcome to the room ${user.room}`
    })
    //Tells everyone accepts the user that he has joined
    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has joined!`
    })
    callback()
  })

  socket.on("sendMessage", (message, callback) => {
    //get user who sent the message :-
    const user = getUser(socket.id) //socket mentioned here is the specific socket passed above as the parameter.
    io.to(user.room).emit("message", {
      user: user.name,
      text: message
    })
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
    callback()
  })

  socket.on("disconnect", () => {
    const user = removeUser(socket.id)
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left!!`
      })
    }
  })
})

server.listen(PORT, () => {
  console.log(chalk.red(`Server has started on PORT : ${PORT}`))
})
