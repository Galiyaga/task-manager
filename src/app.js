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

const selectBlock = document.querySelector('#select-block');
const readyContainer = document.querySelector('#ready-task-container');
const select = document.querySelector("#select");

const backlogTasks = [];
const readyTasks = [];

// Логика добавления в колонки
function addToBacklog () {
  const addBacklog = document.querySelector("#add-task-backlog");
  addBacklog.classList.add("hidden");

  document.querySelector('#new-task').innerHTML = newTask
  document.querySelector("#task-input").focus();
}
function saveToBacklog() {
  let inputValue = document.querySelector("#task-input").value;
  if (inputValue.length) {
    const newTask = new Task(inputValue);

    let taskInfo = {
      title: newTask.text,
      id: newTask.id
    };

    backlogTasks.push(taskInfo);
    console.log(taskInfo)

    let newTaskDiv = document.createElement("div");
    newTaskDiv.className = "task";
    newTaskDiv.textContent = taskInfo.title;
    newTaskDiv.id = taskInfo.id;
    document.querySelector("#backlog-task-container").appendChild(newTaskDiv);
  }

  document.querySelector("#task-input").remove();
  document.querySelector("#add-task-backlog").classList.remove("hidden");
  document.querySelector('#submit-backlog').remove();

  createOptionsForReady()
}
function addToReady () {
  selectBlock.style.display = 'block';
  readyContainer.appendChild(selectBlock);
}

function createOptionsForReady() {
  select.innerHTML = '';

  const emptyOption = document.createElement('option');
  emptyOption.textContent = 'Выберите вариант';
  emptyOption.className = 'option-empty'
  select.appendChild(emptyOption);

  const availableToReadyTasks = backlogTasks.filter(task => !readyTasks.includes(task.id))

  availableToReadyTasks.forEach(taskInfo => {
    const option = document.createElement('option')
    option.className = "option-item";
    option.textContent = taskInfo.title;
    option.id = taskInfo.id;
    select.appendChild(option);
  });

  document.querySelector('#add-task-ready').disabled = false;
}

document.addEventListener('click', (e) => {
  const addBacklog = e.target.closest("#add-task-backlog");
  const submitBacklog = e.target.closest("#submit-backlog");
  const addReady = e.target.closest("#add-task-ready");
  
  if (addBacklog) addToBacklog()
  else if (submitBacklog) saveToBacklog();
  else if (addReady) addToReady()
});

select.addEventListener('change', (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const selectedTask = selectedOption.value;
  
  addTaskToReadyContainer(selectedTask);
  select.removeChild(selectedOption);
  readyTasks.push(selectedOption.id);
  
  if (select.querySelectorAll('.option-item').length === 0) {
    document.querySelector('#add-task-ready').disabled = true;
  } else {
    document.querySelector('#add-task-ready').disabled = false;
  }
});


function addTaskToReadyContainer(taskText) {
  let newTaskDiv = document.createElement('div');
  newTaskDiv.className = 'task'; 
  newTaskDiv.textContent = taskText;
  readyContainer.appendChild(newTaskDiv);
  selectBlock.style.display = 'none';
}
