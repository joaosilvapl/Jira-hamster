import * as constants from './constants';
import Logger from './logger';
import CardInfoRepository from './cardinforepository';
import CardDomManipulator from './carddommanipulator';

class ContentScript {

    constructor() {

        if (!jQuery || !$) {
            throw "jQuery not loaded. Aborting.";
        }

        this.logger = new Logger();
        this.cardInfoRepository = new CardInfoRepository();
        this.cardDomManipulator = new CardDomManipulator(this.logger);
    }

    loadNotes = (isBacklogMode) => {

        let cardsInfo = this.cardDomManipulator.getAllCardIds(isBacklogMode);

        $(cardsInfo).each((index, cardInfo) => {

            this.logger.logMessage(cardInfo);

            this.cardInfoRepository.getCardInfo(cardInfo, (cardInfoKey, currentCardNote) => {
                this.logger.logMessage(`Current value for card ${cardInfoKey} = ${currentCardNote}`);

                this.cardDomManipulator.appendNoteToCard(cardInfo, currentCardNote, isBacklogMode);
            });

        });

        this.addPageDomElements();
    }

    addPageDomElements = () => {
        $('head').append($('<link rel="stylesheet" type="text/css" />')
            .attr('href', chrome.extension.getURL("../css/pagestyle.css")));

        $.getScript(chrome.extension.getURL("js/pagescript_bundle.js"));

        document.addEventListener(constants.Event_SaveCardNote, function(data) {
            //Send message to the background script
            chrome.runtime.sendMessage({ 'cardId': data.detail.cardId, 'cardNote': data.detail.cardNote });
        });
    }

    toggleVisibility = (elementId) => {
        if ($(`#${elementId}:visible`).length) {
            $(`#${elementId}`).hide();
        } else {
            $(`#${elementId}`).show();
        }
    }

    toggleFocusMode = () => {
        this.toggleVisibility('ghx-header');
        this.toggleVisibility('navigation-app');
        this.toggleVisibility('ghx-operations');
    }

    toggleHighlight = (index) => {
        var elements = document.querySelectorAll('.ghx-backlog-card:hover[data-issue-id], .ghx-issue:hover[data-issue-id]');
        //var elements = document.querySelectorAll('.ghx-issue:hover[data-issue-id]');

        this.logger.logMessage(`Hover: ${elements.length}`);

        $(elements).removeClass(`cardHighlight1`);
        $(elements).removeClass(`cardHighlight2`);
        $(elements).removeClass(`cardHighlight3`);

        $(elements).addClass(`cardHighlight${index}`);
    }

    messageReceived = (message) => {
        this.logger.logMessage(message.command);

        switch (message.command) {
            case constants.Command_LoadNotes:
                this.loadNotes(false);
                break;
            case constants.Command_LoadNotesBacklog:
                this.loadNotes(true);
                break;
            case constants.Command_ToggleFocusMode:
                this.toggleFocusMode();
                break;
            case constants.Command_ToggleHighlight1:
                this.toggleHighlight(1);
                break;
            case constants.Command_ToggleHighlight2:
                this.toggleHighlight(2);
                break;
            case constants.Command_ToggleHighlight3:
                this.toggleHighlight(3);
                break;
            case constants.Command_ClearNotes:
                this.cardInfoRepository.clearAllNotes();
                break;
            default:
                this.logger.logMessage(`Error: Unknown message: $ { message.command }`);
                break;
        }
    }
}

let contentScript = new ContentScript();

contentScript.addPageDomElements();

chrome.runtime.onMessage.addListener(contentScript.messageReceived);