import { BaseModel } from "./BaseModel";
import { getFromStorage, addToStorage } from "../utils";

export class User extends BaseModel {
  constructor(login, password, role = false) {
    super();
    this.login = login;
    this.password = password;
    this.role = role;
    this.storageKey = "users";
  }
  get hasAccess() {
    let users = getFromStorage(this.storageKey) || [];
    if (users.length === 0) return false;

    return users.some(user => user.login === this.login && user.password === this.password)
  }
  get isAdmin() {
    return this.role;
  }
  static save(user) {
    try {
      let users = addToStorage(user, user.storageKey) || []

      const existingUserIndex = users.findIndex(u => u.login === user.login)

      if (existingUserIndex !== -1) {
        users[existingUserIndex] = user
      } else {
        users.push(user)
      }

      localStorage.setItem(user.storageKey, JSON.stringify(users))
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }

  static remove(user) {
    try {
      let users = getFromStorage(user.storageKey);
      users = users.filter(u => u.login !== user.login);
      localStorage.setItem(user.storageKey, JSON.stringify(users));
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}