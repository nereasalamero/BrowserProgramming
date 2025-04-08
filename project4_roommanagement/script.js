/*
 *  Title:          Project 4. Room Management Application
 *  Author:         Nerea Salamero Labara
 *  Date:           2025-04-07
 *  File:           script.js
 *  Subject:        Browser Programming
 *  Description:    You are tasked with building a Room Management Application where users can
 *                  add, view, and select rooms. The application will consist of a frontend
 *                  (HTML, CSS, JavaScript) and a backend (using json-server to simulate a REST
 *                  API). This is an individual project, and your understanding of the code will
 *                  be thoroughly evaluated by the teacher through detailed questions.
 */

/***********************************************
 * 
 *         GLOBAL VARIABLES AND CONSTANTS
 * 
 ***********************************************/
const API_URL = "http://localhost:3000";    // Base URL for the API

let currentRoomId = null;       // Variable to store the ID of the currently selected room
let currentSensorId = null;     // Variable to store the ID of the currently selected sensor

/***********************************************
 * 
 *              ROOM FUNCTIONALITIES
 * 
 ***********************************************/

// Function to fetch and display rooms
function loadRooms(searchTerm = '') {
    fetch(`${API_URL}/rooms`)       // Fetch rooms from the server with optional search term
        .then(response => response.json())
        .then(rooms => {
            console.log('Rooms fetched: ', rooms);       // Log the response data
            const roomList = document.getElementById('roomList');
            roomList.innerHTML = '';       // Clear the room list

            rooms
                .filter(room => room.name.toLowerCase().includes(searchTerm.toLowerCase()))       // Filter rooms based on the search term
                .forEach(room => {
                    const roomItem = document.createElement('div');
                    roomItem.className = 'room';    // Create a new div for each room
                    roomItem.textContent = room.name;       // Set the room name as the text content
                    roomItem.innerHTML = `
                        <span>${room.name}</span>
                        <button onclick="editRoom('${room.id}', '${room.name}')">Edit</button>
                        <button onclick="deleteRoom('${room.id}')">Delete</button>
                    `; // Create a new div for each room with edit and delete buttons
                    /*roomItem.addEventListener('click', () => {
                        selectRoom(room);          // Load sensors for the selected room
                    });*/
                    roomList.appendChild(roomItem);
                });
        })
        .catch(error => console.error('Error fetching rooms:', error));       // Handle errors
}

document.querySelectorAll('.editRoomButton').forEach(button => {
    button.addEventListener('click', () => {
        const roomId = button.dataset.roomId;       // Get the room ID from the button's data attribute
        const roomName = button.dataset.roomName;       // Get the room name from the button's data attribute
        editRoom(roomId, roomName);       // Call the editRoom function with the room ID and name
    });
});


document.querySelectorAll('.deleteRoomButton').forEach(button => {
    button.addEventListener('click', () => {
        const roomId = button.dataset.roomId;       // Get the room ID from the button's data attribute
        const roomName = button.dataset.roomName;       // Get the room name from the button's data attribute
        deleteRoom(roomId);       // Call the editRoom function with the room ID and name
    });
});


// Search field functionality
document.getElementById('search').addEventListener('input', (event) => {
    loadRooms(event.target.value);
});

// Add room button functionality
document.getElementById("addRoomButton").addEventListener("click", () => {
    document.getElementById('roomForm').style.display = 'block';       // Toggle the visibility of the room form
});

// Cancel button functionality
document.getElementById("cancelRoomButton").addEventListener("click", () => {
    document.getElementById('roomName').value = '';                   // Clear the input field
    document.getElementById('roomForm').style.display = 'none';       // Hide the room form
});

// Submit button functionality
document.getElementById("submitRoomButton").addEventListener("click", () => {
    const roomName = document.getElementById('roomName').value;       // Get the room name from the input field
    document.getElementById('roomName').value = '';                   // Clear the input field
    document.getElementById('roomForm').style.display = 'none';       // Hide the room form

    if (roomName) {
        fetch(`${API_URL}/rooms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: roomName, sensors: [] })       // Send the new room data to the server
        })
        .then(data => {
            console.log('Room added: ', data);       // Log the response data
            document.getElementById('roomName').value = '';                   // Clear the input field
            document.getElementById('roomForm').style.display = 'none';       // Hide the room form
            loadRooms();        // Refresh the room list
        })
        .catch(error => console.error('Error adding room:', error));       // Handle errors
    }
});


// Edit room function
function editRoom(id, name) {
    const newName = prompt("Enter new room name:", name);       // Prompt the user for a new room name
    if (newName) {
        fetch(`${API_URL}/rooms/${id}`, {
            method: 'PUT',        // Send a PUT request to update the room name
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName })       // Send the updated room data to the server
        })
        .then(() => loadRooms());        // Reload the lit of rooms
    }
}

// Delete room function
function deleteRoom(roomId) {
    fetch(`${API_URL}/rooms/${roomId}`, {
        method: 'DELETE'        // Send a DELETE request to the server to delete the room
    })
    .then(() => loadRooms());        // Reload the lit of rooms
}


/***********************************************
 * 
 *              SENSOR FUNCTIONALITIES
 * 
 ***********************************************/




/***********************************************
 * 
 *         MEASUREMENT FUNCTIONALITIES
 * 
 ***********************************************/





/***********************************************
 * 
 *                   OTHERS
 * 
 ***********************************************/
// Initial fetch
loadRooms();