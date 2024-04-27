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

const readySelectBlock = document.querySelector('#ready-select-block');
const inProgressSelectBlock = document.querySelector('#inProgress-select-block');
const finishedSelectBlock = document.querySelector('#finished-select-block');
const readyContainer = document.querySelector('#ready-task-container');
const inProgressContainer = document.querySelector('#inProgress-task-container');
const finishedContainer = document.querySelector('#finished-task-container');
const readySelect = document.querySelector("#ready-select");
const inProgressSelect = document.querySelector("#inProgress-select");
const finishedSelect = document.querySelector("#finished-select");

const backlogTasks = [];
const readyTasks = [];
const inProgressTasks= [];
const finishedTasks= [];
// Логика добавления в колонки
function addToBacklog () {
  const addBacklog = document.querySelector("#add-task-backlog");
  addBacklog.classList.add("hidden");
  
  document.querySelector('#new-task').innerHTML = newTask
  document.querySelector("#task-input").focus();
  document.querySelector("#task-input").addEventListener('blur', function() {
    saveToBacklog();
  });
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

function addToReady() {
  readySelectBlock.style.display = 'block';
  readyContainer.appendChild(readySelectBlock);
}

function addToInProgress() {
  inProgressSelectBlock.style.display = 'block';
  inProgressContainer.appendChild(inProgressSelectBlock);
}

function addToFinished() {
  finishedSelectBlock.style.display = 'block';
  finishedContainer.appendChild(finishedSelectBlock);
}

function createOptionsForReady() {
  readySelect.innerHTML = '';

  const emptyOption = document.createElement('option');
  emptyOption.textContent = 'Выберите вариант';
  emptyOption.className = 'option-empty'
  readySelect.appendChild(emptyOption);

  const availableToreadyOptions = backlogTasks.filter(task =>!readyTasks.some(readyTask => readyTask.id === task.id)
   );
  availableToreadyOptions.forEach(taskInfo => {
    const option = document.createElement('option')
    option.className = "option-item";
    option.textContent = taskInfo.title;
    option.id = taskInfo.id;
    readySelect.appendChild(option);
  });

  document.querySelector('#add-task-ready').disabled = false;
}

function createOptionsForInProgress() {
  inProgressSelect.innerHTML = '';

  const emptyOption = document.createElement('option');
  emptyOption.textContent = 'Выберите вариант';
  emptyOption.className = 'option-empty'
  inProgressSelect.appendChild(emptyOption);

  
  const availableToInProgressTasks = readyTasks.filter(task => !inProgressTasks.some(inProgressTask => inProgressTask.id === task.id))
  availableToInProgressTasks.forEach(taskInfo => {
    const option = document.createElement('option')
    option.className = "option-item";
    option.textContent = taskInfo.title;
    option.id = taskInfo.id;
    inProgressSelect.appendChild(option);
  });

  document.querySelector('#add-task-inProgress').disabled = false;
}

function createOptionsForFinished() {
  finishedSelect.innerHTML = '';

  const emptyOption = document.createElement('option');
  emptyOption.textContent = 'Выберите вариант';
  emptyOption.className = 'option-empty'
  finishedSelect.appendChild(emptyOption);

  const availableToInfinishedTasks = inProgressTasks.filter(task => !finishedTasks.some(finishedTask => finishedTask.id === task.id))
  availableToInfinishedTasks.forEach(taskInfo => {
    const option = document.createElement('option')
    option.className = "option-item";
    option.textContent = taskInfo.title;
    option.id = taskInfo.id;
    finishedSelect.appendChild(option);
  });

  document.querySelector('#add-task-finished').disabled = false;
}

document.addEventListener('click', (e) => {
  const addBacklog = e.target.closest("#add-task-backlog");
  const submitBacklog = e.target.closest("#submit-backlog");
  const addReady = e.target.closest("#add-task-ready");
  const addInProgress = e.target.closest("#add-task-inProgress");
  const addFinished = e.target.closest("#add-task-finished");
  
  if (addBacklog) addToBacklog()
  else if (submitBacklog) saveToBacklog();
  else if (addReady) addToReady();
  else if (addInProgress) addToInProgress();
  else if (addFinished) addToFinished();
});

readySelect.addEventListener('change', (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const selectedTask = selectedOption.value;
  const selectedTaskId = selectedOption.id;
  
  readySelect.removeChild(selectedOption);
  let taskInfo = {
    title: selectedTask,
    id: selectedTaskId
  };
  readyTasks.push(taskInfo);
  let backlogTask = document.querySelector("#backlog-task-container .task")
  if(backlogTask.id === taskInfo.id) {
    backlogTask.remove();
  }
  backlogTasks.splice((backlogTasks.findIndex(task => task.id === taskInfo)), 1)
  addTaskToContainer(selectedTask, selectedTaskId, readyContainer, readySelectBlock);
  createOptionsForInProgress();
  
  if (readySelect.querySelectorAll('.option-item').length === 0) {
    document.querySelector('#add-task-ready').disabled = true;
  } else {
    document.querySelector('#add-task-ready').disabled = false;
  }
});

inProgressSelect.addEventListener('change', (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const selectedTask = selectedOption.value;
  const selectedTaskId = selectedOption.id;
  
  inProgressSelect.removeChild(selectedOption);
  let taskInfo = {
    title: selectedTask,
    id: selectedTaskId
  };
  inProgressTasks.push(taskInfo);
  
  let readyTask = document.querySelector("#ready-task-container .task")
  if(readyTask.id === taskInfo.id) {
    readyTask.remove();
  }
  readyTasks.splice((readyTasks.findIndex(task => task.id === taskInfo)), 1)
  addTaskToContainer(selectedTask, selectedTaskId, inProgressContainer, inProgressSelectBlock);
  createOptionsForFinished()
  
  if (inProgressSelect.querySelectorAll('.option-item').length === 0) {
    document.querySelector('#add-task-inProgress').disabled = true;
  } else {
    document.querySelector('#add-task-inProgress').disabled = false;
  }
});

finishedSelect.addEventListener('change', (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const selectedTask = selectedOption.value;
  const selectedTaskId = selectedOption.id;
  
  finishedSelect.removeChild(selectedOption);
  let taskInfo = {
    title: selectedTask,
    id: selectedTaskId
  };
  finishedTasks.push(taskInfo)
  let inProgressTask = document.querySelector("#inProgress-task-container .task")
  if(inProgressTask.id === taskInfo.id) {
    inProgressTask.remove();
  }
  inProgressTasks.splice((inProgressTasks.findIndex(task => task.id === taskInfo)), 1)
  addTaskToContainer(selectedTask, selectedTaskId, finishedContainer, finishedSelectBlock);
  
  if (finishedSelect.querySelectorAll('.option-item').length === 0) {
    document.querySelector('#add-task-finished').disabled = true;
  } else {
    document.querySelector('#add-task-finished').disabled = false;
  }
});


function addTaskToContainer(taskText, taskId, container, selectBlock) {
  let newTaskDiv = document.createElement('div');
  newTaskDiv.className = 'task'; 
  newTaskDiv.textContent = taskText;
  newTaskDiv.id = taskId;
  container.appendChild(newTaskDiv);
  selectBlock.style.display = 'none';
}

// function addTaskToInProgressContainer(taskText, taskId) {
//   let newTaskDiv = document.createElement('div');
//   newTaskDiv.className = 'task'; 
//   newTaskDiv.textContent = taskText;
//   newTaskDiv.id = taskId;
//   inProgressContainer.appendChild(newTaskDiv);
//   inProgressSelectBlock.style.display = 'none';

// }

// function addTaskFinishedContainer(taskText, taskId) {
//   let newTaskDiv = document.createElement('div');
//   newTaskDiv.className = 'task'; 
//   newTaskDiv.textContent = taskText;
//   newTaskDiv.id = taskId;
//   finishedContainer.appendChild(newTaskDiv);
//   finishedSelectBlock.style.display = 'none';
// }