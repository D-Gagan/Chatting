document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
  
    const form = document.querySelector('form');
    const input = document.querySelector('#m');
    const messages = document.querySelector('#messages');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
      }
    });
  
    socket.on('chat message', (msg) => {
      const li = document.createElement('li');
      li.textContent = msg;
      messages.appendChild(li);
    });
  });
  
