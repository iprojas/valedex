(function () {
  "use strict";

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = value;
    }
  }

  function updateProgress(result) {
    setText("[data-progress-label]", `${result.capturedCount} of ${result.totalCount} captured`);
    const bar = document.querySelector("[data-progress-bar]");
    if (bar) {
      bar.style.setProperty(
        "--progress",
        `${(result.capturedCount / result.totalCount) * 100}%`,
      );
    }
  }

  function getMessage(result) {
    if (result.error) {
      return {
        title: "Unknown Valemón",
        body: "This QR destination does not match the current hunt.",
        complete: false,
      };
    }

    if (result.isComplete && result.isNewCapture) {
      return {
        title: "Collection complete!",
        body: "You captured all five Valemones. Open your collection to claim your reward.",
        complete: true,
      };
    }

    if (result.isFirstCapture) {
      return {
        title: "Welcome to the Valemón Hunt!",
        body: "You captured your first Valemón. Explore the territory, find the remaining QR codes, and capture them all.",
        complete: false,
      };
    }

    if (result.isNewCapture) {
      return {
        title: "New Valemón captured!",
        body: `You have captured ${result.capturedCount} of ${result.totalCount} Valemones.`,
        complete: false,
      };
    }

    return {
      title: "You already captured this Valemón.",
      body: "Keep exploring to find the remaining creatures.",
      complete: false,
    };
  }

  function renderMessage(result) {
    const message = getMessage(result);
    const messageElement = document.querySelector("[data-capture-message]");
    const completedLink = document.querySelector("[data-complete-link]");

    if (messageElement) {
      messageElement.innerHTML = `<strong>${message.title}</strong><span>${message.body}</span>`;
    }

    if (completedLink) {
      completedLink.hidden = !message.complete;
    }
  }

  function wireModelViewer(creature) {
    const modelViewer = document.querySelector("#model-viewer");
    const errorMessage = document.querySelector("#error");

    if (!modelViewer || !creature) {
      return;
    }

    modelViewer.setAttribute("src", creature.model);
    modelViewer.setAttribute("alt", `A 3D model of ${creature.name}`);

    modelViewer.addEventListener("ar-status", (event) => {
      if (event.detail.status === "failed" && errorMessage) {
        errorMessage.classList.remove("hide");

        errorMessage.addEventListener(
          "transitionend",
          () => {
            errorMessage.classList.add("hide");
          },
          { once: true },
        );
      }
    });

    modelViewer.addEventListener("error", () => {
      if (errorMessage) {
        errorMessage.textContent = "The 3D model could not be loaded.";
        errorMessage.classList.remove("hide");
      }
    });
  }

  function init() {
    const pageCreatureId =
      document.body.dataset.creatureId ||
      window.ValemonCreatures.getCreatureIdFromPath(window.location.pathname);
    const creature = window.ValemonCreatures.getCreatureById(pageCreatureId);
    const result = window.ValemonStorage.captureCreature(pageCreatureId);

    updateProgress(result);
    renderMessage(result);

    if (creature) {
      document.title = `${creature.name} | Valemón Hunt`;
      setText("[data-creature-name]", creature.name);
      setText("[data-creature-description]", creature.description);
      setText("[data-creature-index]", `Valemón ${creature.index} of ${window.ValemonCreatures.totalCount}`);
      wireModelViewer(creature);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
