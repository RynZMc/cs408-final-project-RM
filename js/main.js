document.addEventListener("DOMContentLoaded", function () {
    // Form submission for adding a new task
    if (document.getElementById("add-task-form")) {
        document.getElementById("add-task-form").onsubmit = function (event) {
            event.preventDefault();

            const name = document.getElementById("task-name").value;
            const description = document.getElementById("task-description").value;
            const comments = document.getElementById("task-comments").value;

            // XML request for sending task data to DB
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", "https://do7d6hafl5.execute-api.us-east-2.amazonaws.com/items"); // Update with correct API URL
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.onload = function () {
                if (xhr.status === 200) {
                    // Reset the form if successful, error if not
                    document.getElementById("add-task-form").reset();
                } else {
                    console.error("Failed to add task:", xhr.responseText);
                }
            };

            xhr.onerror = function () {
                console.error("Request failed with status:", xhr.status);
            };
            
            xhr.send(JSON.stringify({ name, description, comments }));
        };
    }

    // Function to load tasks from the DB
    function loadTasks() {
        const taskTableBody = document.getElementById("task-table").getElementsByTagName('tbody')[0];
        const xhr = new XMLHttpRequest();

        xhr.onload = function () {
            if (xhr.status === 200) {
                taskTableBody.innerHTML = ''; // Clear the table
                const tasks = JSON.parse(xhr.response);
                tasks.forEach(task => {
                    const row = taskTableBody.insertRow();
                    row.innerHTML = `
                        <td>${task.name}</td>
                        <td>${task.description}</td>
                        <td>${task.comments || "No comments"}</td>
                        <td>
                        <select class="status-dropdown" data-id="${task.id}">
                            <option value="Incomplete" ${task.status === "Incomplete" ? "selected" : ""}>Incomplete</option>
                            <option value="Complete" ${task.status === "Complete" ? "selected" : ""}>Complete</option>
                        </select>
                        </td>
                        <td>
                            <button class="delete-task" data-id="${task.id}">Delete</button>
                        </td>
                    `;
                });

                // Event listeners for delete buttons
                document.querySelectorAll('.delete-task').forEach(button => {
                    button.addEventListener('click', function () {
                        const taskId = this.getAttribute('data-id');
                        deleteTask(taskId);
                    });
                });
            } else {
                console.error("Failed to load tasks:", xhr.responseText);
            }
        };

        xhr.onerror = function () {
            console.error("Request failed with status:", xhr.status);
        };

        xhr.open("GET", "https://do7d6hafl5.execute-api.us-east-2.amazonaws.com/items");
        xhr.send();
    }

    // Function to delete a task
    function deleteTask(taskId) {
        const xhr = new XMLHttpRequest();
        xhr.open("DELETE", `https://do7d6hafl5.execute-api.us-east-2.amazonaws.com/items/${taskId}`); // Update with correct API URL
        xhr.setRequestHeader("Content-Type", "application/json");

        // Reload page if successful, error if not
        xhr.onload = function () {
            if (xhr.status === 200) {
                loadTasks(); // Reload the task list after deletion
            } else {
                console.error("Failed to delete task:", xhr.responseText);
            }
        };

        xhr.onerror = function () {
            console.error("Request failed with status:", xhr.status);
        };

        xhr.send();
    }

    // Load tasks when the page is loaded
    loadTasks();
});
