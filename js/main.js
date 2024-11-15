// Form submission for adding a new item
document.getElementById("add-item-form").onsubmit = function (event) {
    event.preventDefault(); 
    let id = document.getElementById("item-id").value;
    let name = document.getElementById("item-name").value;
    let price = document.getElementById("item-price").value;
    
    // XML request for sending item data to DB
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://do7d6hafl5.execute-api.us-east-2.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");

    // Reload page if successful, error if not
    xhr.onload = function () {
        if (xhr.status === 200) {
            document.getElementById("load-data").click();
        } else {
            console.error("Failed to add item:", xhr.responseText);
        }
    };
    
    xhr.send(JSON.stringify({ id, name, price }));
    this.reset();
}

// Load data from DB when "load all items" is pressed
document.getElementById("load-data").onclick = function () {
    let lambda = document.getElementById("inventory-table").getElementsByTagName('tbody')[0];
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        lambda.innerHTML = ''; // Clear table
        let items = JSON.parse(xhr.response);
        items.forEach(item => {
            let row = lambda.insertRow();
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td><button class="delete-item" data-id="${item.id}">Delete</button></td>
            `;
        });
        // Event listeners for delete buttons
        document.querySelectorAll('.delete-item').forEach(button => {
            button.onclick = function () {
                let itemId = this.getAttribute('data-id');
                deleteItem(itemId);
            };
        });
    });

    xhr.open("GET", "https://do7d6hafl5.execute-api.us-east-2.amazonaws.com/items");
    xhr.send();
}

// Delete items function 
function deleteItem(itemId) {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", `https://do7d6hafl5.execute-api.us-east-2.amazonaws.com/items/${itemId}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();

    // Reload page if successful, error if not
    xhr.onload = function () {
        if (xhr.status === 200) {
            document.getElementById("load-data").click(); // Reload the data after deletion
        } else {
            console.error("Failed to delete item:", xhr.responseText);
        }
    };
}
