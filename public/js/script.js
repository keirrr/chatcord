//
// HOME //
//
const chatMessagesElem = document.querySelector('.chat-messages')

const mainPanelElem = document.querySelector('.main-panel')
const mainPanelBgLayer = document.querySelector('.main-panel-bg-layer')
const menuBtn = document.querySelector('.menu-btn')

const usersListElem = document.querySelector('.users-list-panel')
const usersListBtn = document.querySelector('.users-list-btn')

const menuElem = document.querySelector('.menu')

let isSwipedLeft = false,
    isSwipedRight = false,
    isMainSwiped = false;

//console.log('Left: ' + isSwipedLeft + ' || Right: ' + isSwipedRight + ' || Main: ' + isMainSwiped)

const swipeLeftCenter = () => {
    if ( isMainSwiped == false ) {
        //console.log('swipe left from center')
        mainPanelElem.classList.add('main-move-left')
        mainPanelBgLayer.style.opacity = '1'
        usersListElem.style.display = 'flex'
        setTimeout(() => {
            isSwipedLeft = true
            isMainSwiped = true
            //console.log('Left: ' + isSwipedLeft + ' || Right: ' + isSwipedRight + ' || Main: ' + isMainSwiped)
        }, 200)
    }
}

const swipeRightCenter = () => {
    if ( isMainSwiped == false ) {
        //console.log('swipe right from center')
        mainPanelElem.classList.add('main-move-right')
        mainPanelBgLayer.style.opacity = '1'
        menuElem.style.transform = 'translateY(-64px)'
        setTimeout(() => {
            isSwipedRight = true
            isMainSwiped = true
            //console.log('Left: ' + isSwipedLeft + ' || Right: ' + isSwipedRight + ' || Main: ' + isMainSwiped)
        }, 200)
    }  
}


// Swipe events
document.addEventListener('swiped', function(e) {
    if (isSwipedLeft == false && isSwipedRight == false && isMainSwiped == false) {
        // Swipe left when main panel is not swipe
        document.addEventListener('swiped-left', swipeLeftCenter)

        // Swipe right when main panel is not swipe
        document.addEventListener('swiped-right', swipeRightCenter)

    } else if (isSwipedLeft == true && isSwipedRight == false && isMainSwiped == true) {
        document.addEventListener('swiped-right', function(e) {
            //console.log('swipe right to center')
            mainPanelElem.classList.remove('main-move-left')
            mainPanelBgLayer.style.opacity = '0'
            setTimeout(() => {
                usersListElem.style.display = 'none'
                isMainSwiped = false
                isSwipedLeft = false
                //console.log('Left: ' + isSwipedLeft + ' || Right: ' + isSwipedRight + ' || Main: ' + isMainSwiped)
            }, 200)
        });
    } else if (isSwipedLeft == false && isSwipedRight == true && isMainSwiped == true) {
        document.addEventListener('swiped-left', function() {
            //console.log('swipe left to center')
            //console.log('SW Left: ' + isSwipedLeft + ' || Right: ' + isSwipedRight + ' || Main: ' + isMainSwiped)
            mainPanelElem.classList.remove('main-move-right')
            mainPanelBgLayer.style.opacity = '0'
            menuElem.style.transform = ''
            setTimeout(() => {
                isSwipedRight = false
                isMainSwiped = false
                //console.log('SW2 Left: ' + isSwipedLeft + ' || Right: ' + isSwipedRight + ' || Main: ' + isMainSwiped)
            }, 200)
        });
    }
});

// Back if clicked on main panel
mainPanelElem.addEventListener('click', () => {
    if (isSwipedLeft == true && isSwipedRight == false && isMainSwiped == true) {
        mainPanelElem.classList.remove('main-move-left')
        mainPanelBgLayer.style.opacity = '0'
        setTimeout(() => {
            usersListElem.style.display = 'none'
            isMainSwiped = false
            isSwipedLeft = false
            //console.log('Left: ' + isSwipedLeft + ' || Right: ' + isSwipedRight + ' || Main: ' + isMainSwiped)
        }, 200)
    } else if (isSwipedLeft == false && isSwipedRight == true && isMainSwiped == true) {
        mainPanelElem.classList.remove('main-move-right')
        mainPanelBgLayer.style.opacity = '0'
        menuElem.style.transform = ''
        setTimeout(() => {
            isSwipedRight = false
            isMainSwiped = false
            //console.log('Left: ' + isSwipedLeft + ' || Right: ' + isSwipedRight + ' || Main: ' + isMainSwiped)
        }, 200)
    }
})

// Users list button event
usersListBtn.addEventListener('click', function(e) {
    if (isSwipedLeft == false && isSwipedRight == false && isMainSwiped == false) {
        mainPanelElem.classList.add('main-move-left')
        mainPanelBgLayer.style.opacity = '1'
        usersListElem.style.display = 'flex'
        isSwipedLeft = true
        setTimeout(() => {
            isMainSwiped = true
        }, 200)
    }
})

// Menu button event
menuBtn.addEventListener('click', function(e) {
    if (isSwipedLeft == false && isSwipedRight == false && isMainSwiped == false) {
        mainPanelElem.classList.add('main-move-right')
        mainPanelBgLayer.style.opacity = '1'
        menuElem.style.transform = 'translateY(-64px)'
        isSwipedRight = true
        setTimeout(() => {
            isMainSwiped = true
            isSwipedRight = true
        }, 200)
    }
})

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
    const showUsersListContextMenu = (e, elem) => {
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

        const sendPrivMsgBtn = document.querySelector('.send-msg');
        sendPrivMsgBtn.addEventListener('click', () => {
            console.log("Open priv")
            // Swipe to center
            mainPanelElem.classList.remove('main-move-left')
            mainPanelBgLayer.style.opacity = '0'
            setTimeout(() => {
                usersListElem.style.display = 'none'
                isMainSwiped = false
                isSwipedLeft = false
            }, 200)

            // Set channel type icon to @
            const svgElem = document.querySelector('.channel-type-icon')
            svgElem.remove

            let svgContainer = document.querySelector('.channel-type')
            svgContainer.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="channel-type-icon h-6 w-6" viewBox="0 0 20 20" fill="#babbc0">
                    <path fill-rule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clip-rule="evenodd" />
                </svg>`

            // Change channel name
            const channelName = document.querySelector('.channel-name')
            let user = elem.querySelector('span').textContent
            channelName.textContent = user

            socket.emit('openPrivateRoom', user)
        })
    }

    userInfoElem.forEach(elem => {
        elem.addEventListener('click', (e) => {
            showUsersListContextMenu(e)
        })
        
        elem.addEventListener('contextmenu', (e) => {
            showUsersListContextMenu(e, elem)
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
    div.classList.add('flex', 'row', 'p-1', 'mb-4', 'last:mb-0', 'hover:bg-dark-gray')
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