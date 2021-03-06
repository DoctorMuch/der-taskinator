let taskIdCounter = 0;

let pageContentEl = document.querySelector("#page-content");
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
let tasksInProgressEl = document.querySelector("#tasks-in-progress");
let tasksCompletedEl = document.querySelector("#tasks-completed");

let tasks = [];

var taskFormHandler = function(event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
  
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }
  formEl.reset();

  let isEdit = formEl.hasAttribute("data-task-id");

  let taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
    status: "to do"
  }

  if (isEdit){
    let taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  else {
    let taskDataObj = {
      name: taskNameInput, 
      type: taskTypeInput,
      status: "to do"
    };

    createTaskEl(taskDataObj);
  }
};

let createTaskEl = function(taskDataObj) {
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "<h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);
  
  let taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);
  
  switch (taskDataObj.status) {
    case "to do":
      taskActionsEl.querySelector("select[name='status-change'").selectedIndex = 0;
      tasksToDoEl.append(listItemEl);
      break;
    case "in progress":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
      tasksInProgressEl.append(listItemEl);
      break;
    case "completed":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
      tasksCompletedEl.append(listItemEl);
      break;
    default:
      console.log("Something went wrong!");
  }


  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);

  saveTasks();

  taskIdCounter++;
}

let createTaskActions = function(taskId) {
  let actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";
  
  let editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  let deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  let statusSelectEl = document.createElement("select");
  statusSelectEl.className = "status-select";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  let statusChoices = ["To Do", "In Progress", "Completed"];
  for (let i = 0; i <statusChoices.length; i++){
    let statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);
    statusSelectEl.appendChild(statusOptionEl);
  }

  actionContainerEl.appendChild(statusSelectEl);

  return actionContainerEl;
}

let completeEditTask = function(taskName, taskType, taskId){
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;
  
  for (let i=0; i < tasks.length; i++){
    if (tasks[i].id === parseInt(taskId)){
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }
  
  alert("Task Updated!");

  saveTasks();

  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
}

formEl.addEventListener("submit", taskFormHandler);

let taskButtonHandler = function(event){
  let targetEl = event.target;

  if (targetEl.matches(".edit-btn")){
    let taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }

  else if (targetEl.matches(".delete-btn")) {
    let taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

let editTask = function(taskId){
  console.log("editing task # " + taskId);

  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  let taskName = taskSelected.querySelector("h3.task-name").textContent;
  
  let taskType = taskSelected.querySelector("span.task-type").textContent;
  
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";
  formEl.setAttribute("data-task-id", taskId);
};

let deleteTask = function(taskId) {
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();

  let updatedTaskArr = [];
  for (let i=0;i < tasks.length; i++){
    if (tasks[i].id !== parseInt(taskId)){
      updatedTaskArr.push(tasks[i]);
    }
  }
  tasks = updatedTaskArr;
  saveTasks();
};

let taskStatusChangeHandler = function(event){
  let taskId = event.target.getAttribute("data-task-id");
  let statusValue = event.target.value.toLowerCase();
  let taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  if (statusValue === "to do"){
    tasksToDoEl.appendChild(taskSelected);
  }
  else if (statusValue === "in progress"){
    tasksInProgressEl.appendChild(taskSelected);
  }
  else if (statusValue === "completed"){
    tasksCompletedEl.appendChild(taskSelected);
  }
  for (let i=0;i < tasks.length; i++){
    if (tasks[i].id === parseInt(taskId)){
      tasks[i].status = statusValue;
    }
  }

  saveTasks();
};

let saveTasks = function(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

let loadTasks = function(){
  // Get task items from localStorage
  let savedTasks = localStorage.getItem("tasks");
  
  if (savedTasks === null || savedTasks ===" "){
    return false;
  }
  // Convert tasks from string to array
  savedTasks = JSON.parse(savedTasks);
  
  for (let i=0; i<savedTasks.length;i++){
    createTaskEl(savedTasks[i]);
  }
  // Loop through tasks to print to screen
  // Refactor code using createTasks()
  
};

pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();