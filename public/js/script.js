const chatForm = document.querySelector('.chat--form')
const chatContainer = document.querySelector('.chat-messages')

const socket = io({transports: ['websocket'], upgrade: false});

// Update user avatar
socket.on('updateUserAvatar', (userAvatarUrl) => {
    const userAvatarElem = document.querySelector('.user-avatar')
    userAvatarElem.src = userAvatarUrl
})

let prevMessageAuthor = ''
// Message from server
socket.on('message', (msgDetails) => {
    //console.log(msgDetails)
    outputMessage(msgDetails.msg, msgDetails.msgId, msgDetails.usr, msgDetails.avk)
})

// Update messages history
socket.on('updateMessages', (messages) => {
    console.log(messages)
    let prevMessageAuthor = '';
    messages.messages.forEach((elem) => {
        let message = elem.msg,
            messageId = elem.msgId,
            username = elem.usr,
            avatar = elem.avk,
            hour = new Date(elem.timestamp),
            minute = new Date(elem.timestamp)
        hour = new Date(hour.getTime() + ( hour.getTimezoneOffset() * 60000 )).getHours()
        minute = new Date(minute.getTime() + ( minute.getTimezoneOffset() * 60000 )).getMinutes()

        if (prevMessageAuthor != username) {
            printUserFirstMessage(message, messageId, username, avatar, hour, minute)
            prevMessageAuthor = username;
        } else {
            printUserNextMessage(message, messageId)
        }
    })
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
function outputMessage(message, messageId, username, avatar) {
    let date = new Date();
    let hour = date.getHours()
    let minute = date.getMinutes()

    if (minute < 10) {
        minute = '0' + minute
    }


    if (prevMessageAuthor == username) {
        printUserNextMessage(message, messageId)
    } else {
        printUserFirstMessage(message, messageId, username, avatar, hour, minute)
    }

    chatContainer.scrollTop = chatContainer.scrollHeight

    prevMessageAuthor = username;
}

const printUserFirstMessage = (message, messageId, username, avatar, hour, minute) => {
    const div = document.createElement('div')

    div.dataset.id = messageId

    div.classList.add('flex', 'row', 'p-1', 'mb-4', 'hover:bg-dark-gray')
    div.innerHTML = `<div class="mr-4">
        <img src="${avatar}" class="h-12 w-12 rounded-full">
    </div>

    <div class="message-info">
        <div class="flex items-center">
            <span class="author text-red-500 font-bold mr-2">${username}</span>
            <span class="text-gray-400 text-xs">${hour}:${minute}</span>
        </div>

        <div class="message-text">
            <p class="break-words whitespace-normal">${message}</p>
        </div>
    </div>`;
    document.querySelector('.scroller-content').appendChild(div)
}

const printUserNextMessage = (message, messageId) => {
        const p = document.createElement('p')

        p.dataset.id = messageId

        p.classList.add('break-words', 'whitespace-normal')
        p.innerHTML = `${message}`;

        prevMessage = document.querySelector('.scroller-content > .flex:last-child > .message-info > .message-text')
        prevMessage.appendChild(p)
}