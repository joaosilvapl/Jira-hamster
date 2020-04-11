const cardInfoStoragePrefix = "cardInfo";

export default class CardInfoRepository {

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
        this.saveInfo(key, info, callback);
    }
    
    getCardInfo = (cardId, callback) => {
        var key = cardInfoStoragePrefix + cardId;
    
        this.getInfo(key, (x, y) => callback(x, y));
    }

    clearAllNotes = () => {
        if (confirm("This will delete all saved notes. Continue?")) {
            chrome.storage.sync.clear()
        }
    }
}