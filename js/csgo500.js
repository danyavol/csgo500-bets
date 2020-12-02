let isActive = false;
let gameData = {
    startBalance: document.getElementById('balance'),
    currBalance: document.getElementById('balance')
}


let bet2x = document.getElementById('bet-btn-2x');

let history = document.getElementById('past-queue-wrapper');

let balance = document.getElementById('balance');

document.getElementById('bet-input');

// history.lastChild.classList.contains('past-0'); // выиграло серок

console.log('CSGO500 Bets injected');

// past-spoiler



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.start) {
        // Начинаю работу
        gameData.getFromBet = request.getFromBet;
        gameData.maxBalance = request.maxBalance;

        isActive = true;
        console.log(gameData);
    } else if (request.stop) {
        // Прекращаю
        isActive = false;

    }
    console.log(request.start);
    sendResponse(true);
})


let observer = new MutationObserver(betting);
observer.observe(document.getElementById('past-queue-wrapper'), {childList: true});

function betting() {
    if (!history.lastChild.classList.contains('past-spoiler') && isActive) {
        if (history.lastChild.classList.contains('past-0')) {
            console.log('Победа');
        } else {
            console.log('Поражение');
        }
    }
}