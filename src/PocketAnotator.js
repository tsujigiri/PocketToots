"use strict";

class PocketAnotator {
  anotate = (tootUrls) => {
    debugOutput('Adding anotations to Pocket');
    const box = document.createElement("div");
    box.style = 'position: fixed; bottom: 5px; left: 5px; z-index: 9999;';
    box.id = "pocket-toots-links";

    for (const url of tootUrls) {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('target', '_blank');
      link.innerText = '🦣';
      box.appendChild(link);
    }
    document.body.prepend(box);
  }

  clear = () => {
    debugOutput("Removing anotations from Pocket");
    document.getElementById('pocket-toots-links').remove();
  }

  getItemId = () =>
    window.location.href.split('/').pop();
}
