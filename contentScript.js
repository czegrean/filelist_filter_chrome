// Listen to messages from the popup and call the assigned function if the message was from the popup
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.hasOwnProperty('onlyFreeleech')) {
            showFreeleechTorrents(request.onlyFreeleech);
        } else if (request.hasOwnProperty('limitTorrents')) {
            showHideTorrents(request.limitTorrents);
        } else if (request.hasOwnProperty('highlightTorrents')) {
            highlightTorrents(request.highlightTorrents);
        }
    }
);

// Function for showing/hiding the torrents that are Freeleech
function showFreeleechTorrents(onlyFreeleech) {
    if (onlyFreeleech) {
        // If the option is selected, find all the torrents that are not Freeleech and hide them
        $('.torrentrow').not(':has(div > span > img[alt="FreeLeech"])').each(function(i, row) {
            // $(row).css('display', 'none');
            $(row).addClass('hideNoFreeleech');
        });
    } else {
        // Otherwise, show all the torrents
        $('.torrentrow').each(function(i, row) {
            $(row).removeClass('hideNoFreeleech');
        });
    }

}

// Function for showing/hiding the torrents according to the limit in the settings
function showHideTorrents(limitTorrents) {
    // If there is a limit, just display the torrents over that limit
    if (limitTorrents) {
        // Get the threshold from the storage
        chrome.storage.sync.get('limitTorrentsValue', function(data) {
            var limitTorrentsValue = data.limitTorrentsValue || 5000;

            // For each torrent row
            $('.torrentrow').each(function(i, row) {
                // Extract the number of times it was downloaded
                var timesDownloaded = '';
                $(row).find('div.torrenttable > span > font:contains("times")').filter(function() {
                    timesDownloaded = $(this).text().replace(/\D+/g, '');
                });

                // If it was downloaded less times than the limit, hide it
                if (parseInt(timesDownloaded) < parseInt(limitTorrentsValue)) {
                    $(row).addClass('hideLimitedTorrents');
                }
                
            });
        });
    // Otherwise, display all the torrents
    } else {
        $('.torrentrow').each(function(i, row) {
            $(row).removeClass('hideLimitedTorrents');
        });
    }
}

// Function for highlighting torrents
function highlightTorrents(highlightTorrents) {
    if (highlightTorrents) {
        chrome.storage.sync.get('highlightValues', function(data) {
            // Create an array that sorts the colors in descending order
            var highlightValues = createHighlightValuesArray(data);

            // Get the min value from that array
            var minValue = highlightValues.slice(-1)[0].value;

            $('.torrentrow').each(function(i, row) {
                var timesDownloaded = '';
                $(row).find('div.torrenttable > span > font:contains("times")').filter(function() {
                    timesDownloaded = parseInt($(this).text().replace(/\D+/g, ''));
                });

                // For every torrent with downloads over the min value, make the text white
                if (timesDownloaded > minValue) {
                    $(row).addClass('whiteText');
                    $(row).find('div.torrenttable > span > b > font').addClass('whiteText');
                    $(row).find('div.torrenttable > span > a').addClass('whiteText');
                    $(row).find('div.torrenttable > span > font > a > b').addClass('whiteText');
                    $(row).find('div.torrenttable > span > font > b > a').addClass('whiteText');
                }

                // Change the background to every torrent according to the colors from the settings page
                for (var i = 0; i < highlightValues.length; i++) {
                    if (timesDownloaded > highlightValues[i].value) {
                        $(row).css('background-color', highlightValues[i].color);
                        break;
                    }
                }
            });
        });
    // Otherwise just revert the highlight changes
    } else {
        $('.torrentrow').each(function(i, row) {
            $(row).find('.whiteText').removeClass('whiteText');
            $(row).removeClass('whiteText');
            $(row).css('background-color', 'inherit');
        });
    }
}

// Function to create and sort the array of hightlight colors and values
function createHighlightValuesArray(data) {
    var highlightValues = data.highlightValues || {
        highlightRedValue: 20000,
        highlightPurpleValue: 15000,
        highlightBlueValue: 10000,
        highlightGreenValue: 5000
    };

    var highlightValuesArray = [
        {
            name: 'highlightRedValue',
            value: highlightValues.highlightRedValue || 20000,
            color: '#f53240'
        },{
            name: 'highlightRedValue',
            value: highlightValues.highlightPurpleValue || 15000,
            color: '#49274e'
        },{
            name: 'highlightRedValue',
            value: highlightValues.highlightBlueValue || 10000,
            color: '#0b3c5d'
        },{
            name: 'highlightRedValue',
            value: highlightValues.highlightGreenValue || 5000,
            color: '#015249'
        },
    ];

    return highlightValuesArray.sort(function(a, b) { return b.value - a.value; });
}