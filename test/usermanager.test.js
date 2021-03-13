const usermanager = require('../src/utils/user-manager')

const userOne = {
    id: 1,
    username: 'mtouseef',
    room: 'myroom'
}

beforeEach(() => {
    usermanager.addUser(userOne)
})

test('shout not add user when username or room is empty', () => {
    const user = {
        username: '   ',
        room: ' '
    }
    const response = usermanager.addUser(user)
    expect(response.error).not.toBe(undefined)
})

test('should not add user if the username already exists', () => {
    const user = {
        username: 'mtouseef',
        room: 'myroom'
    }

    const response = usermanager.addUser(user)

    expect(response.error).toBe('user already exists')
})

test('should find a user successfully ', () => {
    usermanager.addUser(userOne)
    const user = usermanager.find(userOne.username)
    expect(user.username).toBe('mtouseef')
})

test('should find user by id', () => {
    const user = usermanager.findById(1);
    expect(user).not.toBeNull()
    expect(user.id).toBe(1)
})

test('should remove a user', () => {
    usermanager.removeUserById(1)
    const { error, user } = usermanager.findById(1);
    expect(user).toBe(undefined)
    expect(error).toBe('no user found')
})

test('should list all users', () => {
    const users = usermanager.list();
    expect(users).not.toBe(null)
    expect(users.length).toBe(1)
})

afterEach(() => {
    usermanager.removeAllUsers()
})



