const express = require('express')
const http = require('http')
const socket = require('socket.io')
const Filter = require('bad-words')
const usermanager = require('./utils/user-manager')

const filter = new Filter()
const app = express()
const server = http.createServer(app)

const staticPath = __dirname + "/public";
const port = process.env.PORT || 3000
app.use(express.static(staticPath))

const io = socket(server);
io.on('connection', (socket) => {

    //joining and leaving
    socket.on('join', ({ username, room }) => {
        const user = usermanager.addUser({ id: socket.id, username, room })
        socket.join(user.room)
        socket.to(user.room).emit('new_member_joined', user.username)
    })

    socket.on('disconnect', () => {
        const user = usermanager.findById(socket.id)

        if(user){
            usermanager.removeUserById(user.id)
            socket.to(user.room).emit('member_left', `${user.username} has left!`)
        }
    })

    //sharing messages
    socket.on('share_location', (link, callback) => {
        callback()
        socket.broadcast.emit('location_shared_broadcast_message', `A user shared this location: ${link}`)
    })

    socket.on('new_message', ({ username, room, message }) => {
        io.to(room).emit('new_message', { username, message })
    })
})

server.listen(port, () => {
    console.log("server listening on port ", port)
})
