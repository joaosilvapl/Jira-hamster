const cardInfoStoragePrefix = "cardInfo";

printMessage = (message) => {
    console.log(`Jirasol: ${message}`);
}

getCardInfoStorageKey = (cardId) => cardInfoStoragePrefix + cardId;

saveInfo = (key, info, callback) => {
    chrome.storage.sync.set({
        [key]: info
    }, callback);
}

getInfo = (key, callback) => {
    chrome.storage.sync.get(key, (obj) => {
        var value = obj[key];
        callback(key, value);
    });
};

saveCardInfo = (cardId, info, callback) => {
    var key = cardInfoStoragePrefix + cardId;
    saveInfo(key, info, callback);
}

getCardInfo = (cardId, callback) => {
    var key = cardInfoStoragePrefix + cardId;

    getInfo(key, (x, y) => callback(x, y));
}

getCardElement = (cardId, note) => {
    var noteText;
    var noteClass;
    if (note && note != '') {
        noteText = note;
        noteClass = "";
    } else {
        noteText = " ";
        noteClass = 'cardNoteEmpty';
    }

    return `<div id="cardDiv-${cardId}"
             class='cardNote ${noteClass}' onclick='event.stopPropagation();showModal("${cardId}");return false;'>${noteText}</div>`;
}

appendNoteToCard = (cardId, note, isBacklogMode) => {

    let cardSelectorClass = isBacklogMode ? "ghx-backlog-card" : "ghx-issue";

    var cardDiv = $(`.${cardSelectorClass}[data-issue-key='${cardId}']`);

    if (cardDiv.length == 0) {
        printMessage(`Error: Could not find card for id=${cardId}`);
    } else {
        printMessage(`Adding note div for id=${cardId}`);
        var cardElement = getCardElement(cardId, note);
        $(cardDiv).append(cardElement);
    }

}

clearAllNotes = () => {
    if (confirm("This will delete all saved notes. Continue?")) {
        chrome.storage.sync.clear()
    }
}

loadNotes = (isBacklogMode) => {
    if (!jQuery || !$) {
        printMessage("jQuery not loaded");
    } else {


        let cardSelectorAttribute = isBacklogMode ? "title" : "aria-label";

        var cardSelector = `.ghx-key[${cardSelectorAttribute}]`;

        var cardIdElements = $(cardSelector);

        printMessage(`Found cards: ${cardIdElements.length}`);

        var cardsInfo = [];

        $(cardIdElements).each((index, element) => { cardsInfo.push($(element).attr(`${cardSelectorAttribute}`)) });

        $(cardsInfo).each((index, cardInfo) => {

            printMessage(cardInfo);

            getCardInfo(cardInfo, (cardInfoKey, currentCardNote) => {
                printMessage(`Current value for card ${cardInfoKey} = ${currentCardNote}`);

                appendNoteToCard(cardInfo, currentCardNote, isBacklogMode);
            });

        });

        $('head').append($('<link rel="stylesheet" type="text/css" />')
            .attr('href', chrome.extension.getURL("../css/pagestyle.css")));

        $.getScript(chrome.extension.getURL("js/pagescript.js"));

        document.addEventListener("saveCardNote", function(data) {
            console.log("Jirasol: saveCardNote message received: " + data.detail);
            //Send message to the background script
            chrome.runtime.sendMessage({ 'cardId': data.detail.cardId, 'cardNote': data.detail.cardNote });
        });
    }
}

messageReceived = (message) => {
    printMessage(message.command);

    switch (message.command) {
        case "loadNotes":
            loadNotes(false);
            break;
        case "loadNotesBacklog":
            loadNotes(true);
            break;
        case "clearAllNotes":
            clearAllNotes();
            break;
        default:
            printMessage(`Error: Unknown message: $ { message.command }`);
    }
}

chrome.runtime.onMessage.addListener(messageReceived);