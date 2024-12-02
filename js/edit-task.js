document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get("id");

    // Alert if taskID is not given from clicking edit on index?
    // if (!taskId) {
    //     alert("Please use edit on main page");
    //     return;
    // }

    // Fetch task data
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://do7d6hafl5.execute-api.us-east-2.amazonaws.com/items/${taskId}`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const task = JSON.parse(xhr.responseText);
            
            document.getElementById("task-name").value = task.name;
            document.getElementById("task-description").value = task.description || "";
            document.getElementById("task-comments").value = task.comments || "";
        } else {
            console.error("Failed to fetch task data:", xhr.responseText);
        }
    };
    xhr.onerror = function () {
        console.error("Request failed with status:", xhr.status);
    };
    xhr.send();

    // Form submission for editing task
    document.getElementById("edit-task-form").onsubmit = function (event) {
        event.preventDefault();

        const updatedName = document.getElementById("task-name").value;
        const updatedDescription = document.getElementById("task-description").value;
        const updatedComments = document.getElementById("task-comments").value;
        const updateXhr = new XMLHttpRequest();

        updateXhr.open("PATCH", `https://do7d6hafl5.execute-api.us-east-2.amazonaws.com/items/${taskId}`);
        updateXhr.setRequestHeader("Content-Type", "application/json");

        updateXhr.onload = function () {
            if (updateXhr.status === 200) {
                alert("Task updated successfully!");
                window.location.href = "index.html";
            } else {
                console.error("Failed to update task:", updateXhr.responseText);
            }
        };

        updateXhr.onerror = function () {
            console.error("Request failed with status:", updateXhr.status);
        };

        updateXhr.send(JSON.stringify({
            name: updatedName,
            description: updatedDescription,
            comments: updatedComments
        }));
    };
});
