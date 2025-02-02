import globals from "../globals.js";
import pages from "../pages.js";
import utils from "../utils.js";

const associationModule = {
  displayTable: function () {
    const associateHeader =
      "Parce que chaque sentiment exprime un ou plusieurs besoins non assouvis, réalise tes propres associations";
    const associationContent = `<div class="needs-container">
      <h3>Besoins sélectionnés</h3>
      <div id="needs-list">
        <!-- Les besoins seront affichés ici -->
      </div>
    </div>

    <table class="sentiments-table">
      <thead>
        <tr>
          <th>Sentiments</th>
          <th>Besoins Associés</th>
        </tr>
      </thead>
      <tbody id="sentiments-list">
        <!-- Les sentiments seront affichés ici -->
      </tbody>
    </table>`;
    utils.pageContent(
      associateHeader,
      associationContent,
      '<button id="prev">RETOUR</button>'
    );

    prev.addEventListener("click", () => {
      pages.sumUp();
    });

    this.associate(globals.sentimentsSelected, globals.needsSelected);
  },

  associate: function (sentiments, needs) {
    // Sélecteurs
    const needsList = document.getElementById("needs-list");
    const sentimentsList = document.getElementById("sentiments-list");

    // Afficher les besoins dans la zone au-dessus
    needs.forEach((need) => {
      const needElement = document.createElement("div");
      needElement.classList.add("need");
      needElement.setAttribute("draggable", "true");
      needElement.textContent = need.dataset.name;

      // Ajout des événements de drag and drop
      needElement.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", need.dataset.name);
      });

      needsList.appendChild(needElement);
    });

    // Afficher les sentiments dans le tableau
    sentiments.forEach((sentiment) => {
      const row = document.createElement("tr");
      row.classList.add("sentiment-row");

      // Colonne Sentiment
      const sentimentCell = document.createElement("td");
      sentimentCell.textContent = sentiment.dataset.name;
      row.appendChild(sentimentCell);

      // Colonne Besoins Associés (Dropzone)
      const needsCell = document.createElement("td");
      needsCell.classList.add("dropzone");
      needsCell.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      });

      needsCell.addEventListener("drop", (e) => {
        e.preventDefault();
        const droppedNeed = e.dataTransfer.getData("text/plain");

        // Vérifier si le besoin existe déjà dans la zone
        if (
          !Array.from(needsCell.children).some(
            (child) => child.textContent === droppedNeed
          )
        ) {
          const needTag = document.createElement("span");
          needTag.classList.add("need");
          needTag.textContent = droppedNeed;

          // Ajout d'un bouton pour supprimer le besoin
          const removeBtn = document.createElement("span");
          removeBtn.textContent = " ✖";
          removeBtn.style.cursor = "pointer";
          removeBtn.style.marginLeft = "10px";
          removeBtn.addEventListener("click", () => {
            needsCell.removeChild(needTag);
          });

          needTag.appendChild(removeBtn);
          needsCell.appendChild(needTag);
        }
      });

      row.appendChild(needsCell);
      sentimentsList.appendChild(row);
    });
  },
};

export default associationModule;
