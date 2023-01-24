"use strict";

class MastodonApi {
  constructor(instanceUrl, accessToken) {
    this.instanceUrl = instanceUrl;
    this.accessToken = accessToken;
  }

  getAccessToken = () =>
    browser.storage.local
      .get('mastodon_access_token')
      .then((result) => result.mastodon_access_token)

  getInstanceUrl = () =>
    browser.storage.sync
      .get('mastodon_instance_url')
      .then((result) => result.mastodon_instance_url)

  bookmarks = async () => {
    const accessToken = await this.getAccessToken();
    const instanceUrl = await this.getInstanceUrl();

    if (!instanceUrl) {
      console.warn('PocketToots: No Mastodon instance URL set. ' +
                   'Please do so in the extensions settings.');
      return [];
    }

    if (!accessToken) {
      console.warn('PocketToots: Access token for Mastodon is missing. ' +
                   'It should be picked up when loading a page ' +
                   'on your mastodon instance.');
      return [];
    }

    const request = new Request(
      `${instanceUrl}/api/v1/bookmarks?limit=40`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    return fetch(request)
      .then((response) => response.json())
      .then((statuses) => {
        debugOutput(`Received ${statuses.length} statuses from Mastodon`, statuses);
        return statuses.map((s) => new MastodonStatus(s))
      })
  }
}

