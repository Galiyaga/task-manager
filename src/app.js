import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import newTask from "./templates/newTask.html";
import { User } from "./models/User";
import {addToStorage, generateAdminUser, generateSimpleUser, getFromStorage} from "./utils";
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

checkForUsers()

function checkForUsers() {
  const users = getFromStorage('users')
  const currentUser = JSON.parse(localStorage.getItem('user'))

  console.log('currentUser: ', currentUser)

  if (!users.length) {
    generateSimpleUser(User);
    generateAdminUser(User);
  }

  if (currentUser) renderTaskBoard();
}

function renderTaskBoard() {
  const navbar = document.querySelector('#navbar')
  navbar.remove()

  document.querySelector("#content").innerHTML = taskFieldTemplate;
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
// TODO: переимпеновать без disabled
const addBacklogDisabled =  document.querySelector('#add-task-backlog');
const addReadyDisabled =  document.querySelector('#add-task-ready');
const addInProgressDisabled =  document.querySelector('#add-task-inProgress');
const addFinishedDisabled =  document.querySelector('#add-task-finished');

const backlogTasks = getFromStorage('backlogTasks');
const readyTasks = [];
const inProgressTasks= [];
const finishedTasks= [];

const groupedData = {
  'backlog-task-container': {
    html: backlogContainer,
    tasks: backlogTasks,
    button: addBacklogDisabled
  },
  'ready-task-container':  {
    html: readyContainer,
    tasks: readyTasks,
    button: addReadyDisabled
  },
  'in-progress-task-container': {
    html: inProgressContainer,
    tasks: inProgressTasks,
    button: addInProgressDisabled
  },
  'finished-task-container': {
    html: finishedContainer,
    tasks: finishedTasks,
    button: addFinishedDisabled
  }
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

  addReadyDisabled.disabled = false;
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

  addInProgressDisabled.disabled = false;
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

  addFinishedDisabled.disabled = false;
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
  const backlogTask = document.querySelector("#backlog-task-container .task");
  deleteTask(backlogTask, taskInfo, backlogTasks)
  addTaskToContainer(selectedTask, selectedTaskId, readyContainer, readySelectBlock);
  
  if (readySelect.querySelectorAll('.option-item').length === 0) {
    addReadyDisabled.disabled = true;
  } else {
    addReadyDisabled.disabled = false;
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
  const readyTask = document.querySelector("#ready-task-container .task");
  deleteTask(readyTask, taskInfo, readyTasks)
  addTaskToContainer(selectedTask, selectedTaskId, inProgressContainer, inProgressSelectBlock);

  if (inProgressSelect.querySelectorAll('.option-item').length === 0) {
    addInProgressDisabled.disabled = true;
  } else {
    addInProgressDisabled.disabled = false;
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
  finishedTasks.push(taskInfo);
  const inProgressTask = document.querySelector("#in-progress-task-container .task");
  deleteTask(inProgressTask, taskInfo, inProgressTasks);
  addTaskToContainer(selectedTask, selectedTaskId, finishedContainer, finishedSelectBlock);
  
  if (finishedSelect.querySelectorAll('.option-item').length === 0) {
    addFinishedDisabled.disabled = true;
  } else {
    addFinishedDisabled.disabled = false;
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

function deleteTask(task, taskInfo, array) {
  if(task.id === taskInfo.id) {
    task.remove();
  }
  array.splice((array.findIndex(task => task.id === taskInfo.id)), 1)
}

//drag and drop

dragula(
[ backlogContainer,
  readyContainer,
  inProgressContainer,
  finishedContainer
],
{
  moves: function (el, source, handle, sibling) {
    return true; // по умолчанию элементы всегда можно перетаскивать
  },
  accepts: function (el, target, source, sibling) {
    return true; // по умолчанию элементы могут быть помещены в любой из `контейнеров`
  },
  invalid: function (el, handle) {
    return false; // не запрещайте инициировать какие-либо перетаскивания по умолчанию
  },
  
  revertOnSpill: true,
}
)
.on('drag', function (el) {
// console.log("Перетаскиваем блок")

}).on('drop', function (el, target, source) {
  const searchArrays = [backlogTasks, readyTasks, inProgressTasks, finishedTasks];
  const sourceData = groupedData[source.id]
  const targetData = groupedData[target.id]

  removeObjectFromArrays(el.id, searchArrays);
  addObjectToArray(el, target)

  // const optionItems = document.querySelectorAll('.option-item');
  // optionItems.forEach(option => {
  //   if (option.id === taskObject.id) {
  //     option.remove();
  //   }
  // })


  // TODO блокируется кнопка backlog если в него переместить обратно, source элемента меняется
  targetData.button.disabled = !sourceData.tasks.length
}).on('over', function (el, container) {
// console.log("Блок над контейнером")

}).on('out', function (el, container) {
// console.log("Блок вышел из контейнера")
});

function removeObjectFromArrays(id, arrays) { 
arrays.forEach(function(array) {
  let index = array.findIndex(function(item) {
    return item.id === id; 
  });
  if (index !== -1) {
    array.splice(index, 1);
    console.log('Объект удалён из массива');
  }
})
}

function addObjectToArray(el, target) {
  let taskObject = {
    title: el.textContent,
    id: el.id
  };
  
  switch (target.id) {
    case 'backlog-task-container': 
      backlogTasks.push(taskObject);
      createOptionsForReady();
      break;
      case 'ready-task-container': 
      readyTasks.push(taskObject);
      createOptionsForInProgress();
      break;
    case 'in-progress-task-container': 
      inProgressTasks.push(taskObject);
      createOptionsForFinished()
      break;
    case 'finished-task-container': 
      finishedTasks.push(taskObject);
      break;
    default: console.log('Контейнер не распознан');
  }
}

