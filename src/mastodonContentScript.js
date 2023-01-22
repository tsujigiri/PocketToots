"use strict";

async function updateMastodonAccessToken() {
  const instanceUrl = await browser.storage.sync
    .get('mastodon_instance_url')
    .then((result) => result.mastodon_instance_url)

  if (window.location.href.startsWith(instanceUrl)) {
    const accessToken = JSON
      .parse(document.getElementById('initial-state').innerText)
      .meta
      .access_token;

    debugOutput(`Found Mastodon access token: ${accessToken}`);
    await browser.storage.local.set({ mastodon_access_token: accessToken });
  }
}

updateMastodonAccessToken();

// Fetch bookmarks whenever the bookmark icon is clicked.
document.addEventListener('click', (element) => {
  if (element.target.parentNode.title === 'Bookmark') {
    // Give the server time to actualy register the bookmark.
    window.setTimeout(
      () => browser.runtime.sendMessage({ fetchBookmarks: true }),
      1000
    );
  }
});

