const header = document.getElementById("header");
const menu = document.getElementById("menu");
const menuButton = document.getElementById("menu-mobile");
const topButton = document.getElementById("voltarTopo");

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
}

window.addEventListener("scroll", () => {
  if (header) header.classList.toggle("scrolled", window.scrollY > 40);
  if (topButton) topButton.classList.toggle("active", window.scrollY > 600);
});

if (topButton) {
  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => {
    if (menu) menu.classList.remove("active");
  });
});
