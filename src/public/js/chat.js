const socket = io()
let _messageTemplate = document.getElementById("message-template").innerHTML
let _newMemberTemplate = document.getElementById("new-member-template").innerHTML;
let _memberLeftTempalte = document.getElementById("member-left-template").innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// helper functions
let timeStampMessage = function ({ username, message }) {
    var messageStamp = new Date().getTime()
    return {
        username,
        message,
        createdAt: moment(messageStamp).format('LTS')
    }
}

let newMember = function (name) {
    var messageStamp = new Date().getTime()
    return {
        name,
        createdAt: moment(messageStamp).format('LTS')
    }
}

//regular text messages
document.getElementById("btnSendMessage").addEventListener('click', () => {
    const message = document.getElementById("txtMessage").value;
    socket.emit("new_message", { username, room, message })

})

socket.on('new_message', ({ username, message }) => {
    const renderedMessage = Mustache.render(_messageTemplate, timeStampMessage({ username, message }))
    document.getElementById('messages').insertAdjacentHTML('beforeend', renderedMessage)
})

socket.on('location_shared_broadcast_message', (data) => {
    console.log(data);
})

function emitLocation(position) {
    socket.emit('share_location', `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`, () => {
        console.log('Location Delivered')
    })
}


//joining and leaving
socket.on('new_member_joined', (username) => {
    console.log("new member joined") 
    const renderedMessage = Mustache.render(_newMemberTemplate, newMember(username))
    document.getElementById('messages').insertAdjacentHTML('beforeend', renderedMessage)
})

socket.on('member_left', (data) => {
    const content = Mustache.render(_memberLeftTempalte, {message : data})
    document.getElementById("messages").insertAdjacentHTML("beforeend", content)
})



function showError() {
    console.log('Somethign wrong with getting the location')
}

document.getElementById('btnLocation').addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Permission denied to cant get location')
    } else {
        navigator.geolocation.getCurrentPosition(emitLocation, showError)
    }
})

socket.emit('join', { username, room })