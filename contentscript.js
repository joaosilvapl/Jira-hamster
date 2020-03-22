printMessage = (message) => {
  console.log(`Jirasol: ${message}`);
}

printMessage(new Date());

printMessage(`jQuery type: ${typeof(jQuery)}`);

if (!jQuery || !$) {
  printMessage("jQuery not loaded");
}
else {
  var cardIdElements = $(".ghx-key[aria-label]");

  printMessage(`Found cards: ${cardIdElements.length}`);

  var cardIds = $(cardIdElements).map((index, value) =>$(value).attr('aria-label'));

  cardIds.each((index, value) => printMessage(value));
}



