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
                        <button onclick="editRoom('${room.id}', '${room.name}')">Rename</button>
                        <button onclick="deleteRoom('${room.id}')">Delete</button>
                    `; // Create a new div for each room with edit and delete buttons
                    roomItem.addEventListener('click', () => {
                        selectRoom(room);          // Load sensors for the selected room
                    });
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

// Function to select a room and load its sensors
function selectRoom(room) {
    console.log(`Selected room: ${room.name}`); // Log the selected room

    currentRoomId = room.id;       // Store the ID of the selected room
    const sensorSection = document.getElementById('sensorSection');       // Get the sensor section element
    const currentRoomName = document.getElementById('currentRoomName');       // Get the current room name element
    currentRoomName.innerText = room.name;       // Display the current room name
    sensorSection.style.display = 'block';       // Show the sensor section

    loadSensors(room.id);       // Load sensors for the selected room
}

/***********************************************
 * 
 *              SENSOR FUNCTIONALITIES
 * 
 ***********************************************/

// Function to fetch and display sensors for a room
function loadSensors(roomId) {
    fetch(`${API_URL}/rooms/${roomId}/sensors`)       // Fetch sensors for the selected room from the server
        .then(response => response.json())
        .then(sensors => {
            console.log('Sensors fetched: ', sensors);       // Log the response data
            const sensorList = document.getElementById('sensorList');
            sensorList.innerHTML = '';       // Clear the sensor list

            sensors.forEach(sensor => {
                const sensorItem = document.createElement('div');
                sensorItem.className = 'sensor';       // Create a new div for each sensor
                sensorItem.textContent = sensor.name;       // Set the sensor name as the text content
                sensorItem.innerHTML = `
                    <span>${sensor.name}</span>
                    <button onclick="editSensor('${sensor.id}', '${sensor.name}')">Rename</button>
                    <button onclick="deleteSensor('${sensor.id}')">Delete</button>
                `; // Create a new div for each sensor with edit and delete buttons
                /* sensorItem.addEventListener('click', () => {
                    selectSensor(sensor);          // Load measurements for the selected sensor
                });*/
                sensorList.appendChild(sensorItem);
            });
        })
        .catch(error => console.error('Error fetching sensors:', error));       // Handle errors
}

// Add sensor button functionality
document.getElementById("addSensorButton").addEventListener("click", () => {
    document.getElementById('sensorForm').style.display = 'block';       // Toggle the visibility of the room form
});

// Close button functionality
document.getElementById("closeSensorButton").addEventListener("click", () => {
    document.getElementById('sensorSection').style.display = 'none';       // Toggle the visibility of the room form
});

// Cancel button functionality
document.getElementById("cancelSensorButton").addEventListener("click", () => {
    document.getElementById('sensorName').value = '';                   // Clear the input field
    document.getElementById('sensorForm').style.display = 'none';       // Hide the sensor form
});

// Submit button functionality
document.getElementById("submitSensorButton").addEventListener("click", () => {
    const sensorName = document.getElementById('sensorName').value;       // Get the sensor name from the input field
    document.getElementById('sensorName').value = '';                   // Clear the input field
    document.getElementById('sensorForm').style.display = 'none';       // Hide the sensor form

    if (sensorName) {
        fetch(`${API_URL}/sensors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: sensorName, roomId: currentRoomId, measurements: [] })       // Send the new sensor data to the server
        })
        .then(data => {
            console.log('Sensor added: ', data);       // Log the response data
            document.getElementById('sensorName').value = '';                   // Clear the input field
            document.getElementById('sensorForm').style.display = 'none';       // Hide the sensor form
            loadSensors(currentRoomId);        // Refresh the sensor list
        })
        .catch(error => console.error('Error adding sensor:', error));       // Handle errors
    }
});


// Edit sensor function
function editSensor(id, name) {
    const newName = prompt("Enter new sensor name:", name);       // Prompt the user for a new room name
    if (newName) {
        fetch(`${API_URL}/sensor/${id}`, {
            method: 'PUT',        // Send a PUT request to update the room name
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName })       // Send the updated room data to the server
        })
        .then(() => loadSensors(currentRoomId));        // Reload the lit of rooms
    }
}

// Delete room function
function deleteSensor(sensorId) {
    fetch(`${API_URL}/sensors/${sensorId}`, {
        method: 'DELETE'        // Send a DELETE request to the server to delete the room
    })
    .then(() => loadSensors(currentRoomId));        // Reload the lit of rooms
}

// Function to select a sensor and load its measurements
/*
function selectSensor(sensor) {
    console.log(`Selected sensor: ${sensor.name}`); // Log the selected sensor

    currentSensorId = sensor.id;       // Store the ID of the selected room
    const measurementSection = document.getElementById('measurementSection');       // Get the sensor section element
    const currentSensorName = document.getElementById('currentSensorName');       // Get the current sensor name element
    currentSensorName.innerText = sensor.name;       // Display the current sensor name
    measurementSection.style.display = 'block';       // Show the measurement section

    loadMeasurements(sensor.id);       // Load measurements for the selected sensor
}
*/


/***********************************************
 * 
 *         MEASUREMENT FUNCTIONALITIES
 * 
 ***********************************************/
// Measurements: id, timestamp. value, comment
// Function to fetch and display measurements for a sensor




/***********************************************
 * 
 *                   OTHERS
 * 
 ***********************************************/
// Initial fetch
loadRooms();