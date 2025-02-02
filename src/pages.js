import cards from "./cards.js";
import CNVFormulationAssistant from "./components/moduleAssistantCNV.js";
import associationModule from "./components/moduleAssociation.js";
import globals from "./globals.js";
import guideCNV from "./guideCNV.js";
import utils from "./utils.js";

const pages = {
  intro: function () {
    const introHeader =
      "Bienvenue dans votre espace de connexion à vous-même et aux autres.";

    const introContent = `<p class="intro-container">  Je suis ravie de vous accueillir dans cette application dédiée à la découverte et à l’expression de vos émotions et besoins à travers un jeu de cartes inspiré de la Communication Non Violente (CNV). </br></br> Ici, vous allez pouvoir <span>explorer ce que vous ressentez</span>, mettre des mots sur <span>vos besoins profonds</span>, et transformer vos relations en cultivant une communication claire, respectueuse et pleine de sens. Ce jeu, conçu comme un outil ludique et introspectif, est une invitation à prendre un moment pour vous, à mieux vous comprendre et à créer des liens plus authentiques avec ceux qui vous entourent.</br></br> Pas besoin d’être un expert en CNV : laissez-vous guider à travers des étapes simples et bienveillantes. Et si vous ressentez le besoin d’aller plus loin, vous pouvez à tout moment solliciter un professionnel pour vous accompagner. </br></br> Prêt(e) à commencer ce voyage intérieur ? Choisissez vos cartes et laissez la magie de la clarté et de la bienveillance opérer. 🌟</p>`;

    utils.pageContent(
      introHeader,
      introContent,
      `<button id="next">COMMENCER</button><button id="cnv">C'EST QUOI LA CNV?</button>`
    );

    const GuideCNV = new guideCNV();
    next.addEventListener("click", () => this.publicChoice());
    cnv.addEventListener("click", () => GuideCNV.createGuide());
  },

  publicChoice: function () {
    const publicDisplay = `
    <div id="target-container">
      <input type="text" id="child" class="target" readonly value="Enfant"></input>
      <input type="text" id="teen" class="target" readonly value="Ado"></input>
      <input type="text" id="adult" class="target" readonly value="Adulte"></input>
    </div>`;

    utils.pageContent("Tu es un(e) : ", publicDisplay, "");

    utils.handlePublicChoice();
  },

  selectCards: function (type) {
    console.log("TYPE", type);
    if (!["sentiments", "needs"].includes(type)) {
      console.error("Type invalide fourni à selectCard");
      return;
    }

    // Mise à jour du contenu de la page
    const headerText =
      type === "sentiments"
        ? "En ce moment je me sens / ressens ... "
        : "Ce dont j'ai besoin est ... ";
    const buttonsHTML =
      type === "sentiments"
        ? '<button id="next">SUITE</button>'
        : '<button id="prev">RETOUR</button><button id="next">TERMINER</button>';

    utils.pageContent(headerText, cards.buildSwiper(), buttonsHTML);

    // Ajout des cartes au Swiper
    const dataToUse =
      type == "sentiments" ? globals.sentimentsPublic : globals.needsPublic;
    cards.fillCardsInSwiper(dataToUse);

    // Initialisation du Swiper
    const cardSwiper = cards.initializeSwiper();

    // Sélection des boutons et gestion des événements
    const yesButton = document.querySelector(".swiper-button-yes");
    const noButton = document.querySelector(".swiper-button-no");
    const nextButton = document.querySelector("#next");
    const prevButton = document.querySelector("#prev");

    const rightDivTop = document.querySelector("#up");
    const rightDivBottom = document.querySelector("#down");

    // Gestion du bouton "Oui"
    yesButton.addEventListener("click", () => {
      let activeIndexSlide = cardSwiper.activeIndex;
      let currentSlide = cardSwiper.slides[activeIndexSlide];

      let activeName = document
        .querySelector(".swiper-slide-active")
        .querySelector(".card").dataset.name;

      if (type == "sentiments") {
        globals.sentimentsSelected.push(currentSlide.firstChild);
        rightDivTop.innerHTML += `<div class="selected sentiments">${activeName} <span id="cross-close">X</span></div>`;
        utils.updateSentimentsList(activeName);
      } else if (type == "needs") {
        globals.needsSelected.push(currentSlide.firstChild);
        rightDivBottom.innerHTML += `<div class="selected needs">${activeName} <span id="cross-close">X</span></div>`;
        utils.updateNeedsList(activeName);
      }
      cardSwiper.removeSlide(activeIndexSlide);
    });

    // Gestion du bouton "Non"
    noButton.addEventListener("click", () => {
      cardSwiper.slideNext();
    });

    // Navigation entre sentiments et besoins
    if (type == "sentiments") {
      // Réinitialisation propre pour passer aux besoins
      // Détruire l'instance Swiper actuelle
      nextButton.addEventListener("click", () => {
        cardSwiper.destroy(true, true);
        this.selectCards("needs");
      });
    } else if (type == "needs") {
      prevButton.addEventListener("click", () => {
        // Réinitialisation pour revenir aux sentiments
        cardSwiper.destroy(true, true);
        this.selectCards("sentiments");
      });
      next.addEventListener("click", () =>
        // this.sortSelectedCards(sentimentsSelected)
        this.sortSelectedCards("sentiments", globals.sentimentsSelected)
      );
    }
  },

  // sortSelectedCards: function (selection) {
  sortSelectedCards: function (type, selection) {
    const rightDivTop = document.querySelector("#up");
    const rightDivBottom = document.querySelector("#down");

    rightDivBottom.innerHTML = "";
    rightDivTop.innerHTML = "";

    let instructions;
    selection == globals.sentimentsSelected
      ? (instructions = "Organise et identifie maintenant tes sentiments")
      : (instructions = "Organise tes besoins pour mieux les identifier");

    const grilleCardsID = `<div id="selected-cards">
    <!-- Zone d'inspiration -->
      <div id="inspiration" class="inspiration">
        🌟 Inspire toi, si tu veux, des modes de tri suivant pour commencer !
      </div>

      <!-- Options de tri -->
      <div class="sorting-options">
        <button class="sort-btn" data-tri="importance">⚖ Importance</button>
        <button class="sort-btn" data-tri="temporalite">⏳ Temporalité</button>
        <button class="sort-btn" data-tri="intensite">🔥 Intensité</button>
        <button class="sort-btn" data-tri="resolution">🚀 Résolution</button>
      </div>
    </div>`;

    utils.pageContent(
      instructions,
      grilleCardsID,
      '<button id="prev">RETOUR</button><button id="next">SUITE</button>'
    );

    utils.fillCardsInGrid(type, selection);

    prev.addEventListener("click", () => {
      if (selection == globals.sentimentsSelected) {
        utils.savePosition("sentiments");
        this.selectCards("needs");
      } else {
        utils.savePosition("needs");
        this.sortSelectedCards("sentiments", globals.sentimentsSelected);
      }
    });

    next.addEventListener("click", () => {
      if (selection == globals.sentimentsSelected) {
        utils.savePosition("sentiments");
        this.sortSelectedCards("needs", globals.needsSelected);
      } else {
        utils.savePosition("needs");
        this.sumUp();
      }
    });

    utils.handleInspiration();
  },

  sumUp: function () {
    const sumUpHeader =
      "Maintenant, que faire de tes sentiments et besoins ? </br>Voici 3 idées pour t'aider à y voir plus clair";
    const sumUpContent = `<div class="sumup">
    <ul>
      <li>Apprends à formuler ta demande grâce à tes sentiments et besoins que tu viens de sélectionner <button id="assistant">&#x1F9ED;</button></li>
      <li>Associe et priorise tes sentiments et besoins <button id="associate">&#x1F517;</button></li>
      <li>Envoie tes résultats à une thérapeute pour une analyse personnalisée (service payant) <button id="discuss">&#x1F4AC;</button></li>
    </ul>
    </div>`;

    utils.pageContent(
      sumUpHeader,
      sumUpContent,
      '<button id="prev">RETOUR</button><button id="reboot">RECOMMENCER</button>'
    );

    prev.addEventListener("click", () => {
      this.sortSelectedCards("sentiments", globals.sentimentsSelected);
    });

    reboot.addEventListener("click", () => {
      localStorage.clear();
      globals.needsPublic = {};
      globals.sentimentsPublic = {};
      globals.sentimentsSelected = [];
      globals.needsSelected = [];
      pages.publicChoice();
    });

    associate.addEventListener("click", () => {
      associationModule.displayTable();
    });

    assistant.addEventListener("click", () => {
      console.log("ASSISTANT CLICK");
      const assistantCNV = new CNVFormulationAssistant("main");
      // const main = document.querySelector("main");
      // assistantCNV();
    });
  },
};

export default pages;
