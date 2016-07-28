/**
 * Check if the url is already seen
 */
function start() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var url = tabs[0].url;
        checkUrl(url, displayMsg);
    });
}
// If you click on another tab
chrome.tabs.onActivated.addListener(function (res) {
    start();
});

// If a web page is charged or refreshed
chrome.webNavigation.onCompleted.addListener(function (res) {
    start();
});

// When you click on icon link
chrome.browserAction.onClicked.addListener(function (res) {
    switchViewed();
});

// Switch between SEE or NOPE
function switchViewed() {
    var storage = chrome.storage.local;

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var url = tabs[0].url;
        checkUrl(url, function (res) {
            var result;

            if (!res.length) {
                result = 'SEE';
            } else {
                result = (res == 'SEE') ? 'NOPE' : 'SEE';
            }

            var obj = {};
            obj[url] = result;
            storage.set(obj);
            displayMsg(result);
        });
    });
}
// Display the msg into the badge
function displayMsg(msg) {
    chrome.browserAction.setBadgeBackgroundColor({color: [47, 51, 55, 255]});
    chrome.browserAction.setBadgeText({text: msg.toString()});
}

/**
 * @param url
 */
function checkUrl(url, callback) {
    var storage = chrome.storage.local;
    storage.get(url, function (res) {
        var data = (res[url]) ? res[url] : 'NOPE';
        callback(data);
    });
}