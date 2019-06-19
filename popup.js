var onlyFreeleech = document.getElementById('onlyFreeleech');
var limitTorrents = document.getElementById('limitTorrents');
var limitTorrentsTitle = document.getElementById('limitTorrentsTitle');
var highlightTorrents = document.getElementById('highlightTorrents');
var goToSettings = document.getElementById('goToSettings');

// When opening the popup, get the value for limitTorrents from the storage
chrome.storage.sync.get('onlyFreeleech', function(data) {
    // And enable/disable the limit checkbox based on that value
    onlyFreeleech.checked = data.onlyFreeleech;
});

// When opening the popup, get the value for limitTorrents from the storage
chrome.storage.sync.get('limitTorrents', function(data) {
    // And enable/disable the limit checkbox based on that value
    limitTorrents.checked = data.limitTorrents;

    // Get the value of that limit, and add text to the lable accordingly
    chrome.storage.sync.get('limitTorrentsValue', function(data) {
        limitTorrentsTitle.title = 'With over ' + (data.limitTorrentsValue || 5000) + ' downloads';
    });
});

// When opening the popup, get the value for highlightTorrents from the storage
chrome.storage.sync.get('highlightTorrents', function(data) {
    // And enable/disable the highlight checkbox based on that value
    highlightTorrents.checked = data.highlightTorrents;
});

var handleClick = function(element) {
    // Save if the checkbox is enabled/disabled in a variable
    var label = element.target.id;
    var updateObj = {};
    updateObj[label] = element.target.checked;

    // Store that value in the storage
    chrome.storage.sync.set(updateObj, function() {
        // Get the active tab, and send a message with that value
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, updateObj);
        });
    });
};

// Function for opening the settings page for the chrome extension in a new tab
var openSettingsPage = function() {
    chrome.runtime.openOptionsPage();
}

// Assign functions to on click
highlightTorrents.onclick = handleClick;
limitTorrents.onclick = handleClick;
onlyFreeleech.onclick = handleClick;
goToSettings.onclick = openSettingsPage;