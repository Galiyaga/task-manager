import { appState } from "../app";
import { User } from "../models/User";
import { getFromStorage } from "../utils";

export const authUser = function (login, password) {
  const users = getFromStorage("users") || [];
  const foundUser = users.find(
    (el) => el.login === login && el.password === password
  );

  if (!foundUser) {
    return false;
  } else {
    const user = new User(foundUser.login, foundUser.password, foundUser.role);
    localStorage.setItem(
      "user",
      JSON.stringify({
        login: foundUser.login,
        password: foundUser.password,
        role: foundUser.role,
      })
    );
    appState.currentUser = user;

    return true;
  }
};

export const requireAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (!user || !user.admin) {
    alert('Недостаточно прав')
    return false
  }
  return true
}