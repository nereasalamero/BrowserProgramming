const API = "http://localhost:3000";

const roomForm = document.getElementById("roomForm");
const roomNameInput = document.getElementById("roomName");
const roomList = document.getElementById("roomList");

const sensorModal = document.getElementById("sensorModal");
const closeSensorModal = document.querySelector(".close-sensor");
const modalRoomName = document.getElementById("modalRoomName");
const sensorList = document.getElementById("sensorList");
const sensorForm = document.getElementById("sensorForm");
const sensorTypeInput = document.getElementById("sensorType");

const measurementList = document.getElementById("measurementList");
const measurementForm = document.getElementById("measurementForm");
const measurementValueInput = document.getElementById("measurementValue");

let currentRoomId = null;
let currentSensorId = null;

roomForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = roomNameInput.value.trim();
  if (!name) return;

  await fetch(`${API}/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });

  roomNameInput.value = "";
  loadRooms();
});

sensorForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const type = sensorTypeInput.value.trim();
  if (!type || currentRoomId === null) return;

  await fetch(`${API}/sensors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, roomId: currentRoomId })
  });

  sensorTypeInput.value = "";
  loadSensorsForRoom(currentRoomId);
});

measurementForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const value = parseFloat(measurementValueInput.value);
  if (isNaN(value) || currentSensorId === null) return;

  await fetch(`${API}/measurements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value, sensorId: currentSensorId })
  });

  measurementValueInput.value = "";
  loadMeasurements(currentSensorId);
});

closeSensorModal.addEventListener("click", () => {
  sensorModal.classList.add("hidden");
  sensorList.innerHTML = "";
  measurementList.innerHTML = "";
});

function openRoomDetail(room) {
  currentRoomId = room.id;
  modalRoomName.innerText = room.name;
  sensorModal.classList.remove("hidden");
  loadSensorsForRoom(room.id);
}

async function loadRooms() {
  const res = await fetch(`${API}/rooms`);
  const rooms = await res.json();
  roomList.innerHTML = "";

  rooms.forEach((room) => {
    const div = document.createElement("div");
    div.className = "room";
    div.innerText = room.name;
    div.addEventListener("click", () => openRoomDetail(room));
    roomList.appendChild(div);
  });
}

async function loadSensorsForRoom(roomId) {
  const res = await fetch(`${API}/sensors?roomId=${roomId}`);
  const sensors = await res.json();
  sensorList.innerHTML = "";

  sensors.forEach((sensor) => {
    const li = document.createElement("li");
    li.innerText = sensor.type;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => {
      currentSensorId = sensor.id;
      loadMeasurements(sensor.id);
    });
    sensorList.appendChild(li);
  });
}

async function loadMeasurements(sensorId) {
  const res = await fetch(`${API}/measurements?sensorId=${sensorId}`);
  const measurements = await res.json();
  measurementList.innerHTML = "";

  measurements.forEach((m) => {
    const li = document.createElement("li");
    li.innerText = m.value;
    measurementList.appendChild(li);
  });
}

loadRooms();
