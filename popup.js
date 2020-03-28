console.log("popup.js loaded");

let btnLoadNotes = document.getElementById('loadNotes');
let btnClearAllNotes = document.getElementById('clearAllNotes');
let btnSaveNote = document.getElementById('saveCardNote');
let txtCardId = document.getElementById('cardId');
let txtCardNote = document.getElementById('cardNote');

sendMessage = (command, value) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {

        console.log("btnLoadNotes clicked");

        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "command": command, "value": value });

    });
}

btnLoadNotes.onclick = function(element) {
    sendMessage("loadNotes");
};

btnClearAllNotes.onclick = function(element) {
    sendMessage("clearAllNotes");
};

btnSaveNote.onclick = function(element) {
    var values = [txtCardId.value, txtCardNote.value];
    sendMessage("saveCardNote", values);
};