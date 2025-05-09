const socket = io();

let nickname = prompt("Enter your nickname:", "Guest") || "Guest";
let currentRoom = "general"; // default room

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

joinRoom(currentRoom);

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const msg = input.value.trim();

  if (!msg) return;

  if (msg.startsWith("/nick ")) {
    const newNick = msg.split(" ")[1];
    if (newNick) {
      nickname = newNick;
      addSystemMessage(`You are now known as ${nickname}`);
    }
  } else if (msg.startsWith("/join ")) {
    const roomName = msg.split(" ")[1].replace("#", "");
    if (roomName) {
      joinRoom(roomName);
    }
  } else {
    socket.emit('chat message', {
      user: nickname,
      message: msg,
      time: new Date().toLocaleTimeString(),
      room: currentRoom
    });
  }

  input.value = '';
});

function joinRoom(room) {
  socket.emit('join room', { room, prevRoom: currentRoom });
  currentRoom = room;
  messages.innerHTML = ''; // clear previous messages
  addSystemMessage(`Joined room: #${room}`);
}

socket.on('chat message', function(data) {
  const item = document.createElement('li');
  item.innerHTML = `[${data.time}] &lt;${data.user}&gt; ${data.message}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
});

function addSystemMessage(msg) {
  const item = document.createElement('li');
  item.innerHTML = `<i>* ${msg}</i>`;
  messages.appendChild(item);
}
