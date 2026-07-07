(function () {
  "use strict";

  const fallbackValemons = [
    {
      id: "valemon-1",
      name: "Valero",
      photo: "/assets/valemons/valemon-1.png",
      model: "/assets/models/model1.glb",
      text: "/content/valemons/valemon-1/text.md",
      type: "Luz",
      index: 1,
    },
    {
      id: "valemon-2",
      name: "Rocamon",
      photo: "/assets/valemons/valemon-2.png",
      model: "/assets/models/model2.glb",
      text: "/content/valemons/valemon-2/text.md",
      type: "Roca",
      index: 2,
    },
    {
      id: "valemon-3",
      name: "Flamix",
      photo: "/assets/valemons/valemon-3.png",
      model: "/assets/models/model3.glb",
      text: "/content/valemons/valemon-3/text.md",
      type: "Fuego",
      index: 3,
    },
    {
      id: "valemon-4",
      name: "Aquon",
      photo: "/assets/valemons/valemon-4.png",
      model: "/assets/models/model4.glb",
      text: "/content/valemons/valemon-4/text.md",
      type: "Agua",
      index: 4,
    },
    {
      id: "valemon-5",
      name: "Terrik",
      photo: "/assets/valemons/valemon-5.png",
      model: "/assets/models/model5.glb",
      text: "/content/valemons/valemon-5/text.md",
      type: "Tierra",
      index: 5,
    },
  ];

  const configuredValemons = window.ValemonConfig?.valemons || fallbackValemons;
  const creatures = configuredValemons.map((valemon, position) => ({
    id: valemon.id,
    name: valemon.name,
    photo: valemon.photo,
    model: valemon.model,
    text: valemon.text,
    rarity: valemon.type || valemon.rarity || "Valemón",
    description: valemon.description || "",
    lore: valemon.lore || "",
    index: valemon.index || position + 1,
    element: valemon.type || valemon.element || "",
    habitat: valemon.habitat || "",
    collectibleNo: String(valemon.index || position + 1).padStart(3, "0"),
  }));

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
    creatures,
    totalCount: creatures.length,
    allCreatureIds: creatures.map((creature) => creature.id),
    getCreatureById,
    getCreatureIdFromPath,
    getCreatureIdFromSearch,
  };
})();
