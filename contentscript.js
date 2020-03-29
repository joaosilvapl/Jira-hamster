const allCardIdsStorageKey = "allCardIds";
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

appendNoteToCard = (cardId, note) => {

    var cardDiv = $(`.ghx-issue[data-issue-key='${cardId}']`);

    if (cardDiv.length == 0) {
        printMessage(`Error: Could not find card for id=${cardId}`);
    } else {
        var cardElement = getCardElement(cardId, note);
        $(cardDiv).append(cardElement);
    }

}

clearAllNotes = () => {
    if (confirm("This will delete all saved notes. Continue?")) {
        chrome.storage.sync.clear()
    }
}

loadNotes = () => {
    if (!jQuery || !$) {
        printMessage("jQuery not loaded");
    } else {

        var cardIdElements = $(".ghx-key[aria-label]");

        printMessage(`Found cards: ${cardIdElements.length}`);

        var cardsInfo = [];

        $(cardIdElements).each((index, element) => { cardsInfo.push([element, $(element).attr('aria-label')]) });

        var cardIdsInfo = $(cardsInfo).map((index, x) => x[1]).get();

        getInfo(allCardIdsStorageKey, (x, y) => printMessage(`Current number of cards ${x} = ${y.length}`));

        saveInfo(allCardIdsStorageKey, cardIdsInfo, () => printMessage(`Info stored for all cards ${allCardIdsStorageKey} = ${cardIdsInfo.length}`));

        var now = new Date().getTime().toString();

        $(cardsInfo).each((index, cardInfo) => {

            printMessage(cardInfo[1]);

            getCardInfo(cardInfo[1], (x, y) => {
                currentCardNote = y;
                printMessage(`Current value for card ${x} = ${currentCardNote}`);

                appendNoteToCard(cardInfo[1], currentCardNote);
            });

        });

        $('head').append($('<link rel="stylesheet" type="text/css" />')
            .attr('href', chrome.extension.getURL("pagestyle.css")));

        $.getScript(chrome.extension.getURL("pagescript.js"));

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
            loadNotes();
            break;
        case "clearAllNotes":
            clearAllNotes();
            break;
        case "saveCardNote":
            saveCardInfo(message.value[0], message.value[1]);
            break;
        default:
            printMessage(`
            Error: Unknown message: $ { message.command }
            `);
    }
}

chrome.runtime.onMessage.addListener(messageReceived);