import * as constants from './constants';
import Logger from './logger';

let logger = new Logger();

logger.logMessage("popup.js loaded");

let btnLoadNotes = document.getElementById('loadNotes');
let btnLoadNotesBacklog = document.getElementById('loadNotesBacklog');
let btnClearAllNotes = document.getElementById('clearAllNotes');

const sendMessage = (command, arg) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {

        logger.logMessage(`Command to send: ${command}, arguments: ${arg}`);

        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "command": command, "value": arg });

    });
}

btnLoadNotes.onclick = function(element) {
    sendMessage(constants.Command_LoadNotes);
};

btnLoadNotesBacklog.onclick = function(element) {
    sendMessage(constants.Command_LoadNotesBacklog);
};

btnClearAllNotes.onclick = function(element) {
    sendMessage(constants.Command_ClearNotes);
};