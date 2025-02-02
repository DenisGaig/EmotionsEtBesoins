import globals from "./globals.js";
import pages from "./pages.js";

const utils = {
  getSentiments: async function () {
    await fetch("./../sentiments.json")
      .then((res) => res.json())
      .then((data) => {
        globals.sentimentsList = data;
      });
  },

  getNeeds: async function () {
    await fetch("./../needs.json")
      .then((res) => res.json())
      .then((data) => {
        globals.needsList = data;
      });
  },

  pageContent: function (title, content, button) {
    // const main = document.querySelector("main");

    document.querySelector("h1").innerHTML = title;
    document.querySelector("main").innerHTML = content;
    document.querySelector(".btn-container").innerHTML = button;
  },

  handlePublicChoice: function () {
    const input = document.querySelectorAll('input[type="text"]');
    input.forEach((input) =>
      input.addEventListener("click", (e) => {
        globals.sentimentsPublic = utils.emotionFilter(
          globals.sentimentsList,
          (emotion) => {
            return emotion.target.includes(e.target.id);
          }
        );
        globals.needsPublic = utils.emotionFilter(globals.needsList, (need) => {
          return need.target.includes(e.target.id);
        });

        // pages.selectSentiments();
        pages.selectCards("sentiments");
      })
    );
  },

  emotionFilter: function (mainObject, filterFunction) {
    return Object.keys(mainObject)
      .filter((ObjectKey) => {
        return filterFunction(mainObject[ObjectKey]);
      })
      .reduce((result, ObjectKey) => {
        result[ObjectKey] = mainObject[ObjectKey];
        return result;
      }, {});
  },

  createGrid: function (size) {
    const grid = document.createElement("div");
    grid.className = "grid-container";

    const gridSize = (value) =>
      value >= 1 && value <= 20 ? Math.ceil(value / 6) * 6 : null;

    for (let i = 0; i < gridSize(size); i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.draggable = "target";
      cell.setAttribute("data-index", i);
      grid.appendChild(cell);
    }

    grid.addEventListener("dragover", this.dragOver);
    grid.addEventListener("dragleave", this.dragLeave);
    grid.addEventListener("drop", this.drop);

    return grid;
  },

  // ---- Nouvelle version pour éviter doublons sur même case
  //              et remplissage dans cellule vide --------------

  fillCardsInGrid: function (type, cardType) {
    if (!["sentiments", "needs"].includes(type)) {
      console.error("Type invalide fourni à fillCardsInGrid");
      return;
    }

    // Charger les positions sauvegardées
    const savedPositions =
      JSON.parse(localStorage.getItem(`${type}Positions`)) || {};
    // // Suivi des cartes déjà placées
    // const placedCards = new Set(Object.keys(savedPositions));

    // Transformation de savedPositions en tableau [{name,position}]
    const placedCards = Object.entries(savedPositions).map(([key, value]) => ({
      name: key,
      position: value,
    }));

    // console.log("SAVED POS", savedPositions);
    console.log("PLACED CARDS", placedCards);
    // console.log("CARDs", cardType);
    // console.log("TYPE", type);

    // Créer la grille et l'ajouter à la page
    const container = document.querySelector(".grid-container");
    // Efface la grille précédente
    if (container) container.innerHTML = "";

    const grid = this.createGrid(cardType.length);
    document.getElementById("selected-cards").appendChild(grid);

    // Placer les cartes dans les cellules vides
    const cells = grid.querySelectorAll(".cell");

    cardType.forEach((sentiments, index) => {
      // Placer les cartes déjà existantes
      const cardAlreadyExist = placedCards.find(
        (card) =>
          card.name.toLowerCase() === sentiments.dataset.name.toLowerCase()
      );
      console.log("CARD EXIST", cardAlreadyExist);

      if (cardAlreadyExist) {
        const targetCell = document.querySelector(
          `[data-index="${cardAlreadyExist.position}"]`
        );
        // console.log("CARTE DEJA PRESENTE A: ", cardAlreadyExist.position);
        // console.log("TARGET CELL", targetCell);
        targetCell.appendChild(sentiments);
        return;
      }

      // Sinon, placer les cartes restantes
      sentiments.draggable = true;
      sentiments.dataset.draggable = "item";

      sentiments.addEventListener("dragstart", this.dragStart);
      sentiments.addEventListener("dragend", this.dragEnd);

      // Trouver une cellule vide
      const emptyCell = Array.from(cells).find(
        (cell) => cell.children.length === 0
      );

      // console.log("EMPTY CELL", Array.from(cells));
      // console.log("ADD NEW CARD", sentiments, "AT", emptyCell);

      if (emptyCell) {
        emptyCell.appendChild(sentiments);
      }
    });
  },

  // GESTION DU DRAG AND DROP
  dragStart: function (e) {
    e.dataTransfer.setData(
      "text/plain",
      e.target.parentNode.getAttribute("data-index")
    );
    setTimeout(() => (e.target.style.display = "none"), 0);
  },

  dragEnd: function (e) {
    e.target.style.display = "flex";
  },

  dragOver: function (e) {
    e.preventDefault();
    const target = e.target.closest('[data-draggable="target"]');
    if (target) {
      // Mise en surbrillance de la zone de dépôt
      target.style.background = "#e0e0e0";
      target.style.border = "2px dashed #666";
    }
  },

  dragLeave: function (e) {
    const target = e.target.closest('[data-draggable="target"]');
    if (target) {
      // Retirer la mise en surbrillance
      target.style.background = "";
      target.style.border = "";
    }
  },

  drop: function (e) {
    const target = e.target.closest(`[data-draggable="target"]`);
    const grid = document.querySelector(".grid-container");
    e.preventDefault();
    const fromIndex = e.dataTransfer.getData("text/plain");
    const toIndex = e.target.closest(".cell").getAttribute("data-index");

    if (fromIndex === toIndex) return;

    const fromCell = grid.children[fromIndex];
    const toCell = grid.children[toIndex];

    // ---- Animation de déplacement ------
    toCell.style.transition = "all 0.3s ease-out";
    toCell.style.transform = "scale(1.05)";
    setTimeout(() => {
      toCell.style.transform = "scale(1)";
      toCell.style.opacity = "1";
    }, 300);
    // ----------------------------------

    target.style.background = "";
    target.style.border = "";

    if (toCell.children.length > 0) {
      // Échanger les cartes
      const tempCard = toCell.children[0];
      toCell.appendChild(fromCell.children[0]);
      fromCell.appendChild(tempCard);
    } else {
      // Déplacer la carte dans une cellule vide
      toCell.appendChild(fromCell.children[0]);
    }
  },

  savePosition: function (type) {
    if (!["sentiments", "needs"].includes(type)) {
      console.error("Type invalide fourni à savePosition");
      return;
    }
    // Initialise l'objet pour stocker les positions
    const positions = {};
    // console.log("SAVE POSITIONS", positions);

    // Détermine la clé pour le localStorage
    const storageKey = `${type}Positions`;

    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
      if (cell.children.length > 0) {
        const cardId = cell.children[0].getAttribute("data-name");
        positions[cardId] = index;
        // console.log("SAVE", cardId, sentimentsPositions);
      }
    });
    localStorage.setItem(storageKey, JSON.stringify(positions));
  },

  loadPosition: function (type) {
    if (!["sentiments", "needs"].includes(type)) {
      console.error("Type invalide fourni à loadPosition");
      return;
    }
    const savedPositions = JSON.parse(localStorage.getItem(`${type}Positions`));

    if (savedPositions) {
      Object.keys(savedPositions).forEach((cardId) => {
        const card = document.querySelector(`[data-name="${cardId}"]`);
        const targetCell = document.querySelector(
          `[data-index="${savedPositions[cardId]}"]`
        );
        if (card && targetCell) {
          targetCell.appendChild(card);
          // console.log("LOAD POSITIONS", savedPositions[cardId]);
        }
      });
    }
  },

  updateSentimentsList: function (name) {
    if (globals.sentimentsPublic.hasOwnProperty(name)) {
      delete globals.sentimentsPublic[name];
      console.log(name, "a été supprimé");
    } else console.log(name, " n existe pas dans la liste");
  },

  updateNeedsList: function (name) {
    if (globals.needsPublic.hasOwnProperty(name)) {
      delete globals.needsPublic[name];
      console.log(name, "a été supprimé");
    } else console.log(name, " n existe pas dans la liste");
  },

  darkModeToggle: function () {
    console.log("DARK CLICKED");
    document.body.classList.toggle("dark-mode");
    globals.darkModeToggle.textContent = document.body.classList.contains(
      "dark-mode"
    )
      ? "Mode clair"
      : "Mode sombre";
  },

  handleInspiration: function () {
    // Les phrases motivantes correspondant aux tris
    const triPhrases = {
      importance: "⚖ Priorise ce qui compte le plus pour toi.",
      temporalite: "⏳ Quand as-tu ressenti cela ?",
      intensite: "🔥 Qu'est-ce qui te touche le plus profondément ?",
      resolution: "🚀 Que peux-tu résoudre dès aujourd'hui ?",
    };

    // Référence aux éléments du DOM
    const inspirationEl = document.getElementById("inspiration");
    const sortButtons = document.querySelectorAll(".sort-btn");

    // Ajouter un événement pour chaque bouton de tri
    sortButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tri = button.getAttribute("data-tri"); // Récupère le type de tri
        if (triPhrases[tri]) {
          // Met à jour le texte d'inspiration
          inspirationEl.textContent = triPhrases[tri];

          // Ajoute un effet visuel temporaire
          inspirationEl.classList.add("highlight");
          setTimeout(() => inspirationEl.classList.remove("highlight"), 500);
        }
      });
    });
  },
};

export default utils;
