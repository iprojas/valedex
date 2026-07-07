(function () {
  "use strict";

  function renderProgress() {
    const count = window.ValemonStorage.getCapturedCount();
    const total = window.ValemonCreatures.totalCount;
    const bar = document.querySelector("[data-progress-bar]");
    const completionLink = document.querySelector("[data-completion-link]");

    document.querySelectorAll("[data-progress-label]").forEach((label) => {
      label.textContent = `${count} / ${total} collected`;
    });

    if (bar) {
      bar.style.setProperty("--progress", `${(count / total) * 100}%`);
    }

    if (completionLink) {
      completionLink.hidden = count !== total;
    }
  }

  function createCollectionRow(creature, state) {
    const captured = state.captured[creature.id];
    const tag = captured ? "a" : "article";
    const row = document.createElement(tag);
    row.className = `collection-row${captured ? " discovered" : " locked"}`;

    if (captured) {
      row.href = `/viewer.html?id=${creature.id}`;
      row.setAttribute("aria-label", `Open ${creature.name} viewer`);
    }

    const icon = document.createElement("div");
    icon.className = "collection-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = captured ? "✓" : "?";

    const copy = document.createElement("div");
    copy.className = "collection-copy";

    const name = document.createElement("h2");
    name.textContent = captured ? creature.name : `Valemón ${creature.index}`;

    const meta = document.createElement("p");
    meta.textContent = captured ? `${creature.rarity} · Discovered` : "Locked";

    copy.append(name, meta);

    const stateLabel = document.createElement("span");
    stateLabel.className = "collection-state";
    stateLabel.textContent = captured ? "View" : "Hidden";

    row.append(icon, copy, stateLabel);
    return row;
  }

  function renderCollection() {
    const state = window.ValemonStorage.getGameState();
    const list = document.querySelector("[data-collection-grid]");

    renderProgress();

    if (list) {
      list.replaceChildren(
        ...window.ValemonCreatures.creatures.map((creature) =>
          createCollectionRow(creature, state),
        ),
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
