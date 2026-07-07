(function () {
  "use strict";

  function formatDate(value) {
    if (!value) {
      return "Today";
    }

    try {
      return new Intl.DateTimeFormat(undefined, {
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
      article.className = "collection-card captured";
      article.innerHTML = `
        <div class="slot-mark" aria-hidden="true">${creature.index}</div>
        <div class="card-copy">
          <h2>${creature.name}</h2>
          <p>Captured</p>
          <p>${formatDate(state.captured[creature.id].capturedAt)}</p>
        </div>
      `;
      return article;
    });

    grid.replaceChildren(...cards);
  }

  function wireReset() {
    const button = document.querySelector("[data-reset]");
    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      const confirmed = window.confirm(
        "Are you sure you want to erase your captured Valemones and restart the hunt?",
      );

      if (confirmed) {
        window.ValemonStorage.resetGame();
        window.location.href = "/";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!window.ValemonStorage.isCollectionComplete()) {
      window.location.replace("/collection.html");
      return;
    }

    const state = window.ValemonStorage.getGameState();
    const completedAt = document.querySelector("[data-completed-at]");
    if (completedAt) {
      completedAt.textContent = `Completed ${formatDate(state.completedAt)}`;
    }

    renderCompleteCollection(state);
    wireReset();
  });
})();
