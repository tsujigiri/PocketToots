"use strict";

function saveOptions(e) {
  browser.storage.sync.set({
    mastodon_instance_url: document.querySelector("#mastodon-instance-url").value
  });
  e.preventDefault();
  if (window.location.href.indexOf("onboarding.html") > -1) {
	window.close();
  }
}

function restoreOptions() {
  browser
    .storage
    .sync
    .get('mastodon_instance_url')
    .then((res) => {
      const input = document.querySelector("#mastodon-instance-url");
      input.value = res.mastodon_instance_url || '';
      input.focus();
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
