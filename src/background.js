"use strict";

// Repeatedly check for new Mastodon bookmarks.
browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'sync') {
    new MastodonBookmarksToPocketSyncer().run();
    browser.alarms.create('sync', { delayInMinutes: 60 });
  }
});

browser.alarms.create('sync', {});

// Lookup toot URLs by Pocket item ID and send them to the content script.
function sendToots(tabs) {
  for (const tab of tabs) {
    new BookmarkManager()
      .findBookmarksByTitle(tab.url.split('/').pop())
      .then((bookmarks) => bookmarks.map((b) => b.url))
      .then((urls) => browser.tabs.sendMessage(tab.id, { toots: urls }));
  }
}

// Remove annotations from Pocket item pages.
function clearAnnotations(tabs) {
  for (const tab of tabs) {
    browser.tabs.executeScript(tab.id, {
      code: 'new PocketAnnotator().clear()'
    })
  }
}

// Add annotations to Pocket /read/<ID> pages
browser.history.onVisited.addListener((historyItem) => {
  if (historyItem.url.startsWith('https://getpocket.com/read/')) {
    browser.tabs
      .query({ url: 'https://getpocket.com/read/*'})
      .then(sendToots)
  }
});

// Remove annotation from Pocket /read/<ID> page.
//
// There doesn't seem to be a way to listen to the popstate event, so we listen
// to the title change event instead in order to have something to go by to
// trigger clearing the annotations, when the user leaves a /read/<ID> page.
browser.history.onTitleChanged.addListener((historyItem) => {
  if (
    historyItem.url.startsWith('https://getpocket.com/') &&
      !historyItem.url.startsWith('https://getpocket.com/read/')
  ) {
    browser.tabs
      .query({ url: 'https://getpocket.com/*' })
      .then((tabs) => tabs.filter((tab) => !tab.url.startsWith('https://getpocket.com/read/')))
      .then(clearAnnotations);
  }
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.fetchBookmarks) {
    debugOutput('A new bookmark was added in Mastodon, fetching bookmarks');
    new MastodonBookmarksToPocketSyncer().run();
  }
});
