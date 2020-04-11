import Logger from './logger';
import CardInfoRepository from './cardinforepository';

let logger = new Logger();
let cardInfoRepository = new CardInfoRepository();

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: 'atlassian.net' },
        })],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
});

const messageReceived = (message) => {
    logger.logMessage(message.cardId + " - " + message.cardNote);

    cardInfoRepository.saveCardInfo(message.cardId, message.cardNote, () => {
        logger.logMessage("Card info saved");
    });
}

chrome.runtime.onMessage.addListener(messageReceived);