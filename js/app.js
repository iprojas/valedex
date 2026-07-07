(function () {
  "use strict";

  function updateProgress() {
    const count = window.ValemonStorage.getCapturedCount();
    const total = window.ValemonCreatures.totalCount;
    const bar = document.querySelector("[data-progress-bar]");

    document.querySelectorAll("[data-progress-label]").forEach((label) => {
      label.textContent = `${count} of ${total} captured`;
    });

    if (bar) {
      bar.style.setProperty("--progress", `${(count / total) * 100}%`);
    }
  }

  document.addEventListener("DOMContentLoaded", updateProgress);
})();
