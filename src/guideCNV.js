import utils from "./utils.js";

class guideCNV {
  constructor() {
    this.currentStep = 0;
    this.steps = [
      {
        title: "Bienvenue dans la Communication Non Violente",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
        content: `La CNV est un processus qui nous aide à mieux communiquer avec nous-mêmes et les autres. 
                  Elle nous permet de transformer nos jugements en expression authentique et empathique.`,
        color: "#FFF1F2",
        iconColor: "text-rose-500",
      },
      {
        title: "L'origine de la Communication Non Violente",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-linecap="round" stroke-linejoin="round" width="48" height="48" stroke-width="2" > <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"></path> <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"></path> <path d="M3 6l0 13"></path> <path d="M12 6l0 13"></path> <path d="M21 6l0 13"></path> </svg> `,
        content: `La Communication NonViolente (CNV) est une méthode de communication développée par Marshall B. Rosenberg qui met l'accent sur l'empathie, la compréhension et la résolution pacifique des conflits.`,
        color: "#FFF1F2",
        iconColor: "text-rose-500",
      },
      {
        title: "1. Observer sans juger",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
        content: `Décrivez les faits concrets que vous observez, comme le ferait une caméra, 
                  sans y mêler d'évaluations ou de jugements.`,
        example:
          "Au lieu de dire : 'Tu es désorganisé'\nDites : 'Je vois des vêtements sur le sol'",
        color: "#EFF6FF",
        iconColor: "text-blue-500",
      },
      {
        title: "2. Exprimer ses sentiments",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9333ea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
        content: `Identifiez et exprimez vos émotions et sentiments, sans les confondre avec des pensées 
                  ou des interprétations.`,
        example:
          "Au lieu de dire : 'Je me sens ignoré'\nDites : 'Je me sens triste'",
        color: "#FAF5FF",
        iconColor: "text-purple-500",
      },
      {
        title: "3. Identifier les besoins",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
        content: `Reconnaissez les besoins, valeurs et désirs qui sont à l'origine de vos sentiments. 
                  Les besoins sont universels et nous les partageons tous.`,
        example:
          "Au lieu de dire : 'Tu ne m'écoutes jamais'\nDites : 'J'ai besoin d'être entendu'",
        color: "#F0FDF4",
        iconColor: "text-green-500",
      },
      {
        title: "4. Formuler une demande et / ou faire un petit pas",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
        content: `Exprimez une demande claire, concrète et réalisable, formulée de manière positive 
                  et négociable.`,
        example:
          "Au lieu de dire : 'Arrête de m'ignorer'\nDites : 'Pourrions-nous parler 10 minutes ?'",
        color: "#FFF7ED",
        iconColor: "text-orange-500",
      },
    ];
  }
  createGuide() {
    const CnvHTML = `<div class="cnv-card">
        <div class="cnv-card-header">
            <div class="cnv-card-title">Guide CNV</div>
            <div class="cnv-progress-dots"></div>
        </div>
        <div class="cnv-card-content">
            <div id="cnv-step-container"></div>
        </div>
    </div>`;
    utils.pageContent("", CnvHTML, "");

    this.createDots();
    this.renderStep();
  }

  createDots() {
    const dotsContainer = document.querySelector(".cnv-progress-dots");
    this.steps.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.className = `dot ${index === 0 ? "active" : ""}`;
      dotsContainer.appendChild(dot);
    });
  }

  updateDots() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.className = `dot ${index === this.currentStep ? "active" : ""}`;
    });
  }

  renderStep() {
    const container = document.getElementById("cnv-step-container");
    const step = this.steps[this.currentStep];

    const stepHtml = `
        <div class="step" style="background-color: ${step.color}">
            <div class="icon">${step.icon}</div>
            <h2 class="step-title">${step.title}</h2>
            <p class="step-content">${step.content}</p>
            ${
              step.example
                ? `
                <div class="example">
                    <p class="example-title">Exemple :</p>
                    ${step.example
                      .split("\n")
                      .map((line) => `<p>${line}</p>`)
                      .join("")}
                </div>
            `
                : ""
            }
            <div class="cnv-navigation">
                <button class="cnv-button" id="cnvButLeft" ${
                  this.currentStep === 0 ? "disabled" : ""
                }>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    Précédent
                </button>
                <button class="cnv-button" id="cnvButRight"  ${
                  this.currentStep === this.steps.length - 1 ? "disabled" : ""
                }>
                    Suivant
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </div>
        </div>
    `;

    container.innerHTML = stepHtml;
    cnvButLeft.addEventListener("click", () => this.previousStep());
    cnvButRight.addEventListener("click", () => this.nextStep());
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.updateDots();
      this.renderStep();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateDots();
      this.renderStep();
    }
  }
}

export default guideCNV;
