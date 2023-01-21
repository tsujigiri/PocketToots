"use strict";

browser.runtime.onMessage.addListener((message) => {
  if (message.toots) {
    new PocketAnnotator().annotate(message.toots);
  }
});

