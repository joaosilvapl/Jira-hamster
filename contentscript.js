const cardInfoStoragePrefix = "cardInfo";

printMessage = (message) => {
  console.log(`Jirasol: ${message}`);
}

getCardInfoStorageKey = (cardId) => cardInfoStoragePrefix + cardId;

saveCardInfo = (cardId, info) => {
  var key = cardInfoStoragePrefix + cardId;
  chrome.storage.sync.set({ [key]: info }, () => {
    printMessage(`Info stored for card ${cardId}: ${key} = ${info}`);
  });
}

getCardInfo = (cardId, callback) => {
  var key = cardInfoStoragePrefix + cardId;

  chrome.storage.sync.get(key, (obj) => {
    var value = obj[key];
    printMessage(`${key} = ${value}`);
    callback(value);
  });
}

printMessage(`jQuery type: ${typeof (jQuery)}`);

if (!jQuery || !$) {
  printMessage("jQuery not loaded");
}
else {

getCardInfo(1, x => printMessage(`Current value for cardId 1 = ${x}`));

  var cardIdElements = $(".ghx-key[aria-label]");

  printMessage(`Found cards: ${cardIdElements.length}`);

  var cardIds = $(cardIdElements).map((index, value) => $(value).attr('aria-label'));

  cardIds.each((index, value) => printMessage(value));
}

var value = new Date().toString();

saveCardInfo(1, value);





