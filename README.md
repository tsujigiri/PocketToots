# PocketToots

A Firefox extension that saves your [Mastodon](https://joinmastodon.org/)
bookmarks to [Pocket](https://getpocket.com/de/saves) and adds a link back to
the source toot ("🦣" in the bottom left corner of the Pocket item's page).

In order to do this, it creates a *PocketToots* folder in your bookmarks in
Firefox, which it uses to associate pocket items with source toots. When it
tries to save the bookmarks to Pocket, it will ask you to authorize the
extension. For access to your Mastodon bookmarks, it is enough to load the
Mastodon instance's page while logged in. The extension will pick up the API
key from the page.

Links saved to Pocket will be tagged with "PocketToots".

## Configuration

After installation, you will be asked to provide the URL of the Mastodon
instance you are using. You can change it later in the extension's preferences:
Click on ☰, *Add-ons and themes*, *Extensions*, *PocketToots*, *Preferences*,
type the URL (e.g. "https://mastodon.social/") into the field and hit *Save*.
