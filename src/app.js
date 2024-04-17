import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import newTask from "./templates/newTask.html";
import { User } from "./models/User";
import {generateAdminUser, generateSimpleUser, getFromStorage} from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";

export const appState = new State();

const loginForm = document.querySelector("#app-login-form");

generateSimpleUser(User);
generateAdminUser(User);
checkForUsers()

function checkForUsers() {
  const users = getFromStorage('users')
  if (users.length) renderTaskBoard()
}

function renderTaskBoard() {
  const navbar = document.querySelector('#navbar')
  navbar.remove()

  document.querySelector("#content").innerHTML = taskFieldTemplate;
}

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  const authSuccess = authUser(login, password)

  if (authSuccess) {
    renderTaskBoard()
  } else {
    document.querySelector("#content").innerHTML = noAccessTemplate;
  }
});

// const addReady = document.querySelector("#add-task-ready")
// const addInProgress = document.querySelector("#add-task-inprogress")
// const addFinished = document.querySelector("#add-task-finished")

document.addEventListener('click', (e) => {
  const addBacklog = e.target.closest("#add-task-backlog");
  const submitBacklog = e.target.closest("#submit-backlog");

  if (addBacklog) {
    document.querySelector('#new-task').innerHTML = newTask
    addBacklog.classList.add("hidden")
  }
  if (submitBacklog) {
    document.querySelector("#add-task-backlog").classList.remove("hidden");
  }
});


