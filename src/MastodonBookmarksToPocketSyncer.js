"use strict";

class MastodonBookmarksToPocketSyncer {
  run = () =>
    new MastodonApi()
      .bookmarks()
      .then(this.addBookmarksToPocket)

  addBookmarksToPocket = async (statuses) => {
    const pocketApi = new PocketApi();
    const bookmarkManager = new BookmarkManager();

    for (const status of statuses) {
      for (const link of status.links()) {
        const existingBookmarks = await bookmarkManager.findBookmarksByUrl(status.url);

        if (existingBookmarks.length > 0) {
          // If there are existing bookmarks, assume we've already seen all
          // the following bookmarks.
          debugOutput("Found existing bookmark for status, assuming we've seen the rest.");
          return;
        }

        const response = await pocketApi.add(link);
        await bookmarkManager.storeBookmark(response.item.item_id, status.url);
      }
    }
  }
}

