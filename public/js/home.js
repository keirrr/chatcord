const chatMessagesElem = document.querySelector('.chat-messages')

const mainPanelElem = document.querySelector('.main-panel')
const mainPanelBgLayer = document.querySelector('.main-panel-bg-layer')
const menuBtn = document.querySelector('.menu-btn')

const usersListElem = document.querySelector('.users-list-panel')
const usersListBtn = document.querySelector('.users-list-btn')

const menuElem = document.querySelector('.menu')

let isSwipedLeft = false,
    isSwipedRight = false;
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

