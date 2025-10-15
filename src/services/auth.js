import { appState } from "../app";
import { User } from "../models/User";
import {getFromStorage} from "../utils";


export const authUser = function (login, password) {
  const users = getFromStorage('users') || []
  const foundUser = users.find(el => el.login === login && el.password === password)

  if (!foundUser) {
    return false;
  } else {

    const user = new User(foundUser.login, foundUser.password, foundUser.admin)
    localStorage.setItem('user', JSON.stringify({
      login: user.login,
      password: user.password,
      admin: user.admin
    }))
    appState.currentUser = foundUser;

    return true;
  }
};
