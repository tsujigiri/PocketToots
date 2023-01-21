"use strict";

browser.runtime.onMessage.addListener((message) => {
  if (message.toots) {
    new PocketAnotator().anotate(message.toots);
  }
}

browser.runtime.sendMessage({
  requestTootsFor: new PocketAnotator().getItemId()
});

