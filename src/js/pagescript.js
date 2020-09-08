import * as constants from './constants';
import Logger from './logger';

let logger = new Logger();
logger.logMessage('Pagescript.js - start');

window.sendEvent = (cardId, cardNote) => {
    document.dispatchEvent(new CustomEvent(constants.Event_SaveCardNote, { 'detail': { 'cardId': cardId, 'cardNote': cardNote } }));
}

window.showModal = (cardId) => {
    var cardDiv = $('#cardDiv-' + cardId);

    var modal = document.getElementById("myModal");
    var modalTextInput = document.getElementById("modalTextInput");
    modalTextInput.cardId = cardId;
    modalTextInput.value = cardDiv[0].innerText;
    modal.focus();
    modalTextInput.focus();
    $(modal).show();
}

window.updateCardNote = () => {
    var textInput = $('#modalTextInput')[0];
    var cardId = textInput.cardId;
    var newNote = textInput.value;

    sendEvent(cardId, newNote);

    var cardDiv = $(`#cardDiv-${cardId}`);
    cardDiv[0].innerText = newNote;

    if (newNote && newNote != '') {
        $(cardDiv).removeClass(constants.CardNoteClass_Empty);
    } else {
        $(cardDiv).addClass(constants.CardNoteClass_Empty);
    }

    $('#myModal').hide();
}

$(document.body).append(`<div id="myModal" class="modal">

  <!-- Modal content -->
  <div class="modalDiv" tabindex="-1" role="dialog">
    <span class="close">&times;</span>
    <h2 class="modalTitle">Update note</h2>
    <input type="text" id="modalTextInput" class="modalTextInput"></input>
    <button onclick="updateCardNote()">Update</button>
  </div>

</div>

<input type="hidden" id="jiraHamsterLoadNotesEnabled" value="0">

`);

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    // modal.style.display = "none";
    $(modal).hide();
}

logger.logMessage('Pagescript.js - end');