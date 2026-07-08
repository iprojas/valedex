(function () {
  "use strict";

  const CONTENT_ROOT = "/valemones/";
  const MANIFEST_URL = `${CONTENT_ROOT}valemones.json`;
  let creatures = [];
  let loadError = null;

  function resolveContentPath(path) {
    if (!path) {
      return "";
    }

    if (/^(https?:)?\/\//.test(path) || path.startsWith("/")) {
      return path;
    }

    return `${CONTENT_ROOT}${path}`;
  }

  function normalizeCreature(valemon, position) {
    const index = Number(valemon.index || position + 1);

    return {
      id: valemon.id,
      name: valemon.name,
      photo: resolveContentPath(valemon.image || valemon.photo),
      model: resolveContentPath(valemon.model),
      text: valemon.text || "",
      rarity: valemon.type || valemon.rarity || "Valemón",
      description: valemon.description || valemon.text || "",
      lore: valemon.lore || "",
      index,
      element: valemon.type || valemon.element || "",
      habitat: valemon.habitat || "",
      collectibleNo: String(index).padStart(3, "0"),
    };
  }

  async function loadCreatures() {
    try {
      const response = await fetch(MANIFEST_URL, { cache: "no-cache" });
      if (!response.ok) {
        throw new Error(`No se pudo cargar ${MANIFEST_URL}`);
      }

      const manifest = await response.json();
      const valemons = Array.isArray(manifest.valemons) ? manifest.valemons : [];
      creatures = valemons
        .filter((valemon) => valemon && valemon.id && valemon.name)
        .map(normalizeCreature);
    } catch (error) {
      loadError = error;
      creatures = [];
      console.error(error);
    }
  }

  function getCreatureById(id) {
    return creatures.find((creature) => creature.id === id) || null;
  }

  function getCreatureIdFromPath(pathname) {
    const match = pathname.match(/\/creatures\/([^/]+)\/?$/);
    return match ? match[1] : null;
  }

  function getCreatureIdFromSearch(search) {
    return new URLSearchParams(search).get("id");
  }

  window.ValemonCreatures = {
    ready: loadCreatures(),
    get creatures() {
      return creatures;
    },
    get totalCount() {
      return creatures.length;
    },
    get allCreatureIds() {
      return creatures.map((creature) => creature.id);
    },
    get loadError() {
      return loadError;
    },
    getCreatureById,
    getCreatureIdFromPath,
    getCreatureIdFromSearch,
  };
})();
