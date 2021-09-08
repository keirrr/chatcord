const chatMessagesElem = document.querySelector('.chat-messages')

const mainPanelElem = document.querySelector('.main-panel')
const mainPanelBgLayer = document.querySelector('.main-panel-bg-layer')

const usersListElem = document.querySelector('.users-list-panel')
const usersListBtn = document.querySelector('.users-list-btn')

let isSwipedLeft = false,
    isSwipedRight = false;
    isMainSwiped = false;

// Swipe events
document.addEventListener('swiped', function(e) {
    // Swipe left
    if (isSwipedLeft == false && isSwipedRight == false) {
        document.addEventListener('swiped-left', function(e) {
            mainPanelElem.classList.add('main-move-left')
            mainPanelBgLayer.style.opacity = '1'
            usersListElem.style.display = 'flex'
            isSwipedLeft = true
            setTimeout(() => {
                isMainSwiped = true
            }, 200)
        });
    }
    else if (isSwipedLeft == true && isSwipedRight == false) {
        document.addEventListener('swiped-right', function(e) {
            mainPanelElem.classList.remove('main-move-left')
            mainPanelBgLayer.style.opacity = '0'
            setTimeout(() => {
                usersListElem.style.display = 'none'
                isMainSwiped = false
            }, 200)
            isSwipedLeft = false
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
        }, 200)
        isSwipedLeft = false
    }
})

// Users list button event
usersListBtn.addEventListener('click', function(e) {
    if (isSwipedLeft == false && isSwipedRight == false && isMainSwiped == false) {
        console.log('click')
        mainPanelElem.classList.add('main-move-left')
        mainPanelBgLayer.style.opacity = '1'
        usersListElem.style.display = 'flex'
        isSwipedLeft = true
        setTimeout(() => {
            isMainSwiped = true
        }, 200)
    }
})