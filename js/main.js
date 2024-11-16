document.addEventListener("DOMContentLoaded", function () {
    // Form submission for adding a new item
    if (document.getElementById("add-item-form")) {
        document.getElementById("add-item-form").onsubmit = function (event) {
            event.preventDefault();
            
            const id = document.getElementById("item-id").value;
            const name = document.getElementById("item-name").value;
            const price = document.getElementById("item-price").value;

            // XML request for sending item data to DB
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", "https://do7d6hafl5.execute-api.us-east-2.amazonaws.com/items"); // Update to correct API URL
            xhr.setRequestHeader("Content-Type", "application/json");

            // Reload page if successful, error if not
            xhr.onload = function () {
                if (xhr.status === 200) {
                    window.location.href = "add-item.html"; // Redirect to index after adding
                } else {
                    console.error("Failed to add item:", xhr.responseText);
                }
            };

            xhr.onerror = function () {
                console.error("Request failed with status:", xhr.status);
            };

            xhr.send(JSON.stringify({ id, name, price }));
            this.reset(); // Reset the form fields
        };
    }

    // Load data from DB when "load all items" is pressed
    const loadButton = document.getElementById("load-data");
    if (loadButton) {
        loadButton.addEventListener("click", function () {
            const lambda = document.getElementById("inventory-table").getElementsByTagName('tbody')[0];
            const xhr = new XMLHttpRequest();

            xhr.onload = function () {
                if (xhr.status === 200) {
                    lambda.innerHTML = ''; // Clear table
                    const items = JSON.parse(xhr.response);
                    items.forEach(item => {
                        const row = lambda.insertRow();
                        row.innerHTML = `
                            <td>${item.id}</td>
                            <td>${item.name}</td>
                            <td>${item.price}</td>
                            <td><button class="delete-item" data-id="${item.id}">Delete</button></td>
                        `;
                    });

                    // Event listeners for delete buttons
                    document.querySelectorAll('.delete-item').forEach(button => {
                        button.addEventListener('click', function () {
                            const itemId = this.getAttribute('data-id');
                            deleteItem(itemId);
                        });
                    });
                } else {
                    console.error("Failed to load items:", xhr.responseText);
                }
            };

            xhr.onerror = function () {
                console.error("Request failed with status:", xhr.status);
            };

            xhr.open("GET", "https://do7d6hafl5.execute-api.us-east-2.amazonaws.com/items");
            xhr.send();
        });
    }

    // Delete item function
    function deleteItem(itemId) {
        const xhr = new XMLHttpRequest();
        xhr.open("DELETE", `https://do7d6hafl5.execute-api.us-east-2.amazonaws.com/items/${itemId}`);
        xhr.setRequestHeader("Content-Type", "application/json");

        // Reload page if successful, error if not
        xhr.onload = function () {
            if (xhr.status === 200) {
                document.getElementById("load-data").click();  // Reload data after deletion
            } else {
                console.error("Failed to delete item:", xhr.responseText);
            }
        };

        xhr.onerror = function () {
            console.error("Request failed with status:", xhr.status);
        };

        xhr.send();
    }
});
