(function () {
  "use strict";

  function formatDate(value) {
    if (!value) {
      return "hoy";
    }

    try {
      return new Intl.DateTimeFormat("es-CL", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(value));
    } catch (error) {
      return value;
    }
  }

  function renderCompleteCollection(state) {
    const grid = document.querySelector("[data-collection-grid]");
    if (!grid) {
      return;
    }

    const cards = window.ValemonCreatures.creatures.map((creature) => {
      const article = document.createElement("article");
      article.className = "collection-card nes-container is-rounded captured";

      const portrait = document.createElement("div");
      portrait.className = "collection-portrait";

      if (creature.photo) {
        const image = document.createElement("img");
        image.src = creature.photo;
        image.alt = creature.name;
        image.loading = "lazy";
        image.addEventListener("error", () => {
          portrait.classList.add("missing-photo");
          portrait.textContent = "?";
          image.remove();
        });
        portrait.append(image);
      } else {
        portrait.textContent = "?";
      }

      const name = document.createElement("h2");
      name.textContent = creature.name;
      article.append(portrait, name);
      return article;
    });

    grid.replaceChildren(...cards);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await window.ValemonCreatures.ready;

    if (!window.ValemonStorage.isCollectionComplete()) {
      window.location.replace("/");
      return;
    }

    const state = window.ValemonStorage.getGameState();
    const completedAt = document.querySelector("[data-completed-at]");
    if (completedAt) {
      completedAt.textContent = `Completado ${formatDate(state.completedAt)}`;
    }

    renderCompleteCollection(state);
  });
})();
