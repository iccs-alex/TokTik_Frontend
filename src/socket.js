import { reactive } from "vue";
import { io } from "socket.io-client";
import { log } from "node:console";

export const state = reactive({
  connected: false
});

const URL = "127.0.0.1";

export const socket = io(URL);

let users = [];

socket.on("users", (users_) => {
  // put the current user first, and then sort by username
  users = users_
  console.log("Connected users");
  console.log(users);
});


socket.on("user connected", (user) => {
  users.push(user);
  console.log("User connected: " + user.username);
});


socket.auth = { username: "blue" };
socket.connect();
connected = true

socket.on("disconnect", () => {

  console.log("Disconnected...");

});