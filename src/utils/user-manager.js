const users = []

const addUser = (user) => {

    const username = trimStringValue(user.username)
    const roomname = trimStringValue(user.room)

    if (username.length === 0 || roomname.length === 0) {
        return { error: "username or roomname not provided" }
    }

    //check if the user exists already
    const existingUser = users.find((u) => { return u.username === user.username })
    if (existingUser) {
        return { error: 'user already exists' }
    }

    //add the user
    users.push(user)
    return user
}

const find = (username) => {
    const userFound = users.find(u => u.username === username)
    if (userFound) {
        return userFound
    }

    return { error: 'user not found' }
}

const removeUserById = (id) => {
    const index = users.indexOf({ id: id })
    if (index) {
        users.splice(index, 1)
    }
    return { error: 'user not found' }
}

const findById = (id) => {
    const user = users.find(user => user.id === id)
    if (user) {
        return user;
    }
    return { error: 'no user found' }
}

const removeAllUsers = () => {
    users.length = 0
}

function trimStringValue(user) {
    return user.trim()
}

function list() {
    return users;
}

module.exports = {
    addUser,
    removeAllUsers,
    find,
    list,
    findById,
    removeUserById
}
