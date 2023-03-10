"use strict";

class PocketApi {
  constructor() {
    this.CONSUMER_KEY = "105491-1f7e9ee0863b15dc31a1b0d";
    this.REDIRECT_URL = browser.identity.getRedirectURL();
  }

  add = async (url) => {
    debugOutput(`Adding ${url} to Pocket`);

    const accessToken = await this.getAccessToken();
    const request = new Request(
      "https://getpocket.com/v3/add",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "X-Accept": "application/json"
        },
        body: JSON.stringify({
          url: url,
          tags: "PocketToots",
          consumer_key: this.CONSUMER_KEY,
          access_token: accessToken
        })
      }
    );
    const response = await fetch(request);

    debugOutput('Response from Pocket', response);

    switch (response.status) {
      case 200:
        return response.json();
        break;
      case 401:
        return this.authorize().then(() => this.add(url));
        break;
      default:
        return Promise.reject(`Unexpected response from Pocket: ${response.status}`);
    }
  }

  getAccessToken = () =>
    browser.storage.local
      .get("pocket_access_token")
      .then((response) => response.pocket_access_token)
      .then(this.validateAccessToken)

  validateAccessToken = (accessToken) => {
    if (!accessToken) {
      accessToken = this.authorize()
    }

    return accessToken;
  }

  authorize = () =>
    this.getRequestToken()
      .then(this.authorizeWithPocket)
      .then(this.fetchAccessToken)
      .then(this.storeAccessToken)

  getRequestToken = () => {
    const request = new Request(
      "https://getpocket.com/v3/oauth/request",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "X-Accept": "application/json"
        },
        body: JSON.stringify({
          consumer_key: this.CONSUMER_KEY,
          redirect_uri: this.REDIRECT_URL
        })
      }
    );

    return fetch(request)
      .then((response) => response.json())
      .then((json) => json.code)
  }

  authorizeWithPocket = async (requestToken) => {
    let authURL = "https://getpocket.com/auth/authorize";
    authURL += `?request_token=${requestToken}`;
    authURL += `&redirect_uri=${encodeURIComponent(this.REDIRECT_URL)}`;

    await browser.identity.launchWebAuthFlow({ interactive: true, url: authURL })

    return requestToken
  }

  fetchAccessToken = (requestToken) => {
    const request = new Request(
      "https://getpocket.com/v3/oauth/authorize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "X-Accept": "application/json"
        },
        body: JSON.stringify({
          consumer_key: this.CONSUMER_KEY,
          code: requestToken
        })
      }
    );

    return fetch(request)
      .then((response) => response.json())
      .then((json) => json.access_token)
  }

  storeAccessToken = async (accessToken) => {
    await browser.storage.local.set({ pocket_access_token: accessToken });

    return accessToken;
  }
}

