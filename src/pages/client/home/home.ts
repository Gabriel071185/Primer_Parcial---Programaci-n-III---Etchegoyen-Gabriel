import { checkAuhtUser, logout } from "../../../utils/auth";
import { PRODUCTS } from "../../../data/data";

const buttonLogout = document.getElementById(
  "logoutButton"
) as HTMLButtonElement;
const heroCollage = document.getElementById("heroCollage") as HTMLDivElement | null;

buttonLogout?.addEventListener("click", () => {
  logout();
});

function renderHeroCollage(): void {
  if (!heroCollage) {
    return;
  }

  const images = PRODUCTS.filter((product) => !product.eliminado && product.imagen)
    .map((product) => product.imagen)
    .slice(0, 8);

  heroCollage.innerHTML = images
    .map(
      (image, index) => `
      <article class="collage-item collage-item-${index + 1}">
        <img src="${image}" alt="Producto destacado ${index + 1}" loading="lazy" />
      </article>
    `
    )
    .join("");
}

const initPage = () => {
  console.log("inicio de pagina");
  checkAuhtUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/admin/home/home.html",
    "client"
  );
  renderHeroCollage();
};
initPage();
