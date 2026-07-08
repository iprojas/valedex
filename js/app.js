(function () {
  "use strict";

  function updateProgress() {
    const count = window.ValemonStorage.getCapturedCount();
    const total = window.ValemonCreatures.totalCount;
    const bar = document.querySelector("[data-progress-bar]");

    document.querySelectorAll("[data-progress-label]").forEach((label) => {
      label.textContent = `${count} de ${total} encontrados`;
    });

    if (bar) {
      bar.style.setProperty("--progress", `${total ? (count / total) * 100 : 0}%`);
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await window.ValemonCreatures.ready;
    updateProgress();
  });
})();
