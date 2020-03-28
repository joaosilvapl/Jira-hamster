console.log("popup.js loaded");

let btnLoadNotes = document.getElementById('loadNotes');

btnLoadNotes.onclick = function(element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {

        console.log("btnLoadNotes clicked");

        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "txt": "loadNotes" });

    });
};