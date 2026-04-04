const socket = io();
let username = '';

const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('messageInput');
const messages = document.getElementById('messages');

function joinChat() {
    username = usernameInput.value.trim();
    if (username) {
        socket.emit('join', username);
        loginScreen.classList.remove('active');
        chatScreen.classList.add('active');
        messageInput.focus();
    }
}

function leaveChat() {
    location.reload();
}

function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('chatMessage', message);
        messageInput.value = '';
    }
}

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

socket.on('previousMessages', (prevMessages) => {
    prevMessages.forEach(addMessage);
});

socket.on('message', addMessage);
socket.on('userJoined', (user) => addSystemMessage(`${user} joined 🐦`));
socket.on('userLeft', (user) => addSystemMessage(`${user} left`));

function addMessage(msg) {
    const div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `<strong>${msg.username}</strong> <span>${msg.timestamp}</span><p>${msg.message}</p>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function addSystemMessage(text) {
    const div = document.createElement('div');
    div.style.cssText = 'text-align:center;color:#666;font-style:italic;margin:1rem 0;font-size:0.9rem;';
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}
