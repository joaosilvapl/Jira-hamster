console.log("hello " + new Date());



chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: 'atlassian.net' },
        })],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
});