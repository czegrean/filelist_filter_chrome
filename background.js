chrome.runtime.onInstalled.addListener(function() {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      // With a new rule ...
      chrome.declarativeContent.onPageChanged.addRules([
        {
          // That fires when a page's URL contains a 'filelist.ro/browse.php' ...
          conditions: [
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { urlContains: 'filelist.ro/browse.php' }
            })
          ],
          // And shows the extension's page action.
          actions: [ new chrome.declarativeContent.ShowPageAction() ]
        }
      ]);
    });
  });

// Add a listener for when a page loading is completed, and the URL matches filelist.ro/.+cat=1
// This will help catch when the user navigates to a new page in filelist, and apply the rules on the new page
chrome.webNavigation.onCompleted.addListener(function(tab) {
    chrome.storage.sync.get('onlyFreeleech', function(data) {
        chrome.tabs.sendMessage(tab.tabId, {'onlyFreeleech': data.onlyFreeleech});
    });
    chrome.storage.sync.get('limitTorrents', function(data) {
        chrome.tabs.sendMessage(tab.tabId, {'limitTorrents': data.limitTorrents});
    });
    chrome.storage.sync.get('highlightTorrents', function(data) {
        chrome.tabs.sendMessage(tab.tabId, {'highlightTorrents': data.highlightTorrents});
    });
}, {url: [{urlMatches: 'filelist.ro/browse.php'}]});

// The above function was used instead of the 'chrome.tabs.onUpdated.addListener' option, because the onUpdated
// function doesn't allow to add filters to apply only to certain URLs
