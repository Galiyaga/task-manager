export const getFromStorage = function (key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

export const addToStorage = function (obj, key) {
  const storageData = getFromStorage(key);
  storageData.push(obj);
  localStorage.setItem(key, JSON.stringify(storageData));
};

export const generateUser = function (User, userData) {
  // localStorage.clear();
  const user = new User(userData.login, userData.password, userData.admin);
  User.save(user);
};

export const generateSimpleUser = function (User) {
  generateUser(User, {
    login: 'Vasya',
    password: 'qwerty123',
    role: false
  })
}

export const generateAdminUser = function (User) {
  generateUser(User, {
    login: 'admin',
    password: '123',
    role: true
  })
}

export const checkAdminAccess = () => {
  const userData = JSON.parse(localStorage.getItem('user') || 'null')
  return userData && userData.role === true
}

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user') || 'null')
}