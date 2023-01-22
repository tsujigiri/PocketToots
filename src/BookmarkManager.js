"use strict";

class BookmarkManager {
  constructor() {
    this.folder = null
  }

  findOrCreateFolder = async () => {
    if (this.folder) {
      return this.folder
    }

    const folderId = await browser.storage.sync.get('bookmarkFolderId')
      .then((result) => result.bookmarkFolderId);

    if (folderId) {
      var folder = await browser.bookmarks.get(folderId)
        .then((folders) => folders[0])
        .catch(() => null);
    }

    if (!folder) {
      folder = await browser.bookmarks.create({ type: "folder", title: "Pocket Toots" })
      await browser.storage.sync.set({ bookmarkFolderId: folder.id });
    }

    this.folder = folder;
    return this.folder;
  }

  storeBookmark = async (title, url) => {
    const folder = await this.findOrCreateFolder();

    browser.bookmarks.create({
      parentId: folder.id,
      title: title,
      url: url,
      index: 0
    })
  }

  getBookmarks = async () => {
    const folder = await this.findOrCreateFolder();
    return browser.bookmarks.getChildren(folder.id)
  }

  findBookmarksByUrl = async (url) => {
    const folder = await this.findOrCreateFolder();
    const bookmarks = await browser.bookmarks.search({ url: url })
    return bookmarks.filter((b) => b.parentId === folder.id)
  }

  findBookmarksByTitle = async (title) => {
    const folder = await this.findOrCreateFolder();
    const bookmarks = await browser.bookmarks.search({ title: title })
    return bookmarks.filter((b) => b.parentId === folder.id)
  }
}

