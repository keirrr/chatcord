const chatForm = document.querySelector('.chat--form')

const socket = io();

// Message from server
socket.on('message', message => {
    console.log(message)
    outputMessage(message)
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = e.target.elements.msg.value

    // Emit message to server
    socket.emit('chatMessage', msg)

    // Clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

// Output message to DOM
function outputMessage(message) {
    let date = new Date()
    let hour = date.getHours()
    let minute = date.getMinutes()

    const usernameSpan = document.querySelector('.username')
    const username = usernameSpan.dataset.username

    const div = document.createElement('div')

    div.classList.add('flex')
    div.classList.add('row')
    div.classList.add('px-1')
    div.classList.add('mb-4')
    div.innerHTML = `<div class="mr-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
          </svg>
    </div>

    <div>
        <div class="flex items-center">
            <span class="text-red-500 font-bold mr-2">${username} </span>
            <span class="text-gray-400 text-xs">${hour}:${minute}</span>
        </div>

        <div>
            <p>${message}</p>
        </div>
    </div>`;
    document.querySelector('.chat-messages').appendChild(div)
}