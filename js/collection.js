(function () {
  "use strict";

  function formatDate(value) {
    if (!value) {
      return "";
    }

    try {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value));
    } catch (error) {
      return value;
    }
  }

  function renderProgress(state) {
    const count = window.ValemonStorage.getCapturedCount();
    const total = window.ValemonCreatures.totalCount;
    const bar = document.querySelector("[data-progress-bar]");
    const completionLink = document.querySelector("[data-completion-link]");

    document.querySelectorAll("[data-progress-label]").forEach((label) => {
      label.textContent = `${count} of ${total} Valemones captured`;
    });

    if (bar) {
      bar.style.setProperty("--progress", `${(count / total) * 100}%`);
    }

    if (completionLink) {
      completionLink.hidden = count !== total;
    }
  }

  function createCard(creature, state) {
    const captured = state.captured[creature.id];
    const article = document.createElement("article");
    article.className = `collection-card${captured ? " captured" : ""}`;

    const mark = document.createElement("div");
    mark.className = "slot-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = captured ? creature.index : "?";

    const copy = document.createElement("div");
    copy.className = "card-copy";

    const title = document.createElement("h2");
    title.textContent = captured ? creature.name : `Valemón ${creature.index}`;

    const status = document.createElement("p");
    status.textContent = captured ? "Captured" : "Not discovered";

    const meta = document.createElement("p");
    meta.textContent = captured
      ? `Captured ${formatDate(captured.capturedAt)}`
      : "Find the QR code to reveal this slot.";

    copy.append(title, status, meta);

    if (captured) {
      const link = document.createElement("a");
      link.className = "button secondary";
      link.href = `/creatures/${creature.id}/`;
      link.textContent = "Review";
      copy.append(link);
    }

    article.append(mark, copy);
    return article;
  }

  function renderCollection() {
    const state = window.ValemonStorage.getGameState();
    const grid = document.querySelector("[data-collection-grid]");

    renderProgress(state);

    if (grid) {
      grid.replaceChildren(
        ...window.ValemonCreatures.creatures.map((creature) => createCard(creature, state)),
      );
    }
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
        renderCollection();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderCollection();
    wireReset();
  });
})();
