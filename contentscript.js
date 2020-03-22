const cardInfoStoragePrefix = "cardInfo";

printMessage = (message) => {
  console.log(`Jirasol: ${message}`);
}

getCardInfoStorageKey = (cardId) => cardInfoStoragePrefix + cardId;

var cardId1 = getCardInfoStorageKey(1);

saveCardInfo = (cardId, info) => {
  var key = cardInfoStoragePrefix + cardId;
  chrome.storage.sync.set({ [key]: info }, () => {
    printMessage(`Info stored for card ${cardId}: ${key} = ${info}`);
  });
}

chrome.storage.sync.get(cardId1, (obj) => {
  printMessage(`${cardId1} = ${obj[cardId1]}`);
});

printMessage(`jQuery type: ${typeof (jQuery)}`);

if (!jQuery || !$) {
  printMessage("jQuery not loaded");
}
else {
  var cardIdElements = $(".ghx-key[aria-label]");

  printMessage(`Found cards: ${cardIdElements.length}`);

  var cardIds = $(cardIdElements).map((index, value) => $(value).attr('aria-label'));

  cardIds.each((index, value) => printMessage(value));
}

var value = new Date().toString();

saveCardInfo(1, value);






