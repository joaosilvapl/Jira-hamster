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

    toggleNotes = () => {

        let loadNotesEnabled = this.getLoadNotesEnabled();

        let isBacklogMode = $('.ghx-backlog').length > 0;

        let cardsInfo = this.cardDomManipulator.getAllCardIds(isBacklogMode);

        $(cardsInfo).each((index, cardInfo) => {

            this.logger.logMessage(cardInfo);

            if (!loadNotesEnabled) {
                this.cardInfoRepository.getCardInfo(cardInfo, (cardInfoKey, currentCardNote) => {
                    this.logger.logMessage(`Current value for card ${cardInfoKey} = ${currentCardNote}`);

                    this.cardDomManipulator.appendNoteToCard(cardInfo, currentCardNote, isBacklogMode);
                });
            }

        });

        this.setLoadNotesEnabled(!loadNotesEnabled);
    }

    getLoadNotesEnabled = () => {
        let isEnabledTextValue = $('#jiraHamsterLoadNotesEnabled')[0].value;

        return isEnabledTextValue === "1";
    }

    setLoadNotesEnabled = (enabled) => {
        $('#jiraHamsterLoadNotesEnabled')[0].value = enabled ? "1" : "0";
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
                this.toggleNotes();
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