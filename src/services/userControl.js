import { User } from '../models/User'
import { getFromStorage } from '../utils'

export const addUser = (login, password, isAdmin = false) => {
    const newUser = new User(login, password, isAdmin);
    User.save(newUser)
}

export const removeUser = (login) => {
    const users = getFromStorage('users')
    const user = users.find(u => u.login === login)
    if (user) {
        User.remove(user)
    }
    
}