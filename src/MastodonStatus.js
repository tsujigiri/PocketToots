"use strict";

class MastodonStatus {
  constructor(data) {
    this.content = data.content;
    this.url = data.url;
  }

  links = () => {
    const content = document.createElement('div');
    content.innerHTML = this.content;
    const links = [];
    for (const link of content.querySelectorAll('a:not(.mention)')) {
      links.push(link.href);
    }
    return links;
  }
}
