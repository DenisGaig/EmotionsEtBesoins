import utils from "../utils.js";

class CNVFormulationAssistant {
  constructor(containerId) {
    utils.pageContent("", "", "");
    this.container = document.getElementById(containerId);
    this.currentStep = 0;
    this.formulation = {
      observation: "",
      feeling: "",
      need: "",
      request: "",
    };
    this.copied = false;

    this.stepHelpers = {
      observation: {
        title: "Observation",
        description:
          "Décrivez la situation de manière factuelle, sans jugement",
        examples: ["Quand je vois...", "Quand j'entends...", "Lorsque tu..."],
        suggestions: [
          "Sans interprétation",
          "Sans évaluation",
          "Comme si c'était filmé",
        ],
      },
      feeling: {
        title: "Sentiment",
        description: "Exprimez l'émotion que vous ressentez",
        examples: ["Je me sens...", "Je suis...", "Je ressens..."],
        suggestions: [
          "Identifiez l'émotion principale",
          "Évitez les jugements déguisés",
          "Restez centré sur vous",
        ],
      },
      need: {
        title: "Besoin",
        description: "Identifiez le besoin non satisfait",
        examples: [
          "Parce que j'ai besoin de...",
          "Car j'ai besoin de...",
          "Car c'est important pour moi de...",
        ],
        suggestions: [
          "Un besoin est universel",
          "Sans référence à une personne",
          "Sans stratégie spécifique",
        ],
      },
      request: {
        title: "Demande",
        description: "Formulez une demande concrète, réalisable et négociable",
        examples: [
          "Est-ce que tu serais d'accord pour...",
          "Serais-tu prêt à...",
          "Pourrions-nous...",
        ],
        suggestions: [
          "Action concrète",
          "Dans le présent",
          "Formulée positivement",
        ],
      },
    };

    this.steps = Object.keys(this.stepHelpers);
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  createCard() {
    const card = document.createElement("div");
    card.className = "card-assistant";
    return card;
  }

  createHeader() {
    const header = document.createElement("div");
    header.className = "card-assistant-header";

    const title = document.createElement("h2");
    title.className = "card-assistant-title";
    title.textContent = "Assistant de Formulation CNV";

    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";

    this.steps.forEach((step, index) => {
      const stepIndicator = document.createElement("div");
      stepIndicator.className = `step-indicator ${
        index === this.currentStep
          ? "active"
          : index < this.currentStep
          ? "completed"
          : "inactive"
      }`;
      progressBar.appendChild(stepIndicator);
    });

    header.appendChild(title);
    header.appendChild(progressBar);
    return header;
  }

  createMainContent() {
    const currentHelper = this.stepHelpers[this.steps[this.currentStep]];
    const content = document.createElement("div");
    content.className = "card-content";

    const inputSection = document.createElement("div");
    inputSection.className = "input-section";

    const titleSection = document.createElement("div");
    titleSection.innerHTML = `
      <h3 class="section-title">${currentHelper.title}</h3>
      <p class="section-description">${currentHelper.description}</p>
    `;

    const textarea = document.createElement("textarea");
    textarea.className = "input-textarea";
    textarea.placeholder = `${currentHelper.examples[0]}...`;
    textarea.value = this.formulation[this.steps[this.currentStep]];

    const suggestionsSection = this.createSuggestionsSection(currentHelper);
    const examplesSection = this.createExamplesSection(currentHelper);
    const previewSection = this.createPreviewSection();
    const navigationSection = this.createNavigationSection();

    inputSection.appendChild(titleSection);
    inputSection.appendChild(textarea);
    inputSection.appendChild(suggestionsSection);
    inputSection.appendChild(examplesSection);
    content.appendChild(inputSection);
    content.appendChild(previewSection);
    content.appendChild(navigationSection);

    return content;
  }

  createSuggestionsSection(currentHelper) {
    const section = document.createElement("div");
    section.className = "suggestions-section";
    section.innerHTML = `
      <p class="suggestions-title">Suggestions :</p>
      <div class="suggestions-list">
        ${currentHelper.suggestions
          .map(
            (suggestion) => `
          <div class="suggestion-item">
            ${suggestion}
          </div>
        `
          )
          .join("")}
      </div>
    `;
    return section;
  }

  createExamplesSection(currentHelper) {
    const section = document.createElement("div");
    section.className = "examples-section";
    section.innerHTML = `
      <p class="examples-title">Exemples :</p>
      <div class="examples-list">
        ${currentHelper.examples
          .map(
            (example) => `
          <button class="example-btn" data-example="${example}">
            ${example}
          </button>
        `
          )
          .join("")}
      </div>
    `;
    return section;
  }

  createPreviewSection() {
    const section = document.createElement("div");
    section.className = "preview-section";

    const header = document.createElement("div");
    header.className = "preview-header";
    header.innerHTML = `
      <h4 class="preview-title">Formulation complète</h4>
      <button class="copy-btn">
        <span class="copy-icon">${this.copied ? "✓" : "📋"}</span>
        <span class="copy-text">${this.copied ? "Copié !" : "Copier"}</span>
      </button>
    `;

    const preview = document.createElement("div");
    preview.className = "preview-content";
    preview.innerHTML = Object.entries(this.formulation)
      .filter(([_, value]) => value)
      .map(([_, value]) => `<p class="preview-item">${value}</p>`)
      .join("");

    section.appendChild(header);
    section.appendChild(preview);
    return section;
  }

  createNavigationSection() {
    const section = document.createElement("div");
    section.className = "navigation-section";

    const prevButton = document.createElement("button");
    prevButton.className = `prev-btn ${
      this.currentStep === 0 ? "disabled" : ""
    }`;
    prevButton.innerHTML = `← Précédent`;
    prevButton.disabled = this.currentStep === 0;

    const nextButton = document.createElement("button");
    nextButton.className = `next-btn ${
      this.currentStep === this.steps.length - 1 ? "disabled" : ""
    }`;
    nextButton.innerHTML = `Suivant →`;
    nextButton.disabled = this.currentStep === this.steps.length - 1;

    section.appendChild(prevButton);
    section.appendChild(nextButton);
    return section;
  }

  render() {
    console.log("RENDER");
    this.container.innerHTML = "";
    const card = this.createCard();
    card.appendChild(this.createHeader());
    card.appendChild(this.createMainContent());
    this.container.appendChild(card);
  }

  attachEventListeners() {
    const textarea = this.container.querySelector("textarea");
    textarea.addEventListener("input", (e) => {
      this.handleInputChange(e.target.value);
    });

    const exampleButtons = this.container.querySelectorAll(".example-btn");
    exampleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.handleInputChange(button.dataset.example);
      });
    });

    const copyButton = this.container.querySelector(".copy-btn");
    copyButton.addEventListener("click", () => this.copyToClipboard());

    const prevButton = this.container.querySelector(".prev-btn");
    const nextButton = this.container.querySelector(".next-btn");

    prevButton.addEventListener("click", () => {
      if (this.currentStep > 0) {
        this.currentStep--;
        this.render();
        this.attachEventListeners();
      }
    });

    nextButton.addEventListener("click", () => {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
        this.render();
        this.attachEventListeners();
      }
    });
  }

  handleInputChange(value) {
    this.formulation[this.steps[this.currentStep]] = value;
    this.render();
    this.attachEventListeners();
  }

  copyToClipboard() {
    const fullText = Object.values(this.formulation)
      .filter(Boolean)
      .join("\n")
      .trim();

    navigator.clipboard.writeText(fullText);
    this.copied = true;
    this.render();
    this.attachEventListeners();

    setTimeout(() => {
      this.copied = false;
      this.render();
      this.attachEventListeners();
    }, 2000);
  }
}
export default CNVFormulationAssistant;
