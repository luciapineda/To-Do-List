/***********
File: controller.js
--------------------
Author: Lucia Pineda
--------------------
- This file handles the interaction between the user interface (UI) and the data model.
- It contains event listeners for user actions, rendering tasks on the UI, and handling UI updates.
- The controller is responsible for keeping the view (index.html) and model (model.js) in sync.
************/

// Getting elements from the HTML
const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const addTaskButton = document.getElementById("addTask");
const filterDateInput = document.getElementById("filterDateInput");
const filterPriorityInput = document.getElementById("filterPriorityInput");
const filterButton = document.getElementById("filterButton");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage"); // New element for the empty message

// Function to render tasks based on user input and filters
function renderTasks() {
    // Sort tasks by due date and priority
    tasks.sort(compareTasks);

    console.log("------List of Tasks-----");
    for(var i = 0; i < tasks.length; i++){
        console.log(tasks[i].description);
    }

    taskList.innerHTML = "";
    const filterDate = filterDateInput.value;
    const filterPriority = filterPriorityInput.value;
    const searchQuery = searchInput.value.toLowerCase();

    const filteredTasks = tasks.filter((task) =>
        (filterDate === "" || task.dueDate === filterDate) &&
        (filterPriority === "All" || task.priority === filterPriority) &&
        (task.description.toLowerCase().includes(searchQuery))
    );

    // Show or hide the empty message based on the task list's emptiness
    if (filteredTasks.length === 0 && tasks.length === 0) {
        emptyMessage.style.display = "block"; // Show the empty message
    } else {
        emptyMessage.style.display = "none"; // Hide the empty message
    }

    filteredTasks.forEach((task, index) => {
        // Creating a new task item
        const listItem = document.createElement("li");
        listItem.classList.add("task-item");

        if (task.priority === "High") {
            listItem.classList.add("high-priority");
        } else if (task.priority === "Medium") {
            listItem.classList.add("medium-priority");
        } else if (task.priority === "Low") {
            listItem.classList.add("low-priority");
        }

        // Create the HTML for task details
        const taskDetailsHTML = `
            <div class="task-details-container">
                <div class="small-text">Due: ${task.dueDate}</div>
                <div class="small-text">Priority: ${task.priority}</div>
                <div class="description">${task.description}</div>
            </div>
            <div class="task-buttons-container">
                <button class="task-edit-button" data-index="${index}">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="task-complete-button" data-index="${index}">
                    <i class="fas fa-check"></i>
                </button>
            </div>
        `;

        listItem.innerHTML = taskDetailsHTML;
        taskList.appendChild(listItem);
    });
}

// Event Listeners
// Add an event listener for the search input
searchInput.addEventListener("input", () => {
    renderTasks();
});

// Add Task Button Click
addTaskButton.addEventListener("click", () => {
    const description = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;

    if (description) {
        addTask(description, dueDate, priority);
        taskInput.value = "";
        dueDateInput.value = "";
        priorityInput.value = "Low"; // Reset to default value
        renderTasks();
    }
});

// Check Button Click (Assuming 'Check' button functionality)
taskList.addEventListener("click", (event) => {
    if (event.target.classList.contains("task-complete-button")) {
        console.log("check button clicked");
        const index = event.target.getAttribute("data-index");
        deleteTask(index); // Delete corresponding task from the list
        renderTasks();
    }
});

// Filter Button Click
filterButton.addEventListener("click", () => {
    renderTasks();
});

// Add an event listener for the "Edit" button
taskList.addEventListener("click", (event) => {
    if (event.target.classList.contains("task-edit-button")) {
        const index = event.target.getAttribute("data-index");
        const taskToEdit = tasks[index];

        console.log("index to edit: ", index);
        console.log("task to edit: ", tasks[index]);

        editTask(taskToEdit, index); // Pass the task and its index to the editTask function
    }
});

// Function to edit a task
function editTask(task, index) {
    const editModal = document.getElementById("editTaskModal");
    const editForm = document.getElementById("editTaskForm");
    const closeEditModal = document.getElementById("closeEditModal");

    // Open the edit modal
    editModal.style.display = "block";

    // Pre-fill form fields with task details
    document.getElementById("editTaskDescription").value = task.description;
    document.getElementById("editTaskDueDate").value = task.dueDate;
    document.getElementById("editTaskPriority").value = task.priority;

    // Handle form submission (saving the edited task)
    editForm.onsubmit = function (e) {
        e.preventDefault();

        // Get edited task details from form fields
        const editedDescription = document.getElementById("editTaskDescription").value;
        const editedDueDate = document.getElementById("editTaskDueDate").value;
        const editedPriority = document.getElementById("editTaskPriority").value;

        // Update the task in the tasks array using the updateTask function
        updateTask(index, editedDescription, editedDueDate, editedPriority);

        // Close the edit modal
        editModal.style.display = "none";

        // Update the task list (call renderTasks)
        renderTasks();
    };

    // Close the edit modal if the close button is clicked
    closeEditModal.onclick = function () {
        editModal.style.display = "none";
    };
}

// Sorting function to sort tasks by due date and then priority
function compareTasks(a, b) {
    // Compare due dates
    if (a.dueDate < b.dueDate) {
        return -1;
    }
    if (a.dueDate > b.dueDate) {
        return 1;
    }

    // If due dates are equal, compare priorities
    if (a.priority === 'High' && b.priority !== 'High') {
        return -1;
    }
    if (a.priority !== 'High' && b.priority === 'High') {
        return 1;
    }
    if (a.priority === 'Medium' && b.priority === 'Low') {
        return -1;
    }
    if (a.priority === 'Low' && b.priority === 'Medium') {
        return 1;
    }

    // If due dates and priorities are equal, keep their order
    return 0;
}
