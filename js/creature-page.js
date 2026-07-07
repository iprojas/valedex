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

  function parseMarkdown(markdown) {
    const paragraphs = markdown
      .replace(/^# .+$/gm, "")
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    return {
      description: paragraphs[0] || "",
      lore: paragraphs.slice(1).join(" "),
    };
  }

  async function loadCreatureText(creature) {
    if (!creature?.text) {
      return {
        description: creature?.description || "",
        lore: creature?.lore || "",
      };
    }

    try {
      const response = await fetch(creature.text);
      if (response.ok) {
        return parseMarkdown(await response.text());
      }
    } catch (error) {
      // Las vistas locales por archivo pueden bloquear fetch; el fallback conserva la captura.
    }

    return {
      description: creature.description || "",
      lore: creature.lore || "",
    };
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

  async function init() {
    const pageCreatureId =
      document.body.dataset.creatureId ||
      window.ValemonCreatures.getCreatureIdFromPath(window.location.pathname);
    const creature = window.ValemonCreatures.getCreatureById(pageCreatureId);
    const result = window.ValemonStorage.captureCreature(pageCreatureId);

    if (!creature || result.error) {
      document.body.classList.add("discovery-page");
      setText("[data-discovery-title]", "Valemón desconocido");
      setText("[data-discovery-copy]", "Este QR no pertenece a la búsqueda actual.");
      return;
    }

    if (!result.isNewCapture) {
      window.location.replace(`/viewer.html?id=${creature.id}`);
      return;
    }

    const state = window.ValemonStorage.getGameState();
    const text = await loadCreatureText(creature);
    document.body.classList.add("discovery-page");
    document.title = `${creature.name} encontrado | Valedex`;
    setText("[data-discovery-title]", "Encontraste un nuevo Valemón");
    setText("[data-creature-name]", creature.name);
    setText("[data-rarity]", creature.rarity);
    setText("[data-progress-label]", progressText(result.capturedCount, result.totalCount));
    setText("[data-discovery-copy]", text.description);
    setText("[data-lore]", text.lore);

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
        `${(result.capturedCount / result.totalCount) * 100}%`,
      );
    }

    renderMetadata(creature, result, state);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
