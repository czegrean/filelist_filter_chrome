let saveButton = document.getElementById('saveSettings');
let confirmSave = document.getElementById('confirmSave');

// Get the value from the storage and fill in the input for the limit of downloads for the torrents
chrome.storage.sync.get('limitTorrentsValue', function(data) {
    document.getElementById('limitTorrentsValue').value = data.limitTorrentsValue || 5000;
});

// Get the value from the storage and fill in the inputs for the highlighted torrents
chrome.storage.sync.get('highlightValues', function(data) {
    var highlightValues = data.highlightValues || {
        highlightRedValue: 20000,
        highlightPurpleValue: 15000,
        highlightBlueValue: 10000,
        highlightGreenValue: 5000
    };

    document.getElementById('highlightRedValue').value = highlightValues.highlightRedValue;
    document.getElementById('highlightPurpleValue').value = highlightValues.highlightPurpleValue;
    document.getElementById('highlightBlueValue').value = highlightValues.highlightBlueValue;
    document.getElementById('highlightGreenValue').value = highlightValues.highlightGreenValue;
});

// When saving the settings, store those settings in the storage
saveButton.onclick = function() {
    var limitTorrentsValue = document.getElementById('limitTorrentsValue').value;
    var highlightRedValue = document.getElementById('highlightRedValue').value;
    var highlightPurpleValue = document.getElementById('highlightPurpleValue').value;
    var highlightBlueValue = document.getElementById('highlightBlueValue').value;
    var highlightGreenValue = document.getElementById('highlightGreenValue').value;
    chrome.storage.sync.set({'limitTorrentsValue': limitTorrentsValue});
    chrome.storage.sync.set({'highlightValues': {
        'highlightRedValue': highlightRedValue,
        'highlightPurpleValue': highlightPurpleValue,
        'highlightBlueValue': highlightBlueValue,
        'highlightGreenValue': highlightGreenValue
    }}, function() {
        // And display a confirmation message
        confirmSave.style.visibility = 'visible';
        setTimeout(() => {
            confirmSave.style.visibility = 'hidden';
        }, 1000);
    });
};
