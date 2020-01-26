import React, { useState, useEffect } from "react"
import queryString from "query-string"
import io from "socket.io-client"

let socket

export default function Chat({ location }) {
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")
  const ENDPOINT = "localhost:1234"

  useEffect(() => {
    const { name, room } = queryString.parse(location.search)

    socket = io(ENDPOINT)

    socket.emit("join", { name, room }, () => {})

    return () => {
      socket.emit("disconnect")
      socket.off()
    }

    setName(name)
    setRoom(room)
  }, [ENDPOINT, location.search])

  return (
    <div>
      <h1>chat</h1>
    </div>
  )
}
