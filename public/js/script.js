const chatForm = document.querySelector('.chat--form')
const chatContainer = document.querySelector('.chat-messages')

const socket = io({transports: ['websocket'], upgrade: false});

// Message from server
socket.on('message', (msgDetails) => {
    //console.log(msgDetails)
    outputMessage(msgDetails.msg, msgDetails.usr, msgDetails.avk)
})

// Amount of connected users
const activeUsersAmount = document.querySelector('.active-users')

socket.on('activeUsersAmount', (amount) => {
    activeUsersAmount.textContent = amount
})

// Active users list
const activeUsersList = document.querySelector('.active-users-list')

socket.on('activeUsersInfo', (activeUsers) => {
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
function outputMessage(message, username, avatar) {
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
    div.innerHTML = `<div class="mr-4">
        <img src="${avatar}" class="h-12 w-12 rounded-full">
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