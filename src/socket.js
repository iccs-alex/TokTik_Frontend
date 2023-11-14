import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
});

const URL = "127.0.0.1";

export const socket = io(URL);

let users = [];

socket.on("users", (text) => {
  console.log("Connected users: " + text);
});

socket.on("user connected", (user) => {
  console.log("User connected");
});

socket.connect();
state.connected = true;

socket.on("disconnect", () => {

  console.log("Disconnected...");

});


export function joinRoom(roomName) {
  socket.emit('joinRoom', roomName);
}

export function leaveRoom(roomName) {
  socket.emit('leaveRoom', roomName);
}