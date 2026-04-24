import { checkAuhtUser, logout, setupLogoNavigation } from "../../../utils/auth";
import { PRODUCTS } from "../../../data/data";

const buttonLogout = document.getElementById(
  "logoutButton"
) as HTMLButtonElement;
const outOfStockList = document.getElementById("outOfStockList") as HTMLDivElement | null;
const outOfStockCount = document.getElementById("outOfStockCount") as HTMLSpanElement | null;
const adminEmpty = document.getElementById("adminEmpty") as HTMLDivElement | null;

buttonLogout?.addEventListener("click", () => {
  logout();
});

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function renderOutOfStockProducts(): void {
  if (!outOfStockList || !outOfStockCount || !adminEmpty) {
    return;
  }

  const productsWithoutStock = PRODUCTS.filter(
    (product) => !product.eliminado && (!product.disponible || product.stock <= 0)
  );

  outOfStockCount.textContent = `${productsWithoutStock.length} producto${
    productsWithoutStock.length === 1 ? "" : "s"
  }`;

  if (productsWithoutStock.length === 0) {
    outOfStockList.innerHTML = "";
    adminEmpty.style.display = "block";
    return;
  }

  adminEmpty.style.display = "none";

  outOfStockList.innerHTML = productsWithoutStock
    .map(
      (product) => `
        <article class="admin-item">
          <img src="${product.imagen}" alt="${product.nombre}" class="admin-item-image" />
          <div class="admin-item-content">
            <p class="admin-item-category">${product.categorias[0]?.nombre ?? "General"}</p>
            <h3 class="admin-item-name">${product.nombre}</h3>
            <p class="admin-item-description">${product.descripcion}</p>
          </div>
          <div class="admin-item-meta">
            <p class="admin-item-price">${formatCurrency(product.precio)}</p>
            <span class="admin-item-status">Sin stock</span>
          </div>
        </article>
      `
    )
    .join("");
}

const initPage = () => {
  console.log("inicio de pagina");
  setupLogoNavigation();
  checkAuhtUser(
    "/src/pages/auth/login/login.html",
    "/src/pages/client/home/home.html",
    "admin"
  );
  renderOutOfStockProducts();
};
initPage();
