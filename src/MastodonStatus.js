"use strict";

class MastodonStatus {
  constructor(data) {
    this.content = data.content;
    this.url = data.url;
  }

  links = () => {
    const parser = new DOMParser();
    const content = parser.parseFromString(this.content, `text/html`);

    const links = [];
    for (const link of content.querySelectorAll("a:not(.mention, .hashtag)")) {
      links.push(link.href);
    }
    return links;
  }
}
