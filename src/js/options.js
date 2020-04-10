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

saveCardInfo = (cardId, info) => {
  var key = cardInfoStoragePrefix + cardId;
  saveInfo(key, info, (x, y) => {
    printMessage(`Info stored for card ${cardId}: ${x} = ${y}`);
  });
}

saveButtonClick = () => {
  var cardId = $("#cardId").val();
  var cardInfo = $("#cardInfo").val();

  saveCardInfo(cardId, cardInfo);
}

$("#saveButton").click(saveButtonClick);