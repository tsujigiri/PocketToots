"use strict";

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
//
// TODO: try browser.webNavigation.onHistoryStateUpdated.addListener(
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

// Sync when bookmarks are added in Mastodon.
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.fetchBookmarks) {
    debugOutput('A new bookmark was added in Mastodon, fetching bookmarks');
    new MastodonBookmarksToPocketSyncer().run();
  }
});

// Onboard the user on install.
browser.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
  switch (reason) {
    case "install":
      {
        const url = browser.runtime.getURL("html/onboarding.html");
        await browser.tabs.create({ url });
      }
      break;
  }
});

// Sync bookmarks.
browser.alarms.onAlarm.addListener((alarm) => {
  switch (alarm.name) {
    case "sync":
      debugOutput("Syncing bookmarks");
      new MastodonBookmarksToPocketSyncer().run();
      break;
  }
});


function setAlarm() {
  debugOutput("Setting alarm");
  browser.alarms.clearAll();
  browser.alarms.create('sync', { periodInMinutes: 60 });
}

browser.runtime.onInstalled.addListener(setAlarm);
browser.runtime.onStartup.addListener(setAlarm);

