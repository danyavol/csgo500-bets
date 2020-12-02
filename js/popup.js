// Form
let getFromBet = document.getElementById('getFromBet');
let maxBalance = document.getElementById('maxBalance');


// Stats
let stats = document.getElementById('stats');

let currentBalance = document.getElementById('currentBalance');
let betsCounter = document.getElementById('betsCounter');
let startBalance = document.getElementById('startBalance');
let maxBalance_a = document.getElementById('maxBalance_a');
let getFromBet_a = document.getElementById('getFromBet_a');
let startTime = document.getElementById('startTime');




chrome.storage.sync.get(['active'], (data) => {
    if (!data.active) stats.style.display = 'none';
    else updateState();
})






chrome.runtime.onMessage.addListener( (request) => {
    console.log('msg from tab', request);
    if (request.onload) {
        chrome.storage.sync.set({active: false});
    } else {
        chrome.storage.sync.set(request)
        updateState();
    }
});



//Events
document.getElementById('startBetting').addEventListener('click', () => {
    chrome.tabs.query({active: true}, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {start: true, getFromBet: getFromBet.value, maxBalance: maxBalance.value}, (response) => {
                if (response) {
                    chrome.storage.sync.set({active: true, startTime: getTime(), status: 'Автоставка запущена...'});
                    updateState();
                    stats.style.display = 'block';
                }
            });
        });
    });
})

document.getElementById('stopBetting').addEventListener('click', () => {
    chrome.tabs.query({active: true}, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {stop: true}, (response) => {
                if (response) {
                    chrome.storage.sync.set({active: false});
                    stats.style.display = 'none';
                }
            });
        });
    });
})



function getTime() {
    let now = new Date();
    return zero(now.getHours()) + ':' + zero(now.getMinutes()) + ', ' + zero(now.getDate()) + '.' + zero(now.getMonth()+1);

    function zero(num) {
        if (num < 10) return '0'+num;
        else return num; 
    }
}



function updateState(gameData) {

    chrome.storage.sync.get(['currentBalance', 'betsCounter', 'startBalance', 'maxBalance', 'getFromBet', 'startTime', 'status'], (data) => {
        console.log(data.currentBalance);
        currentBalance.innerText = data.currentBalance;
        betsCounter.innerText = data.betsCounter;
        startBalance.innerText = data.startBalance;
        maxBalance_a.innerText = data.maxBalance;
        getFromBet_a.innerText = data.getFromBet;
        startTime.innerText = data.startTime;
        document.getElementById('title').innerText = data.status;
    })
    
}