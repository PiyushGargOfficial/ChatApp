import React, { useState, useEffect } from "react"
import queryString from "query-string"
import io from "socket.io-client"
import "./Chat.css"
import InfoBar from "../InfoBar/InfoBar"
import Input from "../Input/Input"
import Messages from "../Messages/Messages"

let socket

export default function Chat({ location }) {
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const ENDPOINT = "localhost:1234"

  useEffect(() => {
    const { name, room } = queryString.parse(location.search)

    socket = io(ENDPOINT)

    socket.emit("join", { name, room }, () => {})

    setName(name)
    setRoom(room)

    return () => {
      socket.emit("disconnect")
      socket.off()
    }
  }, [ENDPOINT, location.search])

  //we want to run this useEffect only one messages array changes.
  useEffect(() => {
    //backend is sending user and text on "message" and we are storing that in message variable.
    socket.on("message", message => {
      setMessages([...messages, message])
    })
  }, [messages])

  //Funtion for sending messages
  const sendMessage = event => {
    event.preventDefault()

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""))
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
        {/* <input
          onKeyPress={event =>
            event.key === "Enter" ? sendMessage(event) : null
          }
          value={message}
          onChange={event => setMessage(event.target.value)}
        /> */}
      </div>
    </div>
  )
}
