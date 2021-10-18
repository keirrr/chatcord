const chatForm = document.querySelector('.chat--form')
const chatContainer = document.querySelector('.chat-messages')

const socket = io({transports: ['websocket'], upgrade: false});

// Message from server
socket.on('message', (msgDetails) => {
    //console.log(msgDetails)
    outputMessage(msgDetails.msg, msgDetails.usr)
})

// Amount of connected users
const activeUsersAmount = document.querySelector('.active-users')

socket.on('activeUsersAmount', (amount) => {
    activeUsersAmount.textContent = amount
})

// Active users list
const activeUsersList = document.querySelector('.active-users-list')

socket.on('activeUsersInfo', (activeUsers) => {
    console.log('updating users list')
    console.log(activeUsers)
    // Empty the list
    activeUsersList.textContent = ''

    activeUsers.forEach(user => {
        // Create list item element
        let li = document.createElement('li')
        li.classList.add('flex', 'items-center', 'mb-4')

        // Create user's avatar image element
        let avatar = document.createElement('img')
        avatar.src = user[1]
        avatar.classList.add('h-8', 'rounded-full', 'mr-4')

        // Create user's username text
        let username = document.createElement('span')
        username.textContent = user[0]

        li.append(avatar)
        li.append(username)

        activeUsersList.appendChild(li)
    });

    console.log('update user list')
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = e.target.elements.msg.value

    const usr = document.cookie
    .split('; ')
    .find(row => row.startsWith('username='))
    .split('=')[1];

    let msgDetails = {
        msg,
        usr
    }

    // Emit message to server
    socket.emit('chatMessage', msgDetails)
  
    // Clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

// Output message to DOM
function outputMessage(message, username) {
    let date = new Date();
    let hour = date.getHours()
    let minute = date.getMinutes()

    if (minute < 10) {
        minute = '0' + minute
    }

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
            <span class="text-red-500 font-bold mr-2">${username}</span>
            <span class="text-gray-400 text-xs">${hour}:${minute}</span>
        </div>

        <div>
            <p class="break-words whitespace-normal">${message}</p>
        </div>
    </div>`;
    document.querySelector('.scroller-content').appendChild(div)

    chatContainer.scrollTop = chatContainer.scrollHeight
}