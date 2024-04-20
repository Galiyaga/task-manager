import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import newTask from "./templates/newTask.html";
import { User } from "./models/User";
import {generateAdminUser, generateSimpleUser, getFromStorage} from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";
import {Task} from "./models/Task"

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

const selectBlock = document.querySelector('#select-block');
const readyContainer = document.querySelector('#ready-task-container');
const select = document.querySelector("#select");
let tasksInfo = [];
let addedTasksIds = [];

document.addEventListener('click', (e) => {
  const addBacklog = e.target.closest("#add-task-backlog");
  const submitBacklog = e.target.closest("#submit-backlog");
  const addReady = e.target.closest("#add-task-ready");
  
  if (addBacklog) {
    document.querySelector('#new-task').innerHTML = newTask
    addBacklog.classList.add("hidden");
    document.querySelector("#task-input").focus();
  }
  if (submitBacklog) {
    document.querySelector("#add-task-backlog").classList.remove("hidden");
    function saveInputValue() {
      let inputValue = document.querySelector("#task-input").value;
      if (inputValue.length) {
        const newTask = new Task(inputValue);

        let taskInfo = {
          title: newTask.text,
          id: newTask.id,
          userId: 'user123', 
          status: 'backlog'
        };

        tasksInfo.push(taskInfo);
        console.log(taskInfo)

        let newTaskDiv = document.createElement("div");
        newTaskDiv.className = "task";
        newTaskDiv.textContent = taskInfo.title;
        newTaskDiv.id = taskInfo.id; 
        document.querySelector("#backlog-task-container").appendChild(newTaskDiv);
      }

      document.querySelector("#task-input").remove();
    }
    saveInputValue();

    document.querySelector('#submit-backlog').remove();
  }

  if (addReady) {
    select.innerHTML = '';
    selectBlock.style.display = 'block';  
    readyContainer.insertBefore(selectBlock, null);
    tasksInfo.forEach(taskInfo => {
      if (!addedTasksIds.includes(taskInfo.id)) {
      const option = document.createElement('option')
      option.className = "option-item";
      option.textContent = taskInfo.title;
      option.id = taskInfo.id;
      select.appendChild(option);
      }
    });
  }
});

select.addEventListener('change', (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const selectedTask = selectedOption.value;
  
  addedTasksIds.push(selectedOption.id);
  addTaskToReadyContainer(selectedTask);
  select.removeChild(selectedOption);

});

function addTaskToReadyContainer(taskText) {
  let newTaskDiv = document.createElement('div');
  newTaskDiv.className = 'task'; 
  newTaskDiv.textContent = taskText;
  readyContainer.appendChild(newTaskDiv);
  selectBlock.style.display = 'none';
}

