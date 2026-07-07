(function () {
  "use strict";

  const creatures = [
    {
      id: "valemon-1",
      name: "Valero",
      rarity: "Common",
      model: "/assets/models/model1.glb",
      description: "A steady first companion with a bright scouting instinct.",
      lore: "Valero is said to appear for explorers who take the first step into unknown territory.",
      index: 1,
      element: "Light",
      habitat: "Trail entrance",
      collectibleNo: "001",
    },
    {
      id: "valemon-2",
      name: "Rocamon",
      rarity: "Uncommon",
      model: "/assets/models/model2.glb",
      description: "A resilient Valemón discovered near stone, shade, and quiet paths.",
      lore: "Rocamon keeps old routes in memory and rewards participants who look closely.",
      index: 2,
      element: "Stone",
      habitat: "Rock garden",
      collectibleNo: "002",
    },
    {
      id: "valemon-3",
      name: "Flamix",
      rarity: "Rare",
      model: "/assets/models/model3.glb",
      description: "A vivid creature that turns a hidden corner into a spark of discovery.",
      lore: "Flamix is known for marking moments when a hunt starts to feel possible.",
      index: 3,
      element: "Fire",
      habitat: "Sunny clearing",
      collectibleNo: "003",
    },
    {
      id: "valemon-4",
      name: "Aquon",
      rarity: "Epic",
      model: "/assets/models/model4.glb",
      description: "A calm Valemón whose path is easiest to find by slowing down.",
      lore: "Aquon follows patient explorers and is rarely seen by anyone rushing past.",
      index: 4,
      element: "Water",
      habitat: "Fountain path",
      collectibleNo: "004",
    },
    {
      id: "valemon-5",
      name: "Terrik",
      rarity: "Legendary",
      model: "/assets/models/model5.glb",
      description: "The final Valemón in the first collection, found by completing the route.",
      lore: "Terrik appears only after the collection is nearly whole.",
      index: 5,
      element: "Earth",
      habitat: "Final marker",
      collectibleNo: "005",
    },
  ];

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
