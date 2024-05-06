import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import indexTemplate from "./index.html";
import newTask from "./templates/newTask.html";
import { User } from "./models/User";
import {addToStorage, generateAdminUser, generateSimpleUser, getFromStorage} from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";
import {Task} from "./models/Task"

export const appState = new State();

const loginForm = document.querySelector("#app-login-form");
loginForm?.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  const authSuccess = authUser(login, password)

  if (authSuccess) {
    location.reload()
  } else {
    document.querySelector("#content").innerHTML = noAccessTemplate;
  }
});

const backlogTasks = getFromStorage('backlogTasks');
const readyTasks = getFromStorage('readyTasks');;
const inProgressTasks= getFromStorage('inProgressTasks');;
const finishedTasks= getFromStorage('finishedTasks');;

checkForUsers()

function checkForUsers() {
  const users = getFromStorage('users')
  const currentUser = JSON.parse(localStorage.getItem('user'))

  if (!users.length) {
    generateSimpleUser(User);
    generateAdminUser(User);
  }

  if (currentUser) renderTaskBoard();
}


const readySelectBlock = document.querySelector('#ready-select-block');
const inProgressSelectBlock = document.querySelector('#inProgress-select-block');
const finishedSelectBlock = document.querySelector('#finished-select-block');

const readySelect = document.querySelector("#ready-select");
const inProgressSelect = document.querySelector("#inProgress-select");
const finishedSelect = document.querySelector("#finished-select");

const backlogContainer = document.querySelector('#backlog-task-container');
const readyContainer = document.querySelector('#ready-task-container');
const inProgressContainer = document.querySelector('#in-progress-task-container');
const finishedContainer = document.querySelector('#finished-task-container');

// Buttons
const addBacklog =  document.querySelector('#add-task-backlog');
const addReady =  document.querySelector('#add-task-ready');
const addInProgress =  document.querySelector('#add-task-inProgress');
const addFinished =  document.querySelector('#add-task-finished');

const groupedData = {
  'backlog-task-container': {
    html: backlogContainer,
    tasks: backlogTasks,
    button: addBacklog
  },
  'ready-task-container':  {
    html: readyContainer,
    tasks: readyTasks,
    button: addReady
  },
  'in-progress-task-container': {
    html: inProgressContainer,
    tasks: inProgressTasks,
    button: addInProgress
  },
  'finished-task-container': {
    html: finishedContainer,
    tasks: finishedTasks,
    button: addFinished
  }
}

function renderTaskBoard() {
  const navbar = document.querySelector('#navbar')
  navbar.remove()
  
  document.querySelector("#content").innerHTML = taskFieldTemplate;

  renderAllTasks("#backlog-task-container", backlogTasks)
  renderAllTasks("#ready-task-container", readyTasks)
  renderAllTasks("#in-progress-task-container", inProgressTasks)
  renderAllTasks("#finished-task-container", finishedTasks)
  // TODO: Надо добавить для других колонок, дипунька
}

function renderAllTasks (targetContainer, tasksArray) {
  for (let task of tasksArray) {
    renderTask(targetContainer, task)
  }
}

function renderTask (targetContainer, taskInfo) {
  let newTaskDiv = document.createElement("div");
  newTaskDiv.className = "task";
  newTaskDiv.textContent = taskInfo.title;
  newTaskDiv.id = taskInfo.id;
  document.querySelector(targetContainer).appendChild(newTaskDiv);
}

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

//TODO КНОПКА ENTER выдает ошибку
function setupTaskInputHandlers() {
  const taskInput = document.getElementById('task-input');

  taskInput.removeEventListener('blur', handleBlur);
  taskInput.removeEventListener('keydown', handleKeyDown);

  function handleBlur() {
    saveToBacklog();
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      saveToBacklog();
      event.preventDefault();
    }
  }

  taskInput.addEventListener('blur', handleBlur);
  taskInput.addEventListener('keydown', handleKeyDown);
}

function saveToBacklog() {
  const user = JSON.parse(localStorage.getItem('user'))

  console.log('user: ', user)

  let inputValue = document.querySelector("#task-input").value;
  if (inputValue.length) {
    const newTask = new Task(inputValue);

    let taskInfo = {
      title: newTask.text,
      id: newTask.id,
      creator: user.login
    };

    backlogTasks.push(taskInfo);
    addToStorage(taskInfo, 'backlogTasks')

    renderTask("#backlog-task-container", taskInfo)
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

function displayMenuList() {
  const userMenu = document.querySelector('#userMenu');
  if (userMenu.style.display === 'none') {
    userMenu.style.display = 'block';
  } else {
    userMenu.style.display = 'none';
  } 
}

function showLoginPage() {
  localStorage.removeItem('user');
  document.querySelector("#content").innerHTML = indexTemplate;
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

  addReady.disabled = false;
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

  addInProgress.disabled = false;
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

  addFinished.disabled = false;
}

document.addEventListener('click', (e) => {
  const addBacklog = e.target.closest("#add-task-backlog");
  const submitBacklog = e.target.closest("#submit-backlog");
  const addReady = e.target.closest("#add-task-ready");
  const addInProgress = e.target.closest("#add-task-inProgress");
  const addFinished = e.target.closest("#add-task-finished");
  const addMenuList = e.target.closest('.user-avatar');
  const logoutButton = e.target.closest("#logoutButton");


  
  if (addBacklog) addToBacklog()
  else if (submitBacklog) saveToBacklog();
  else if (addReady) addToReady();
  else if (addInProgress) addToInProgress();
  else if (addFinished) addToFinished();
  else if (addMenuList) displayMenuList();
  else if (logoutButton) showLoginPage();
});

readySelect?.addEventListener('change', (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const selectedTask = selectedOption.value;
  const selectedTaskId = selectedOption.id;
  
  readySelect.removeChild(selectedOption);
  let taskInfo = {
    title: selectedTask,
    id: selectedTaskId
  };
  readyTasks.push(taskInfo);
  addToStorage(taskInfo, 'readyTasks')

  const backlogTasksAsHtml = document.querySelectorAll("#backlog-task-container .task")
  deleteTask(backlogTasksAsHtml, taskInfo, backlogTasks, 'backlogTasks')
  console.log('backlogTasks', backlogTasks)
  
  
  addTaskToContainer(selectedTask, selectedTaskId, readyContainer, readySelectBlock);  
  if (readySelect.querySelectorAll('.option-item').length === 0) {
    addReady.disabled = true;
  } else {
    addReady.disabled = false;
  }
});

inProgressSelect?.addEventListener('change', (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const selectedTask = selectedOption.value;
  const selectedTaskId = selectedOption.id;

  inProgressSelect.removeChild(selectedOption);
  let taskInfo = {
    title: selectedTask,
    id: selectedTaskId
  };
  inProgressTasks.push(taskInfo);
  addToStorage(taskInfo, 'inProgressTasks')

  const readyTasksAsHtml = document.querySelectorAll("#ready-task-container .task")
  deleteTask(readyTasksAsHtml, taskInfo, readyTasks, 'readyTasks')

  addTaskToContainer(selectedTask, selectedTaskId, inProgressContainer, inProgressSelectBlock);
  if (inProgressSelect.querySelectorAll('.option-item').length === 0) {
    addInProgress.disabled = true;
  } else {
    addInProgress.disabled = false;
  }
});

finishedSelect?.addEventListener('change', (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const selectedTask = selectedOption.value;
  const selectedTaskId = selectedOption.id;
  
  finishedSelect.removeChild(selectedOption);
  let taskInfo = {
    title: selectedTask,
    id: selectedTaskId
  };
  finishedTasks.push(taskInfo);
  addToStorage(taskInfo, 'finishedTasks')

  const inProgressTasksAsHtml = document.querySelectorAll("#in-progress-task-container .task")
  deleteTask(inProgressTasksAsHtml, taskInfo, inProgressTasks, 'inProgressTasks')

  addTaskToContainer(selectedTask, selectedTaskId, finishedContainer, finishedSelectBlock);
  
  if (finishedSelect.querySelectorAll('.option-item').length === 0) {
    addFinished.disabled = true;
  } else {
    addFinished.disabled = false;
  }
});

function addTaskToContainer(taskText, taskId, container, selectBlock) {
  let newTaskDiv = document.createElement('div');
  newTaskDiv.className = 'task'; 
  newTaskDiv.textContent = taskText;
  newTaskDiv.id = taskId;
  container.appendChild(newTaskDiv);
  selectBlock.style.display = 'none';

  createOptionsForInProgress();
  createOptionsForFinished();
}

const containerIds = {
  backlogTasks: 'backlog-task-container',
  readyTasks: 'ready-task-container',
  inProgressTasks: 'in-progress-task-container',
  finishedTasks: 'finished-task-container'
};

function deleteTask(htmlElements, taskInfo, array, storageKey) {
  Array.from(htmlElements).find(element => element.id === taskInfo.id)?.remove()

  const index = array.findIndex(task => task.id === taskInfo.id);
  if (index!== -1) {
    array.splice(index, 1);
  }
  localStorage.setItem(storageKey, JSON.stringify(array))  
}

//drag and drop

dragula(
[ backlogContainer,
  readyContainer,
  inProgressContainer,
  finishedContainer
],
{
  revertOnSpill: true,
}
)
.on('drop', function (el, target, source) {
  const searchArrays = [backlogTasks, readyTasks, inProgressTasks, finishedTasks];
  const sourceData = groupedData[source.id]
  const targetData = groupedData[target.id];
  removeObjectFromArrays(el.id, searchArrays);
  addObjectToArray(el, target)

  // TODO блокируется кнопка backlog если в него переместить обратно, source элемента меняется
  targetData.button.disabled = !sourceData.tasks.length
})

function removeObjectFromArrays(id, arrays) { 
  arrays.forEach(function(array) {
    let index = array.findIndex(function(item) {
      return item.id === id; 
    });
    if (index !== -1) {
      array.splice(index, 1); 
      console.log('Объект удалён из массива');
    }
    // TODO найти способ передать ключ "array" динамично
    localStorage.setItem('backlogTasks', JSON.stringify(array))  
  })
}


function addObjectToArray(el, target) {
  let taskObject = {
    title: el.textContent,
    id: el.id
  };

  const optionItems = document.querySelectorAll('.option-item');
  Array.from(optionItems).find(option => option.id === taskObject.id)?.remove()
  
  switch (target.id) {
    case 'backlog-task-container': 
      backlogTasks.push(taskObject);
      addToStorage(taskObject, 'backlogTasks')
      createOptionsForReady();
      break;
      case 'ready-task-container': 
      readyTasks.push(taskObject);
      addToStorage(taskObject, 'readyTasks')
      createOptionsForInProgress();
      break;
      case 'in-progress-task-container': 
      inProgressTasks.push(taskObject);
      addToStorage(taskObject, 'inProgressTasks')
      createOptionsForFinished()
      break;
    case 'finished-task-container': 
    finishedTasks.push(taskObject);
    addToStorage(taskObject, 'finishedTasks')
    break;
    default: console.log('Контейнер не распознан');
  }
}

