const gameData = {}

let isActive = false;


let bet2x = document.getElementById('bet-btn-2x');
let history = document.getElementById('past-queue-wrapper');
let balance = document.querySelector('#balance');
document.getElementById('bet-input');


console.log('CSGO500 Bets injected');


window.addEventListener('unload', () => {
    chrome.runtime.sendMessage({onload: true});
})




chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.start) {
        // Начинаю работу
        console.log(+balance.innerText.split(',').join(''));
        gameData.startBalance = +balance.innerText.split(',').join('');
        gameData.currentBalance = +balance.innerText.split(',').join('');
        gameData.maxBalance = +request.maxBalance;
        gameData.getFromBet = +request.getFromBet;
        gameData.currentBet = +request.getFromBet;
        gameData.lostOnBets = 0;
        gameData.loseStreak = 0;
        gameData.betsCounter = 0;

        placeBet(gameData, true);
        
        isActive = true;
        // console.log('Начать');
    } else if (request.stop) {
        // Прекращаю
        isActive = false;
        // console.log('Остановить');
    }
    sendResponse({...gameData, status: 'Автоставка запущена...'});
})


let observer = new MutationObserver(betting);
observer.observe(document.getElementById('past-queue-wrapper'), {childList: true});


function betting() {
    if (!history.lastChild.classList.contains('past-spoiler') && isActive) {
        if (history.lastChild.classList.contains('past-0')) {
            // Победа

            gameData.loseStreak = 0;
            gameData.lostOnBets = 0;
            gameData.currentBalance += gameData.currentBet * 2;

            // console.log(`Победа! Баланс - ${gameData.currentBalance} очков. Количество ставок - ${gameData.betsCounter}`);

            calculateNextBet(gameData);

            if (gameData.currentBalance >= gameData.maxBalance) {
                // Цель достигнута
                // console.log(`_____ Цель ${gameData.maxBalance} очков достигнута. Баланс составляет ${gameData.currentBalance} очков`);
                isActive = false;

                chrome.runtime.sendMessage({...gameData, status: 'Цель достигнута!'});
                return;
            }
            chrome.runtime.sendMessage(gameData);
            
            
            placeBet(gameData);
        } else {
            // Поражение

            gameData.loseStreak++;
            gameData.lostOnBets += gameData.currentBet;

            // console.log(`Поражение! Баланс - ${gameData.currentBalance} очков. Количество ставок - ${gameData.betsCounter}`);
            // console.log('lostOnBets == ', gameData.lostOnBets, 'loseStreak == ', gameData.loseStreak);

            calculateNextBet(gameData);

            if (gameData.currentBet > gameData.currentBalance) {
                // Все деньги слиты
                // console.log('_____ Недостаточно средств для ставки');
                isActive = false;

                chrome.runtime.sendMessage({...gameData, status: 'Ну всё, габэла..'});
                return;
            }

            chrome.runtime.sendMessage(gameData);

            placeBet(gameData);
        }
    }
}



function calculateNextBet(options) { // только серое, максимум 10 лузов подряд
    const minimalBet = 10;
    const maxLoseStreak = 10;

    if (options.loseStreak >= maxLoseStreak) {
        options.lostOnBets = 0;
    }
    
    let bet = Math.ceil( (options.getFromBet + options.lostOnBets) / 2 );
    if (bet < minimalBet) bet = minimalBet;

    options.currentBet = bet;
}

function placeBet(options, now=false) {
    document.getElementById('bet-input').value = options.currentBet;
    options.currentBalance -= options.currentBet;
    options.betsCounter++;

    setTimeout(() => {
        chrome.runtime.sendMessage(gameData);
        document.getElementById('bet-btn-2x').dispatchEvent( new Event('click') );
    }, now ? 0 : 10000);
}