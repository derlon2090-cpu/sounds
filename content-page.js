const themeBtn = document.getElementById("themeToggle");
const langArBtn = document.getElementById("langAr");
const langEnBtn = document.getElementById("langEn");
const topBtn = document.getElementById("toTopBtn");
const THEME_KEY = "mulhem_theme_v2";
const LANG_KEY = "mulhem_lang_v2";

let currentLang = localStorage.getItem(LANG_KEY) || "ar";

function pageCopy() {
  return window.PAGE_COPY?.[currentLang] || window.PAGE_COPY?.ar || {};
}

function setText(node, value) {
  if (node) node.textContent = value;
}

function applyTheme(theme) {
  document.body.dataset.theme = theme === "dark" ? "dark" : "light";
  const key = document.body.dataset.theme === "dark" ? "theme_light" : "theme_dark";
  setText(themeBtn, pageCopy()[key] || (document.body.dataset.theme === "dark" ? "Light Mode" : "Dark Mode"));
  localStorage.setItem(THEME_KEY, document.body.dataset.theme);
}

function applyLanguage(lang) {
  currentLang = lang === "en" ? "en" : "ar";
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  const data = pageCopy();
  document.title = data.title || document.title;
  langArBtn?.classList.toggle("active", currentLang === "ar");
  langEnBtn?.classList.toggle("active", currentLang === "en");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (data[key]) node.textContent = data[key];
  });

  applyTheme(document.body.dataset.theme || localStorage.getItem(THEME_KEY) || "light");
  localStorage.setItem(LANG_KEY, currentLang);
}

themeBtn?.addEventListener("click", () => applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark"));
langArBtn?.addEventListener("click", () => applyLanguage("ar"));
langEnBtn?.addEventListener("click", () => applyLanguage("en"));

window.addEventListener("scroll", () => {
  topBtn?.classList.toggle("visible", window.scrollY > 260);
});

topBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll("[data-animate]").forEach((node, index) => {
  setTimeout(() => node.classList.add("is-visible"), 80 + index * 45);
});

document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", (event) => {
    const link = card.querySelector("a");
    if (!link) return;
    if (event.target.closest("a, button")) return;
    window.location.href = link.getAttribute("href");
  });
});

applyTheme(localStorage.getItem(THEME_KEY) || ((window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"));
applyLanguage(currentLang);
