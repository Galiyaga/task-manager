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

document.addEventListener('click', (e) => {
  const addReady = e.target.closest("#add-task-ready");
  const select = document.querySelector("#select");
  if (addReady) {
    let readyContainer = document.querySelector("#ready-task-container");
    let backlogContainer = document.querySelector("#backlog-task-container");
    let backlogTasks = backlogContainer.querySelectorAll(".task").forEach(task => {
      const option = document.createElement('option')
      option.className = "task";
      option.textContent = backlogTasks.innerHTML;
      select.appendChild(backlogTasks);
    });
  }
})
// const addInProgress = document.querySelector("#add-task-inprogress")
// const addFinished = document.querySelector("#add-task-finished")

document.addEventListener('click', (e) => {
  const addBacklog = e.target.closest("#add-task-backlog");
  const submitBacklog = e.target.closest("#submit-backlog");

  if (addBacklog) {
    document.querySelector('#new-task').innerHTML = newTask
    addBacklog.classList.add("hidden");
    document.querySelector("#task-input").focus();
  }
  if (submitBacklog) {
    document.querySelector("#add-task-backlog").classList.remove("hidden");
    function saveInputValue() {
      let inputValue = document.querySelector("#task-input").value;

      let newTaskDiv = document.createElement("div");
      newTaskDiv.className = "task";
      newTaskDiv.textContent = inputValue;

      if (inputValue.length) {
        document.querySelector("#backlog-task-container").appendChild(newTaskDiv);
      }

      document.querySelector("#task-input").remove();
    }
    saveInputValue();

    document.querySelector('#submit-backlog').remove();

  }
});


