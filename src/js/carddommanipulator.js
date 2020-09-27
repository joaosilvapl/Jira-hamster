import * as constants from './constants';

export default class CardDomManipulator {

    constructor(logger) {
        this.logger = logger;
    }

    getAllCardIds = (isBacklogMode) => {
        let cardSelectorAttribute = isBacklogMode ? "title" : "aria-label";

        var cardSelector = `.ghx-key[${cardSelectorAttribute}]`;

        var cardIdElements = $(cardSelector);


        var cardsInfo = [];

        $(cardIdElements).each((index, element) => { cardsInfo.push($(element).attr(`${cardSelectorAttribute}`)) });

        return cardsInfo;
    }

    buildCardDivId = (cardId) => {
        return `cardDiv-${cardId}`;
    }

    buildCardHistoryDivId = (cardId) => {
        return `cardHistoryDiv-${cardId}`;
    }

    buildCardElement = (cardId, cardDivId, note, isBacklogMode, cardClassName) => {
        let noteText;
        let noteClass;
        if (note && note != '') {
            noteText = note;
            noteClass = "";
        } else {
            noteText = " ";
            noteClass = constants.CardNoteClass_Empty;
        }

        if (isBacklogMode) {
            noteClass += " ghx-summary"
        }

        return `<div id="${cardDivId}"
                 class='${cardClassName} ${noteClass}' 
                 onclick='event.stopPropagation();showModal("${cardId}");return false;'>
                 ${noteText}
                 </div>`;
    }

    appendNoteToCard = (cardId, note, isBacklogMode) => {

        let cardDivId = this.buildCardDivId(cardId);
        this.appendNoteToCardInternal(cardId, cardDivId, note, isBacklogMode, 'cardNote');
    }

    appendHistoryNoteToCard = (cardId, note, isBacklogMode) => {

        let cardHistoryDivId = this.buildCardHistoryDivId(cardId);
        this.appendNoteToCardInternal(cardId, cardHistoryDivId, note, isBacklogMode, 'cardNoteHistory');
    }

    appendNoteToCardInternal = (cardId, cardDivId, note, isBacklogMode, cardClassName) => {

        if ($(`#${cardDivId}`).length > 0) {
            //A note already exists for the given card. It should not be re-added
            return;
        }

        let cardSelectorClass = isBacklogMode ? "ghx-backlog-card" : "ghx-issue";

        let cardDivs = $(`.${cardSelectorClass}[data-issue-key='${cardId}']`);

        if (cardDivs.length == 0) {
            this.logger.logMessage(`Error: Could not find card for id=${cardId}`);
        } else {

            let cardDiv = $(cardDivs[0]);

            this.logger.logMessage(`Adding note div for id=${cardId}`);
            var cardElement = this.buildCardElement(cardId, cardDivId, note, isBacklogMode, cardClassName);

            if (isBacklogMode) {
                let cardRowElements = cardDiv.find('div.ghx-row.ghx-plan-main-fields');

                if (cardRowElements.length == 0) {
                    this.logger.logMessage(`Error: Could not find card row for id=${cardId}`);
                } else {
                    let cardRowElement = $(cardRowElements[0]);

                    cardRowElement.append('<div class="ghx-backlog-card-expander-spacer"></div>');
                    cardRowElement.append(cardElement);
                }

            } else {
                cardDiv.append(cardElement);
            }
        }

    }

}