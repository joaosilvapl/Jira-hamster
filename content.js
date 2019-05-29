var currentIndex = 0;
var maxIndex = 10;

doIt();

function doIt() {

    var boardCards = $("div[data-issue-key]");

    console.log("jhrecife " + currentIndex + " " + boardCards.length);

    if (boardCards.length == 0) {
        currentIndex = currentIndex + 1;

        if (currentIndex < maxIndex) {
            setTimeout(() => { doIt() }, 1000);
        }
    }
    else {
        boardCards.css('background-color', 'red');
    }

}