export default class CardDomManipulator {

    constructor(logger) {
        this.logger = logger;
    }

    getAllCardIds = (isBacklogMode) => {
        let cardSelectorAttribute = isBacklogMode ? "title" : "aria-label";

        var cardSelector = `.ghx-key[${cardSelectorAttribute}]`;

        var cardIdElements = $(cardSelector);

        this.logger.logMessage(`Found cards: ${cardIdElements.length}`);

        var cardsInfo = [];

        $(cardIdElements).each((index, element) => { cardsInfo.push($(element).attr(`${cardSelectorAttribute}`)) });

        return cardsInfo;
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
            this.logger.logMessage(`Error: Could not find card for id=${cardId}`);
        } else {
            this.logger.logMessage(`Adding note div for id=${cardId}`);
            var cardElement = this.getCardElement(cardId, note);
            $(cardDiv).append(cardElement);
        }

    }

}