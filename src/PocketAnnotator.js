"use strict";

class PocketAnnotator {
  annotate = (tootUrls) => {
    debugOutput("Adding annotations to Pocket");

    const box = document.createElement("div");
    box.style = "position: fixed; bottom: 5px; left: 5px; z-index: 9999;";
    box.id = "pocket-toots-links";

    for (const url of tootUrls) {
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("target", "_blank");
      link.innerText = "🦣";

      box.appendChild(link);
    }
    document.body.prepend(box);
  }

  clear = () => {
    debugOutput("Removing annotations from Pocket");

    const box = document.getElementById("pocket-toots-links");

    if (box) {
      box.remove();
    }
  }

  getItemId = () =>
    window.location.href.split("/").pop();
}
