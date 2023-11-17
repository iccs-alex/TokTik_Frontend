import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
});

const URL = "127.0.0.1";

export const socket = io(URL);

socket.connect();
state.connected = true;

export function joinRoom(roomName) {
  console.log("Joined room: " + roomName);
  socket.emit('joinRoom', roomName);
}

export function leaveRoom(roomName) {
  console.log("Left room: " + roomName);
  socket.emit('leaveRoom', roomName);
}


socket.on("disconnect", () => {

  console.log("Disconnected...");

});