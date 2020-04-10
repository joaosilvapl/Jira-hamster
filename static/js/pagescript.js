var sendEvent = (cardId, cardNote) => {
    document.dispatchEvent(new CustomEvent('saveCardNote', { 'detail': { 'cardId': cardId, 'cardNote': cardNote } }));
}

var showModal = (cardId) => {
    var cardDiv = $('#cardDiv-' + cardId);
    var cardTextInput = $('#cardTextInput-' + cardId);

    var modal = document.getElementById("myModal");
    var modalTextInput = document.getElementById("modalTextInput");
    modalTextInput.cardId = cardId;
    modalTextInput.value = cardDiv[0].innerHTML;
    modal.focus();
    modalTextInput.focus();
    $(modal).show();
}

var updateCardNote = () => {
    var textInput = $('#modalTextInput')[0];
    var cardId = textInput.cardId;
    var newNote = textInput.value;

    sendEvent(cardId, newNote);

    var cardDiv = $(`#cardDiv-${cardId}`);
    cardDiv[0].innerHTML = newNote;

    if (newNote && newNote != '') {
        $(cardDiv).removeClass('cardNoteEmpty');
    } else {
        $(cardDiv).addClass('cardNoteEmpty');
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

</div>`);

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    // modal.style.display = "none";
    $(modal).hide();
}