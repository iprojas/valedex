(function () {
  "use strict";

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = value;
    }
  }

  function progressText(count, total) {
    return `${count} of ${total} discovered`;
  }

  function renderMetadata(creature, result, state) {
    const list = document.querySelector("[data-metadata]");
    if (!list || !creature) {
      return;
    }

    const captured = state.captured[creature.id];
    const items = [
      ["Rarity", creature.rarity],
      ["Progress", progressText(result.capturedCount, result.totalCount)],
      ["Discovered", captured ? "Unlocked" : "Locked"],
      ["Collection no.", creature.collectibleNo],
      ["Element", creature.element],
      ["Habitat", creature.habitat],
      ["Visits", String(captured ? captured.visits : 0)],
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

  function init() {
    const pageCreatureId =
      document.body.dataset.creatureId ||
      window.ValemonCreatures.getCreatureIdFromPath(window.location.pathname);
    const creature = window.ValemonCreatures.getCreatureById(pageCreatureId);
    const result = window.ValemonStorage.captureCreature(pageCreatureId);

    if (!creature || result.error) {
      document.body.classList.add("discovery-page");
      setText("[data-discovery-title]", "Unknown Valemón");
      setText("[data-discovery-copy]", "This QR destination does not match the current hunt.");
      return;
    }

    if (!result.isNewCapture) {
      window.location.replace(`/viewer.html?id=${creature.id}`);
      return;
    }

    const state = window.ValemonStorage.getGameState();
    document.body.classList.add("discovery-page");
    document.title = `${creature.name} discovered | Valemón Hunt`;
    setText("[data-discovery-title]", "You've discovered a new Valemón!");
    setText("[data-creature-name]", creature.name);
    setText("[data-rarity]", creature.rarity);
    setText("[data-progress-label]", progressText(result.capturedCount, result.totalCount));
    setText("[data-discovery-copy]", creature.description);
    setText("[data-lore]", creature.lore);

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
