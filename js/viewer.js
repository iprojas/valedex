(function () {
  "use strict";

  function showError(message) {
    const errorMessage = document.querySelector("#error");
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.classList.remove("hide");
    }
  }

  async function init() {
    await window.ValemonCreatures.ready;

    const creatureId = window.ValemonCreatures.getCreatureIdFromSearch(window.location.search);
    const creature = window.ValemonCreatures.getCreatureById(creatureId);

    if (!creature || !window.ValemonStorage.isCreatureCaptured(creature.id)) {
      window.location.replace("/");
      return;
    }

    document.title = `${creature.name} | Valedex`;

    const modelViewer = document.querySelector("#model-viewer");
    const title = document.querySelector("[data-viewer-title]");
    const rarity = document.querySelector("[data-viewer-rarity]");
    const backLink = document.querySelector("[data-viewer-back]");

    if (title) {
      title.textContent = creature.name;
    }

    if (rarity) {
      rarity.textContent = creature.rarity || "Valemón";
    }

    if (backLink) {
      backLink.href = `/valemon.html?id=${creature.id}`;
    }

    if (!modelViewer) {
      return;
    }

    modelViewer.setAttribute("src", creature.model);
    modelViewer.setAttribute("alt", `Modelo 3D de ${creature.name}`);

    modelViewer.addEventListener("ar-status", (event) => {
      if (event.detail.status === "failed") {
        showError("AR no está disponible en este dispositivo");
      }
    });

    modelViewer.addEventListener("error", () => {
      showError("No se pudo cargar el modelo 3D.");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
