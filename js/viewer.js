(function () {
  "use strict";

  function showError(message) {
    const errorMessage = document.querySelector("#error");
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.classList.remove("hide");
    }
  }

  function init() {
    const creatureId = window.ValemonCreatures.getCreatureIdFromSearch(window.location.search);
    const creature = window.ValemonCreatures.getCreatureById(creatureId);

    if (!creature || !window.ValemonStorage.isCreatureCaptured(creature.id)) {
      window.location.replace("/");
      return;
    }

    document.title = `${creature.name} viewer | Valemón Hunt`;

    const modelViewer = document.querySelector("#model-viewer");
    const title = document.querySelector("[data-viewer-title]");
    const rarity = document.querySelector("[data-viewer-rarity]");

    if (title) {
      title.textContent = creature.name;
    }

    if (rarity) {
      rarity.textContent = creature.rarity;
    }

    if (!modelViewer) {
      return;
    }

    modelViewer.setAttribute("src", creature.model);
    modelViewer.setAttribute("alt", `A 3D model of ${creature.name}`);

    modelViewer.addEventListener("ar-status", (event) => {
      if (event.detail.status === "failed") {
        showError("AR is not supported on this device");
      }
    });

    modelViewer.addEventListener("error", () => {
      showError("The 3D model could not be loaded.");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
