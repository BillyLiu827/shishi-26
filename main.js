const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector("#site-menu");

menuBtn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

const blessings = [
  "希望詩詩二十六歲，每天都開心。",
  "希望詩詩二十六歲，每天都靚靚。",
  "希望詩詩二十六歲，每天都幸福。",
  "希望詩詩二十六歲，每天都健康。",
  "希望詩詩二十六歲，每天都快樂。",
  "希望詩詩二十六歲，每天都平安。",
  "希望詩詩二十六歲，每天都順利。",
  "希望詩詩二十六歲，每天都成功。",
  "希望詩詩二十六歲，搵到好工。",
  "希望詩詩二十六歲，坐車都有位坐。",
  "希望詩詩二十六歲，食到好多好野。",
  "希望詩詩二十六歲，細佬唔好再發脾氣。",
  "希望詩詩二十六歲，屋企人都健健康康。",
  "希望詩詩二十六歲，每天都繼續有健bb陪住你。",
  "詩詩，二十六歲生日快樂。"
];

const starGrid = document.querySelector("#star-grid");
const litCount = document.querySelector("#lit-count");
const photos = Array.isArray(PHOTOS) ? PHOTOS : [];
const opened = new Set();
let lit = 0;
const stage = document.querySelector("#stage");
const stageCap = document.querySelector("#stage-cap");
let stageIndex = 0;
let stageTimer = 0;

function renderStage(index) {
  if (!photos.length) return;
  stageIndex = (index + photos.length) % photos.length;
  stage.src = photos[stageIndex];
  stage.alt = `詩詩的照片 ${stageIndex + 1}`;
  stageCap.textContent = `${stageIndex + 1} / ${photos.length}`;
}

function queueStage() {
  window.clearInterval(stageTimer);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  stageTimer = window.setInterval(() => renderStage(stageIndex + 1), 3200);
}

renderStage(0);
queueStage();
document.querySelector("#stage-prev").addEventListener("click", () => {
  renderStage(stageIndex - 1);
  queueStage();
});
document.querySelector("#stage-next").addEventListener("click", () => {
  renderStage(stageIndex + 1);
  queueStage();
});
stage.addEventListener("click", () => openLightbox(stageIndex));
document.querySelector(".frame").addEventListener("mouseenter", () => window.clearInterval(stageTimer));
document.querySelector(".frame").addEventListener("mouseleave", queueStage);

photos.forEach((name, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "star";
  button.setAttribute("aria-label", `打開第 ${index + 1} 歲的照片和話`);
  const img = document.createElement("img");
  img.src = name;
  img.alt = "";
  img.loading = "lazy";
  const num = document.createElement("span");
  num.className = "num";
  num.textContent = String(index + 1);
  button.append(img, num);
  button.addEventListener("click", () => openLightbox(index));
  starGrid.appendChild(button);
}); 

const dialog = document.querySelector("#lightbox");
const lbImg = document.querySelector("#lb-img");
const lbMsg = document.querySelector("#lb-msg");
const lbCount = document.querySelector("#lb-count");
let current = 0;

function showPhoto(index) {
  if (!photos.length) return;
  current = (index + photos.length) % photos.length;
  lbImg.src = photos[current];
  lbImg.alt = `第 ${current + 1} 歲的照片`;
  lbMsg.textContent = blessings[current] || "";
  lbCount.textContent = `第 ${current + 1} 歲 / ${photos.length}`;
  const card = starGrid.children[current];
  if (card && !opened.has(current)) {
    opened.add(current);
    card.classList.add("open");
    lit += 1;
    litCount.textContent = String(lit);
  }
}

function openLightbox(index) {
  showPhoto(index);
  if (!dialog.open) dialog.showModal();
}

document.querySelector("#lb-close").addEventListener("click", () => dialog.close());
document.querySelector("#lb-prev").addEventListener("click", () => showPhoto(current - 1));
document.querySelector("#lb-next").addEventListener("click", () => showPhoto(current + 1));
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  dialog.close();
});
document.addEventListener("keydown", (event) => {
  if (!dialog.open) return;
  if (event.key === "ArrowLeft") showPhoto(current - 1);
  if (event.key === "ArrowRight") showPhoto(current + 1);
});

const cake = document.querySelector("#cake-art");
const blow = document.querySelector("#blow");
const wishLine = document.querySelector("#wish-line");
const confetti = document.querySelector("#confetti");
const colors = ["#ef3d32", "#ffd34d", "#2f6fbe", "#3e9b45", "#fff"];

function burst() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  for (let i = 0; i < 36; i += 1) {
    const piece = document.createElement("span");
    piece.className = "piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.2}s`;
    confetti.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}

blow.addEventListener("click", () => {
  const out = cake.classList.toggle("out");
  wishLine.hidden = !out;
  blow.textContent = out ? "再把蠟燭點亮" : "幫詩詩吹蠟燭";
  if (out) burst();
});
