console.log("popup.js loaded");

let btnLoadNotes = document.getElementById('loadNotes');
let btnClearAllNotes = document.getElementById('clearAllNotes');

sendMessage = (message) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {

        console.log("btnLoadNotes clicked");

        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "txt": message });

    });
}

btnLoadNotes.onclick = function(element) {
    sendMessage("loadNotes");
};

btnClearAllNotes.onclick = function(element) {
    sendMessage("clearAllNotes");
};