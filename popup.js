console.log("popup.js loaded");

let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
    let color = element.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {

        console.log("changeColor clicked");

        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "txt": "start" });

    });
};