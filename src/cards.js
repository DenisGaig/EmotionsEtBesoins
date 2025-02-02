import globals from "./globals.js";

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
    // console.log("NAME", name, "DATA", data, "TAG", tag);
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
    if (sentimentsOrNeeds === globals.needsPublic) {
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

export default cards;
