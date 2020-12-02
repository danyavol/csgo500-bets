chrome.storage.sync.get(['active'], (result) => {
    if (result.active) {
        console.log('active true');
        getFromBet.disabled = true;
        maxBalance.disabled = true;
        startBetting.disabled = true;
        stopBetting.disabled = false;
    } else {
        console.log('active false');
        getFromBet.disabled = false;
        maxBalance.disabled = false;
        startBetting.disabled = false;
        stopBetting.disabled = true;
    }
    
})



document.getElementById('startBetting').addEventListener('click', () => {
    chrome.tabs.query({active: true}, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {start: true, getFromBet: getFromBet, maxBalance: maxBalance}, (response) => {
                console.log(response);
                if (response) {
                    chrome.storage.sync.set({active: true});
                }
            });
        });
    });
})

document.getElementById('stopBetting').addEventListener('click', () => {
    chrome.tabs.query({active: true}, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {stop: true}, (response) => {
                console.log(response);
                if (response) {
                    chrome.storage.sync.set({active: false});
                }
            });
        });
    });
})