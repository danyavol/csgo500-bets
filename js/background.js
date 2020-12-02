chrome.runtime.onMessage.addListener( (request) => {
    console.log('msg from tab', request);
    if (request.onload) {
        chrome.storage.sync.set({active: false});
    } else {
        chrome.storage.sync.set(request)
        updateState();
    }
});