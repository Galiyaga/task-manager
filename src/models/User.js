import { BaseModel } from "./BaseModel";
import { getFromStorage, addToStorage } from "../utils";

export class User extends BaseModel {
  constructor(login, password, admin) {
    super();
    this.login = login;
    this.password = password;
    this.admin = admin;
    this.storageKey = "users";
  }
  get hasAccess() {
    let users = getFromStorage(this.storageKey);
    if (users.length === 0) return false;
    for (let user of users) {
      if (user.login === this.login && user.password === this.password)
        return true;
    }
    return false;
  }
  get isAdmin() {
    return this.admin;
  }
  static save(user) {
    try {
      addToStorage(user, user.storageKey);
      return true;
    } catch (e) {
      throw new Error(e);
    }
  }
}
