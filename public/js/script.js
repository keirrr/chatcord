const chatForm = document.querySelector('.chat--form')
const chatContainer = document.querySelector('.chat-messages')
const chatScrollerContent = document.querySelector('.scroller-content')

const socket = io({transports: ['websocket'], upgrade: false});

// Disable context menu
document.addEventListener('contextmenu', event => event.preventDefault());

// Slide down chat on load
window.addEventListener('load', () => {
    chatContainer.scrollTop = chatContainer.scrollHeight
})

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

// Private message
socket.on('privateMessage', (msgDetails) => {
    console.log("PRIV")
    console.log(msgDetails)
})


// Update messages history
// Loader
const messagesLoader = () => {
    let msgLoaderDiv = document.createElement('div');
    msgLoaderDiv.classList.add('msgLoader', 'h-auto', 'w-auto', 'flex', 'flex-col' , 'p-1', 'mb-4')
    msgLoaderDiv.animate([
        { opacity: '1' },
        { opacity: '.5' },
        { opacity: '1' }
      ], {
        duration: 1000,
        iterations: Infinity
      })

    function msgLoaderr () {
        return `
        <div class="flex mt-4">
            <div class="mr-4 h-12 w-12 rounded-full bg-vlight-gray"></div>
        
            <div>
                <div class="flex items-center py-2">
                    <div class="h-5 w-24 mr-2 bg-vlight-gray rounded-full"></div>
                    <span class="h-5 w-12 bg-vlight-gray rounded-full"></span>
                </div>
        
                <div>
                    <div class="h-4 w-20 mb-2 bg-vlight-gray rounded-full"></div>
                    <div class="h-4 w-10 mb-2 bg-vlight-gray rounded-full"></div>
                    <div class="h-4 w-32 bg-vlight-gray rounded-full"></div>
                </div>
            </div>
        </div>
        `;
    }

    msgLoaderDiv.innerHTML = msgLoaderr()
    msgLoaderDiv.innerHTML += msgLoaderr()
    msgLoaderDiv.innerHTML += msgLoaderr()

    chatScrollerContent.appendChild(msgLoaderDiv)
}
messagesLoader()

socket.on('updateMessages', async (messages) => {
    let prevMessageAuthor = '';
    await messages.messages.forEach((elem) => {
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
    chatContainer.scrollTop = chatContainer.scrollHeight

    chatScrollerContent.animate([
        { opacity: '0' },
        { opacity: '1' }
      ], {
        duration: 500,
        iterations: 1
      });

    const msgLoaderElem = document.querySelector('.msgLoader')
    msgLoaderElem.remove()
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

    // Context menu for users list
    const userInfoElem = document.querySelectorAll('.active-users-list > .flex')
    const showUsersListContextMenu = (e) => {
        if (document.querySelector('.users-list-context-menu')){
            const usersListContextMenu = document.querySelector('.users-list-context-menu')
            usersListContextMenu.parentNode.removeChild(usersListContextMenu)
        }

        let pointerX = e.clientX;
        let pointerY = e.clientY;

        const nav = document.createElement('nav')
        nav.classList.add('users-list-context-menu', 'absolute', 'z-50', 'h-auto', 'w-auto', 'bg-gray-700', 'rounded-sm')
        nav.innerHTML = `<button class="send-msg p-2 m-2 hover:bg-gray-600">Wyślij wiadomość</button>`
        document.querySelector('body').appendChild(nav)
        
        const usersListContextMenu = document.querySelector('.users-list-context-menu')
        menuWidth = usersListContextMenu.offsetWidth
        menuHeight = usersListContextMenu.offsetHeight
        
        if (pointerY + window.innerHeight < menuHeight)
            usersListContextMenu.style.top = pointerY - menuHeight + 'px'
        else
            usersListContextMenu.style.top = pointerY + 'px'

        if (pointerX < menuWidth)
            usersListContextMenu.style.left = pointerX + 'px'
        else
            usersListContextMenu.style.left = pointerX - menuWidth + 'px'
    }

    userInfoElem.forEach(elem => {
        elem.addEventListener('click', (e) => {
            showUsersListContextMenu(e)
        })
        
        elem.addEventListener('contextmenu', (e) => {
            showUsersListContextMenu(e)
        })
    })

    window.addEventListener('click', (e) => {
        if (document.querySelector('.users-list-context-menu')){
            const usersListContextMenu = document.querySelector('.users-list-context-menu')
            usersListContextMenu.remove()
        }
    })
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
    socket.emit('privateMessage', msgDetails)
  
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
    chatScrollerContent.appendChild(div)
}

const printUserNextMessage = (message, messageId) => {
        const p = document.createElement('p')

        p.dataset.id = messageId

        p.classList.add('break-words', 'whitespace-normal')
        p.innerHTML = `${message}`;

        prevMessage = document.querySelector('.scroller-content > .flex:last-child > .message-info > .message-text')
        prevMessage.appendChild(p)
}