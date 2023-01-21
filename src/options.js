"use strict";

function saveOptions(e) {
  browser.storage.sync.set({
    mastodon_instance_url: document.querySelector("#mastodon-instance-url").value
  });
  e.preventDefault();
}

function restoreOptions() {
  browser
    .storage
    .sync
    .get('mastodon_instance_url')
    .then((res) => {
      document.querySelector("#mastodon-instance-url").value = res.mastodon_instance_url;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
