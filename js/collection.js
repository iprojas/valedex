(function () {
  "use strict";

  function renderProgress() {
    const count = window.ValemonStorage.getCapturedCount();
    const total = window.ValemonCreatures.totalCount;
    const bar = document.querySelector("[data-progress-bar]");
    const completionLink = document.querySelector("[data-completion-link]");

    document.querySelectorAll("[data-progress-label]").forEach((label) => {
      label.textContent = `${count} / ${total} encontrados`;
    });

    if (bar) {
      bar.style.setProperty("--progress", `${total ? (count / total) * 100 : 0}%`);
    }

    if (completionLink) {
      completionLink.hidden = count !== total;
    }
  }

  function createCollectionRow(creature, state) {
    const captured = state.captured[creature.id];
    const tag = captured ? "a" : "article";
    const row = document.createElement(tag);
    row.className = `collection-row nes-container is-rounded${
      captured ? " discovered" : " unknown"
    }`;

    if (captured) {
      row.href = `/valemon.html?id=${creature.id}`;
      row.setAttribute("aria-label", `Abrir ficha de ${creature.name}`);
    }

    const portrait = document.createElement("div");
    portrait.className = "collection-portrait";

    if (captured && creature.photo) {
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
      portrait.setAttribute("aria-hidden", "true");
      portrait.textContent = "?";
    }

    const name = document.createElement("h2");
    name.textContent = captured ? creature.name : "Desconocido";

    row.append(portrait, name);
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

  document.addEventListener("DOMContentLoaded", async () => {
    await window.ValemonCreatures.ready;
    renderCollection();
  });
})();
