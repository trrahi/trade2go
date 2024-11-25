// Open the Add Item modal when the button is clicked
document.getElementById('add-item-button').addEventListener('click', () => {
    $('#addItemModal').modal('show');
});

// Handle form submission for adding a new item
document.getElementById('add-item-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const itemName = document.getElementById('item-name').value;
    const itemDesc = document.getElementById('item-desc').value;
    const imgUrl = document.getElementById('img-url').value;

    const itemToBeAdded = {
        itemName,
        itemDesc,
        imgUrl, // Include the Imgur link in the request
    };

    const token = localStorage.getItem('token'); // Assume token is stored in localStorage
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        await axios.post('http://localhost:3003/api/items', itemToBeAdded, config);
        $('#addItemModal').modal('hide'); // Close the modal
        fetchItems(); // Refresh the item list
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Failed to add item.');
    }
});


// Function to display the items
function displayItems(items) {
    const container = document.getElementById('items-container');
    container.innerHTML = ''; // Clear the container before adding new items

    items.forEach(item => {
        // Create the item box container
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item-box');

        // Create and append item name
        const itemName = document.createElement('h3');
        itemName.textContent = item.itemName;
        itemDiv.appendChild(itemName);

        // Create and append item description
        const itemDesc = document.createElement('p');
        itemDesc.textContent = item.itemDesc;
        itemDiv.appendChild(itemDesc);

        // Create and append item image
        if (item.imgUrl) {
            const itemImage = document.createElement('img');
            itemImage.src = item.imgUrl;
            itemImage.alt = `${item.itemName} Image`;
            itemImage.classList.add('item-image'); // Add a class for styling
            itemDiv.appendChild(itemImage);
        }

        // Create and append user information
        const userInfo = document.createElement('p');
        userInfo.classList.add('user-info');
        userInfo.textContent = `Ilmoittaja: ${item.user.userName} (${item.user.email})`;
        itemDiv.appendChild(userInfo);

        // Create and append a trade button
        const tradeBtn = document.createElement('button');
        tradeBtn.classList.add('btn', 'btn-green');
        tradeBtn.textContent = 'Vaihda';
        tradeBtn.onclick = () => alert('Initiate trade for ' + item.itemName);
        itemDiv.appendChild(tradeBtn);

        // Append the item box to the container
        container.appendChild(itemDiv);
    });
}

// Function to fetch the items using Axios
function fetchItems() {
    axios.get('http://localhost:3003/api/items') // Replace with your actual API URL
        .then(response => {
            displayItems(response.data); // Pass the fetched items to display function
        })
        .catch(error => {
            console.error('Error fetching items:', error);
            alert('Failed to load items.');
        });
}

// Call the fetchItems function to load the items on page load
fetchItems();


// Function to display user's items with delete option
document.getElementById('my-items-button').addEventListener('click', async () => {
    const container = document.getElementById('my-items-container');
    container.style.display = 'block'; // Show the "My Items" container
    container.innerHTML = '<p>Loading...</p>'; // Add a loading message

    const token = localStorage.getItem('token'); // Get the auth token
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        // Fetch all items from the API
        const response = await axios.get('http://localhost:3003/api/items', config);
        const allItems = response.data;

        // Decode token to get the logged-in user's ID
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentUserId = tokenPayload.id;

        // Filter items belonging to the logged-in user
        const userItems = allItems.filter(item => item.user.id === currentUserId);

        if (userItems.length === 0) {
            container.innerHTML = '<p>No items found.</p>';
            return;
        }

        container.innerHTML = ''; // Clear the container
        userItems.forEach(item => {
            // Create item box
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-box');

            const itemName = document.createElement('h3');
            itemName.textContent = item.itemName;
            itemDiv.appendChild(itemName);

            const itemDesc = document.createElement('p');
            itemDesc.textContent = item.itemDesc;
            itemDiv.appendChild(itemDesc);

            if (item.imgUrl) {
                const img = document.createElement('img');
                img.src = item.imgUrl;
                img.alt = `${item.itemName} Image`;
                img.classList.add('item-image');
                itemDiv.appendChild(img);
            }

            // Add a delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.onclick = async () => {
                try {
                    await axios.delete(`http://localhost:3003/api/items/${item._id}`, config);
                    itemDiv.remove(); // Remove the item from the DOM
                } catch (error) {
                    alert('Failed to delete item.');
                }
            };
            itemDiv.appendChild(deleteButton);

            container.appendChild(itemDiv);
        });
    } catch (error) {
        console.error('Error fetching items:', error);
        container.innerHTML = '<p>Failed to load your items.</p>';
    }
});


// Function to delete an item
async function deleteItem(itemId, itemElement) {
    const token = localStorage.getItem('token');
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    try {
        await axios.delete(`http://localhost:3003/api/items/${itemId}`, config);
        itemElement.remove(); // Remove item element from the DOM
        alert('Item deleted successfully!');
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item.');
    }
}
