import globals from "./src/globals.js";
import pages from "./src/pages.js";
import utils from "./src/utils.js";

// const main = document.querySelector("main");
const intro = document.querySelector(".intro");
const start = document.querySelector(".start");
const resume = document.querySelector(".resume");
const account = document.querySelector(".account");

// ------------ START -------------

window.onload = function () {
  utils.getSentiments();
  utils.getNeeds();
};

pages.intro();

globals.darkModeToggle.addEventListener("click", () => {
  utils.darkModeToggle();
});

intro.addEventListener("click", () => pages.intro());
start.addEventListener("click", () => pages.publicChoice());
resume.addEventListener("click", () => pages.sumUp());
account.addEventListener("click", () => pages.publicChoice());
