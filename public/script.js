const socket = io();

let nickname = prompt("Enter your nickname:", "Guest") || "Guest";
let currentRoom = "general"; // default room
let lastSentMessage = null;
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

    appendMessage(data);
 
});
lastSentMessage = new Date().toLocaleTimeString();
function addSystemMessage(msg) {
  const item = document.createElement('li');
  item.innerHTML = `<i>* ${msg}</i>`;
  messages.appendChild(item);
}
function sendChatMessage(msg) {
  if (msg.length > 500) {
    addSystemMessage("Message too long (max 500 characters)");
    return;
  }
  
  socket.emit('chat message', {
    user: nickname,
    message: msg,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    room: currentRoom
  });
}
