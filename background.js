const cardInfoStoragePrefix = "cardInfo";

console.log("hello " + new Date());

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: 'atlassian.net' },
        })],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
});

printMessage = (message) => {
    console.log(`Jirasol: ${message}`);
}

messageReceived = (message, sender, sendResponse) => {
    printMessage(message.cardId);

    saveCardInfo(message.cardId, message.cardId + new Date().getTime(), () => {
        printMessage("Card info saved");
    });
}

chrome.runtime.onMessage.addListener(messageReceived);

saveInfo = (key, info, callback) => {
    chrome.storage.sync.set({
        [key]: info
    }, callback);
}

saveCardInfo = (cardId, info, callback) => {
    var key = cardInfoStoragePrefix + cardId;
    saveInfo(key, info, callback);
}