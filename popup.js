let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function (data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function (element) {
    let color = element.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {
                code: `var boardCards = $("div[data-issue-key]");
                
                if (boardCards.length > 0) {
                    boardCards.css('background-color', 'red');
                
                    boardCards.contextmenu(function () {
                        setTimeout(() => {
                            var contextMenuOtherActionsSection = $(".aui-last");
                
                            if (contextMenuOtherActionsSection.length > 0) {
                                contextMenuOtherActionsSection.append('<li class="aui-list-item"><a onclick="alert(123);return false;" class="aui-list-item-link js-context-menu-action" title="Copy info to clipboard" href="#">Copy info to clipboard</a></li>');
                            }
                
                        }, 100);
                    });
                }
          `});
    });
};