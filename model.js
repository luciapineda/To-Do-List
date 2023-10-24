/***********
File: model.js
--------------------
Author: Lucia Pineda
--------------------
- This file defines the core data model for my To-Do List application.
- It includes functions to manipulate tasks: adding, deleting, and updating.
- The tasks array holds the list of tasks.
************/

// Array to store tasks
const tasks = [];

// Function to add a new task to the tasks array
function addTask(description, dueDate, priority) {
    // Create a new task object with description, dueDate, and priority
    const newTask = {
        description,
        dueDate,
        priority,
    };

    // Push the new task object into the tasks array
    tasks.push(newTask);
}

// Function to delete a task from the tasks array based on its index
function deleteTask(index) {
    // Use the splice method to remove the task at the specified index
    tasks.splice(index, 1);
}

// Function to update an existing task
function updateTask(index, newDescription, newDueDate, newPriority) {
    if (index >= 0 && index < tasks.length) {
        tasks[index].description = newDescription;
        tasks[index].dueDate = newDueDate;
        tasks[index].priority = newPriority;
    }
}
