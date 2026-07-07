(function () {
  "use strict";

  const creatures = [
    {
      id: "valemon-1",
      name: "Valemón 1",
      model: "/assets/models/model.glb",
      description: "A mysterious creature discovered in this territory.",
      index: 1,
    },
    {
      id: "valemon-2",
      name: "Valemón 2",
      model: "/assets/models/model.glb",
      description: "A curious Valemón waiting near a hidden path.",
      index: 2,
    },
    {
      id: "valemon-3",
      name: "Valemón 3",
      model: "/assets/models/model.glb",
      description: "A bright companion found by careful explorers.",
      index: 3,
    },
    {
      id: "valemon-4",
      name: "Valemón 4",
      model: "/assets/models/model.glb",
      description: "A quiet creature that rewards close attention.",
      index: 4,
    },
    {
      id: "valemon-5",
      name: "Valemón 5",
      model: "/assets/models/model.glb",
      description: "The final Valemón in the first hunt collection.",
      index: 5,
    },
  ];

  function getCreatureById(id) {
    return creatures.find((creature) => creature.id === id) || null;
  }

  function getCreatureIdFromPath(pathname) {
    const match = pathname.match(/\/creatures\/([^/]+)\/?$/);
    return match ? match[1] : null;
  }

  window.ValemonCreatures = {
    creatures,
    totalCount: creatures.length,
    allCreatureIds: creatures.map((creature) => creature.id),
    getCreatureById,
    getCreatureIdFromPath,
  };
})();
