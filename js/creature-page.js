(function () {
  "use strict";

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = value;
    }
  }

  function progressText(count, total) {
    return `${count} de ${total} encontrados`;
  }

  function textParts(value) {
    const parts = String(value || "")
      .split(/\n{2,}/)
      .map((part) => part.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    return {
      description: parts[0] || "",
      lore: parts.slice(1).join(" "),
    };
  }

  function getPageCreatureId() {
    return (
      window.ValemonCreatures.getCreatureIdFromSearch(window.location.search) ||
      document.body.dataset.creatureId ||
      window.ValemonCreatures.getCreatureIdFromPath(window.location.pathname)
    );
  }

  function renderMetadata(creature, result, state) {
    const list = document.querySelector("[data-metadata]");
    if (!list || !creature) {
      return;
    }

    const captured = state.captured[creature.id];
    const items = [
      ["Tipo", creature.rarity],
      ["Progreso", progressText(result.capturedCount, result.totalCount)],
      ["Número", creature.collectibleNo],
      ["Visitas", String(captured ? captured.visits : 0)],
    ];

    list.replaceChildren(
      ...items.map(([label, value]) => {
        const row = document.createElement("div");
        row.className = "metadata-row";
        row.innerHTML = `<dt>${label}</dt><dd>${value}</dd>`;
        return row;
      }),
    );
  }

  function renderImage(creature) {
    const image = document.querySelector("[data-creature-photo]");
    if (!image) {
      return;
    }

    image.src = creature.photo;
    image.alt = creature.name;
    image.addEventListener(
      "error",
      () => {
        image.closest(".valemon-photo")?.classList.add("missing-photo");
        image.removeAttribute("src");
        image.alt = "";
      },
      { once: true },
    );
  }

  async function init() {
    await window.ValemonCreatures.ready;

    const pageCreatureId = getPageCreatureId();
    const creature = window.ValemonCreatures.getCreatureById(pageCreatureId);
    const result = window.ValemonStorage.captureCreature(pageCreatureId);

    document.body.classList.add("discovery-page");

    if (!creature || result.error) {
      setText("[data-discovery-title]", "Valemón desconocido");
      setText("[data-creature-name]", "Desconocido");
      setText("[data-discovery-copy]", "Este QR no pertenece a la búsqueda actual.");
      return;
    }

    const state = window.ValemonStorage.getGameState();
    const copy = textParts(creature.text || creature.description);
    const title = result.isNewCapture ? "Encontraste un nuevo Valemón" : "Ficha Valemón";

    document.title = `${creature.name} | Valedex`;
    setText("[data-discovery-eyebrow]", result.isNewCapture ? "Nuevo hallazgo" : "Valedex");
    setText("[data-discovery-title]", title);
    setText("[data-creature-name]", creature.name);
    setText("[data-rarity]", creature.rarity);
    setText("[data-progress-label]", progressText(result.capturedCount, result.totalCount));
    setText("[data-discovery-copy]", copy.description);
    setText("[data-lore]", copy.lore);
    renderImage(creature);

    const viewerLink = document.querySelector("[data-viewer-link]");
    if (viewerLink) {
      viewerLink.href = `/viewer.html?id=${creature.id}`;
    }

    const completeNote = document.querySelector("[data-complete-note]");
    if (completeNote) {
      completeNote.hidden = !result.isComplete;
    }

    const bar = document.querySelector("[data-progress-bar]");
    if (bar) {
      bar.style.setProperty(
        "--progress",
        `${result.totalCount ? (result.capturedCount / result.totalCount) * 100 : 0}%`,
      );
    }

    renderMetadata(creature, result, state);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
