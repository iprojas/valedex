const STORAGE_KEY = "valemon-hunt-state";

type CaptureEntry = {
  capturedAt: string;
  visits: number;
};

type GameState = {
  version: 1;
  captured: Record<string, CaptureEntry>;
};

function defaultState(): GameState {
  return {
    version: 1,
    captured: {},
  };
}

function isValidState(value: unknown): value is GameState {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    (value as GameState).version === 1 &&
    typeof (value as GameState).captured === "object" &&
    (value as GameState).captured !== null &&
    !Array.isArray((value as GameState).captured)
  );
}

export function getGameState(): GameState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultState();
    }

    const parsed = JSON.parse(stored);
    return isValidState(parsed) ? parsed : defaultState();
  } catch {
    return defaultState();
  }
}

function saveGameState(state: GameState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage puede no estar disponible en contextos privados o restringidos.
  }
}

export function captureValemon(slug: string) {
  const state = getGameState();
  const now = new Date().toISOString();
  const existing = state.captured[slug];

  if (existing) {
    existing.visits = Number(existing.visits || 0) + 1;
  } else {
    state.captured[slug] = {
      capturedAt: now,
      visits: 1,
    };
  }

  saveGameState(state);
  return state;
}

export function isCaptured(slug: string) {
  return Boolean(getGameState().captured[slug]);
}

export function capturedCount(slugs: string[]) {
  const state = getGameState();
  return slugs.filter((slug) => state.captured[slug]).length;
}
