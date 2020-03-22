const allCardIdsStorageKey = "allCardIds";
const cardInfoStoragePrefix = "cardInfo";

printMessage = (message) => {
  console.log(`Jirasol: ${message}`);
}

getCardInfoStorageKey = (cardId) => cardInfoStoragePrefix + cardId;

saveInfo = (key, info, callback) => {
  chrome.storage.sync.set({ [key]: info }, () => {
    callback(key, info);
  });
}

getInfo = (key, callback) => {
  chrome.storage.sync.get(key, (obj) => {
    var value = obj[key];
    callback(key, value);
  });
};

saveCardInfo = (cardId, info) => {
  var key = cardInfoStoragePrefix + cardId;
  saveInfo(key, info, (x, y) => {
    printMessage(`Info stored for card ${cardId}: ${x} = ${y}`);
  });
}

getCardInfo = (cardId, callback) => {
  var key = cardInfoStoragePrefix + cardId;

  getInfo(key, (x, y) => callback(x, y));
}

printMessage(`jQuery type: ${typeof (jQuery)}`);

if (!jQuery || !$) {
  printMessage("jQuery not loaded");
}
else {

  var cardIdElements = $(".ghx-key[aria-label]");

  printMessage(`Found cards: ${cardIdElements.length}`);

  var cardIds = $(cardIdElements).map((index, value) => $(value).attr('aria-label')).get();

  var cardIdsInfo = cardIds;

  getInfo(allCardIdsStorageKey, (x, y) => printMessage(`Current value for all cards ${x} = ${y}`));

  saveInfo(allCardIdsStorageKey, cardIdsInfo, (x, y) => printMessage(`Info stored for all cards ${x} = ${y}`));

  var now = new Date().getTime().toString();

  $(cardIds).each((index, cardId) => {

    printMessage(cardId);

    getCardInfo(cardId, (x, y) => printMessage(`Current value for card ${x} = ${y}`));

    saveCardInfo(cardId, now);

  });
}