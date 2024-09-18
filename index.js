let sentimentsList = {};
let needsList = {};
let sentimentsPublic = {};
let needsPublic = {};
let sentimentsSelected = [];
let needsSelected = [];

let sentimentsPositions = {};

const main = document.querySelector("main");
const darkModeToggle = document.getElementById("dark-mode-toggle");

const cards = {
  buildSwiper: function () {
    return `
    <div class="swiper cardsSwiper">
      <div class="swiper-wrapper">
                 
      </div>

      <div class="swiper-pagination"></div>

      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>

      <button class="swiper-button-no">NO</button>
      <button class="swiper-button-yes">YES</button>

    </div>`;
  },

  createCard: function (name, data, tag) {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-name", name);
    if (tag === 0) {
      card.innerHTML = `
            <img src="${data.image}" alt="${name}"/>
            <span class="card-name">${name}</span>
            <span class="synonyms">${data.synonyms.join(" / ")}</span>
          `;
    } else if (tag === 1) {
      card.innerHTML = `
            <img src="${data.image}" alt="${name}"/>
            <span class="card-name tagNeed">${name}</span>
            <span class="synonyms tagNeed">${data.synonyms.join(" / ")}</span>
          `;
    }
    return card;
  },

  fillCardsInSwiper: function (sentimentsOrNeeds) {
    let needTag = 0;
    if (sentimentsOrNeeds === needsPublic) {
      needTag = 1;
    } else needTag = 0;

    Object.entries(sentimentsOrNeeds).forEach(([dataName, data]) => {
      const card = cards.createCard(dataName, data, needTag);
      const swiperWrapper = document.querySelector(".swiper-wrapper");
      const swiperSlide = document.createElement("div");

      swiperSlide.className = "swiper-slide";
      swiperSlide.appendChild(card);
      swiperWrapper.appendChild(swiperSlide);
    });
  },

  initializeSwiper: function () {
    var swiper = new Swiper(".swiper", {
      effect: "cards",
      grabcursor: true,
      cardsEffect: {
        rotate: true,
        slideShadows: false,
        perSlideRotate: 3, // default: 2
        perSlideOffset: 6, // default: 8
      },

      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
    return swiper;
  },
};

// Objet contenant les fonctions utiles de l'appli
const utils = {
  getSentiments: function () {
    fetch("./sentiments.json")
      .then((res) => res.json())
      .then((data) => {
        sentimentsList = data;
      });
  },

  getNeeds: function () {
    fetch("./needs.json")
      .then((res) => res.json())
      .then((data) => {
        needsList = data;
      });
  },

  pageContent: function (title, content, button) {
    document.querySelector("h1").innerHTML = title;
    main.innerHTML = content;
    document.querySelector(".btn-container").innerHTML = button;
  },

  handlePublicChoice: function () {
    const input = document.querySelectorAll('input[type="text"]');
    input.forEach((input) =>
      input.addEventListener("click", (e) => {
        sentimentsPublic = utils.emotionFilter(sentimentsList, (emotion) => {
          return emotion.target.includes(e.target.id);
        });
        needsPublic = utils.emotionFilter(needsList, (need) => {
          return need.target.includes(e.target.id);
        });

        pages.selectSentiments();
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

  createGrid: function () {
    const grid = document.createElement("div");
    grid.className = "grid-container";

    for (let i = 0; i < 10; i++) {
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

  fillCardsInGrid: function (cardType) {
    const grid = utils.createGrid();
    let cardCopy = cardType;

    cardCopy.forEach((sentiments, index) => {
      sentiments.draggable = true;
      sentiments.dataset.draggable = "item";

      sentiments.addEventListener("dragstart", this.dragStart);
      sentiments.addEventListener("dragend", this.dragEnd);

      grid.children[index].appendChild(sentiments);
    });

    document.getElementById("selected-cards").appendChild(grid);

    cardType == sentimentsSelected
      ? utils.loadSentimentsPosition()
      : utils.loadNeedsPosition();
  },

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

  saveSentimentsPosition: function () {
    sentimentsPositions = {};
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
      if (cell.children.length > 0) {
        const cardId = cell.children[0].getAttribute("data-name");
        sentimentsPositions[cardId] = index;
        // console.log("SAVE", cardId, sentimentsPositions);
      }
    });
    localStorage.setItem(
      "sentimentsPositions",
      JSON.stringify(sentimentsPositions)
    );
  },
  // Charger les positions sauvegardées depuis le localStorage
  loadSentimentsPosition: function () {
    const savedPositions = JSON.parse(
      localStorage.getItem("sentimentsPositions")
    );
    if (savedPositions) {
      Object.keys(savedPositions).forEach((cardId) => {
        const card = document.querySelector(`[data-name="${cardId}"]`);

        const targetCell = document.querySelector(
          `[data-index="${savedPositions[cardId]}"]`
        );
        if (card && targetCell) {
          targetCell.appendChild(card);
        }
      });
    }
  },

  saveNeedsPosition: function () {
    needsPositions = {};
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
      if (cell.children.length > 0) {
        const cardId = cell.children[0].getAttribute("data-name");
        needsPositions[cardId] = index;
      }
    });
    localStorage.setItem("needsPositions", JSON.stringify(needsPositions));
  },

  loadNeedsPosition: function () {
    const savedPositions = JSON.parse(localStorage.getItem("needsPositions"));
    if (savedPositions) {
      Object.keys(savedPositions).forEach((cardId) => {
        const card = document.querySelector(`[data-name="${cardId}"]`);
        const targetCell = document.querySelector(
          `[data-index="${savedPositions[cardId]}"]`
        );
        if (card && targetCell) {
          targetCell.appendChild(card);
        }
      });
    }
  },

  updateSentimentsList: function (name) {
    if (sentimentsPublic.hasOwnProperty(name)) {
      delete sentimentsPublic[name];
      console.log(name, "a été supprimé");
    } else console.log(name, " n existe pas dans la liste");
  },

  updateNeedsList: function (name) {
    if (needsPublic.hasOwnProperty(name)) {
      delete needsPublic[name];
      console.log(name, "a été supprimé");
    } else console.log(name, " n existe pas dans la liste");
  },

  darkModeToggle: function () {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.textContent = document.body.classList.contains("dark-mode")
      ? "Mode clair"
      : "Mode sombre";
  },
};

// Objet qui génére les pages de l'appli
const pages = {
  publicChoice: function () {
    const publicDisplay = `
    <div id="target-container">
      <input type="text" id="child" class="target" readonly value="Enfant"></input>
      <input type="text" id="teen" class="target" readonly value="Ado"></input>
      <input type="text" id="adult" class="target" readonly value="Adulte"></input>
    </div>`;

    utils.pageContent(
      "Tu es un(e) : ",
      publicDisplay,
      "et tu as besoin de comprendre ce que tu ressens ..."
    );

    utils.handlePublicChoice();
  },

  selectSentiments: function () {
    utils.pageContent(
      "Sélectionne tes sentiments du moment",
      cards.buildSwiper(),
      '<button id="next">Suite</button>'
    );
    cards.fillCardsInSwiper(sentimentsPublic);

    const sentimentsSwiper = cards.initializeSwiper();

    const yesButton = document.querySelector(".swiper-button-yes");
    const noButton = document.querySelector(".swiper-button-no");

    yesButton.addEventListener("click", () => {
      let activeIndexSlide = sentimentsSwiper.activeIndex;
      let currentSlide = sentimentsSwiper.slides[activeIndexSlide];
      sentimentsSelected.push(currentSlide.firstChild);

      let activeName = document
        .querySelector(".swiper-slide-active")
        .querySelector(".card").dataset.name;
      utils.updateSentimentsList(activeName);

      sentimentsSwiper.removeSlide(activeIndexSlide);
    });

    noButton.addEventListener("click", () => {
      sentimentsSwiper.slideNext();
    });

    next.addEventListener("click", () => this.selectNeeds());
  },

  selectNeeds: function () {
    utils.pageContent(
      "Sélectionne tes besoins du moment",
      cards.buildSwiper(),
      '<button id="prev">PREV</button><button id="next">NEXT</button>'
    );
    cards.fillCardsInSwiper(needsPublic);
    const needsSwiper = cards.initializeSwiper();

    const yesButton = document.querySelector(".swiper-button-yes");
    const noButton = document.querySelector(".swiper-button-no");

    yesButton.addEventListener("click", () => {
      let activeIndexSlide = needsSwiper.activeIndex;
      let currentSlide = needsSwiper.slides[activeIndexSlide];
      needsSelected.push(currentSlide.firstChild);

      let activeName = document
        .querySelector(".swiper-slide-active")
        .querySelector(".card").dataset.name;
      utils.updateNeedsList(activeName);

      needsSwiper.removeSlide(activeIndexSlide);
    });

    noButton.addEventListener("click", () => {
      needsSwiper.slideNext();
    });

    prev.addEventListener("click", () => this.selectSentiments());
    next.addEventListener("click", () =>
      this.sortSelectedCards(sentimentsSelected)
    );
  },

  sortSelectedCards: function (selection) {
    const grilleCardsID = `<div id="selected-cards"></div>`;
    let instructions;
    selection == sentimentsSelected
      ? (instructions = "Organise tes sentiments et besoins a ta guise")
      : (instructions = "Organise tes besoins");

    utils.pageContent(
      instructions,
      grilleCardsID,
      '<button id="prev">BACK</button><button id="next">NEXT</button>'
    );

    utils.fillCardsInGrid(selection);

    prev.addEventListener("click", () => {
      if (selection == sentimentsSelected) {
        utils.saveSentimentsPosition();
        this.selectNeeds();
      } else {
        utils.saveNeedsPosition();
        this.sortSelectedCards(sentimentsSelected);
      }
    });

    next.addEventListener("click", () => {
      if (selection == sentimentsSelected) {
        utils.saveSentimentsPosition();
        this.sortSelectedCards(needsSelected);
      } else {
        utils.saveNeedsPosition();
        this.sumUp();
      }
    });
  },

  sumUp: function () {
    utils.pageContent(
      "Voici un résumé",
      "le voila",
      '<button id="prev">RECOMMENCER</button>'
    );
    prev.addEventListener("click", () => {
      localStorage.clear();
      pages.publicChoice();
    });
  },
};

window.onload = function () {
  utils.getSentiments();
  utils.getNeeds();
};

pages.publicChoice();

darkModeToggle.addEventListener("click", () => utils.darkModeToggle());
