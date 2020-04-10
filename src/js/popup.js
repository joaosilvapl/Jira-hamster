console.log("popup.js loaded");

let btnLoadNotes = document.getElementById('loadNotes');
let btnLoadNotesBacklog = document.getElementById('loadNotesBacklog');
let btnClearAllNotes = document.getElementById('clearAllNotes');
sendMessage = (command, value) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {

        console.log(`Command to send: ${value}}`);

        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "command": command, "value": value });

    });
}

btnLoadNotes.onclick = function(element) {
    sendMessage("loadNotes");
};

btnLoadNotesBacklog.onclick = function(element) {
    sendMessage("loadNotesBacklog");
};

btnClearAllNotes.onclick = function(element) {
    sendMessage("clearAllNotes");
};