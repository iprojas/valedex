(function () {
  "use strict";

  const STORAGE_KEY = "valemon-hunt-state";
  let memoryState = null;

  function createDefaultState() {
    return {
      version: 1,
      captured: {},
      firstStartedAt: null,
      completedAt: null,
    };
  }

  function cloneState(state) {
    return JSON.parse(JSON.stringify(state));
  }

  function isValidState(state) {
    return (
      state &&
      state.version === 1 &&
      typeof state.captured === "object" &&
      state.captured !== null &&
      !Array.isArray(state.captured)
    );
  }

  function getStoredValue() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function setStoredValue(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function removeStoredValue() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      memoryState = createDefaultState();
    }
  }

  function getGameState() {
    const stored = getStoredValue();

    if (!stored) {
      return cloneState(memoryState || createDefaultState());
    }

    try {
      const parsed = JSON.parse(stored);
      if (isValidState(parsed)) {
        memoryState = parsed;
        return cloneState(parsed);
      }
    } catch (error) {
      removeStoredValue();
    }

    memoryState = createDefaultState();
    return cloneState(memoryState);
  }

  function saveGameState(state) {
    const nextState = isValidState(state) ? cloneState(state) : createDefaultState();
    memoryState = cloneState(nextState);
    setStoredValue(JSON.stringify(nextState));
    return nextState;
  }

  function getCapturedCreatureIds() {
    const state = getGameState();
    return window.ValemonCreatures.allCreatureIds.filter((id) => state.captured[id]);
  }

  function getCapturedCount() {
    return getCapturedCreatureIds().length;
  }

  function isCreatureCaptured(creatureId) {
    return Boolean(getGameState().captured[creatureId]);
  }

  function isCollectionComplete() {
    return getCapturedCount() === window.ValemonCreatures.totalCount;
  }

  function captureCreature(creatureId) {
    const creature = window.ValemonCreatures.getCreatureById(creatureId);

    if (!creature) {
      return {
        creatureId,
        error: "unknown-creature",
        isNewCapture: false,
        isFirstCapture: false,
        isComplete: isCollectionComplete(),
        capturedCount: getCapturedCount(),
        totalCount: window.ValemonCreatures.totalCount,
      };
    }

    const state = getGameState();
    const now = new Date().toISOString();
    const previousCount = window.ValemonCreatures.allCreatureIds.filter(
      (id) => state.captured[id],
    ).length;
    const isNewCapture = !state.captured[creatureId];

    if (!state.firstStartedAt) {
      state.firstStartedAt = now;
    }

    if (isNewCapture) {
      state.captured[creatureId] = {
        capturedAt: now,
        visits: 1,
      };
    } else {
      state.captured[creatureId].visits =
        Number(state.captured[creatureId].visits || 0) + 1;
    }

    const capturedCount = window.ValemonCreatures.allCreatureIds.filter(
      (id) => state.captured[id],
    ).length;
    const isComplete = capturedCount === window.ValemonCreatures.totalCount;

    if (isComplete && !state.completedAt) {
      state.completedAt = now;
    }

    saveGameState(state);

    return {
      creatureId,
      isNewCapture,
      isFirstCapture: isNewCapture && previousCount === 0,
      isComplete,
      capturedCount,
      totalCount: window.ValemonCreatures.totalCount,
    };
  }

  function resetGame() {
    memoryState = createDefaultState();
    removeStoredValue();
    return cloneState(memoryState);
  }

  window.ValemonStorage = {
    STORAGE_KEY,
    getGameState,
    saveGameState,
    captureCreature,
    isCreatureCaptured,
    getCapturedCreatureIds,
    getCapturedCount,
    isCollectionComplete,
    resetGame,
  };
})();
