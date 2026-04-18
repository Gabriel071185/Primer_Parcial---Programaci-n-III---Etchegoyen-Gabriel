import { getCategories, PRODUCTS } from "../../../data/data";
import type { CategoryFilter } from "../../../types/categoria";
import {searchProductsByName, filterProductsByCategory } from "../../../utils/product.utils";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.min.css";


const categoriesList = document.getElementById("categoriesList") as HTMLUListElement | null;
const searchInput = document.getElementById("searchInput") as HTMLInputElement | null;
const productsGrid = document.getElementById("productsGrid") as HTMLDivElement | null;
const noProducts = document.getElementById("noProducts") as HTMLDivElement | null;
const productsCount = document.getElementById("productsCount") as HTMLParagraphElement | null;
const categories = getCategories();
const products = PRODUCTS.filter((product) => !product.eliminado);

let selectedCategory: CategoryFilter = "all";
let searchTerm = "";





function renderCategories(): void {
	if (!categoriesList) {
		return;
	}

	categoriesList.innerHTML = "";

	const allButtonMarkup = `
		<li>
			<button class="category-btn ${selectedCategory === "all" ? "active" : ""}" data-category="all">
				Todas las categorías
			</button>
		</li>
	`;

	const categoryButtonsMarkup = categories
		.map(
			(category) => `
				<li>
					<button
						class="category-btn ${selectedCategory === category.id ? "active" : ""}"
						data-category="${category.id}"
						title="${category.descripcion}"
					>
						${category.nombre}
					</button>
				</li>
			`
		)
		.join("");

	categoriesList.innerHTML = allButtonMarkup + categoryButtonsMarkup;
}

function renderProducts(): void {
	if (!productsGrid || !noProducts || !productsCount) {
		return;
	}

	const filteredByCategory = filterProductsByCategory(products, selectedCategory);
	const filtered = searchProductsByName(filteredByCategory, searchTerm);

	productsCount.textContent = `${filtered.length} producto${filtered.length === 1 ? "" : "s"}`;

	if (filtered.length === 0) {
		productsGrid.innerHTML = "";
		noProducts.style.display = "block";
		return;
	}

	noProducts.style.display = "none";

	productsGrid.innerHTML = filtered
		.map((product) => {
			const mainCategory = product.categorias[0]?.nombre ?? "General";
			const inStock = product.disponible && product.stock > 0;
			

			return `
				<article class="product-card">
					<div class="product-image-container">
                        <img src="${product.imagen}" alt="${product.nombre}" class="product-image" />
					</div>

					<div class="product-info">
						<p class="product-category">${mainCategory}</p>
						<h3 class="product-name">${product.nombre}</h3>
						<p class="product-description">${product.descripcion}</p>

						<span class="stock-badge ${inStock ? "available" : "unavailable"}">
							${inStock ? `Stock disponible: ${product.stock}` : "Sin stock"}
						</span>

						<div class="product-footer">
							<div>
								<p class="product-price">${product.precio}</p>
							</div>

							<button class="btn-add" data-product-id="${product.id}" ${inStock ? "" : "disabled"}>
								${inStock ? "Agregar" : "Agotado"}
							</button>
						</div>
					</div>
				</article>
			`;
		})
		.join("");
}

function setupEvents(): void {
	searchInput?.addEventListener("input", (event) => {
		const target = event.target as HTMLInputElement;
		searchTerm = target.value;
		renderProducts();
	});

	categoriesList?.addEventListener("click", (event) => {
		const target = event.target as HTMLElement;
		const button = target.closest("button.category-btn") as HTMLButtonElement | null;

		if (!button) {
			return;
		}

		const categoryValue = button.dataset.category;

		if (!categoryValue) {
			return;
		}

		selectedCategory = categoryValue === "all" ? "all" : Number(categoryValue);
		renderCategories();
		renderProducts();
	});

	productsGrid?.addEventListener("click", (event) => {
		const target = event.target as HTMLElement;
		const button = target.closest("button.btn-add") as HTMLButtonElement | null;

		if (!button) {
			return;
		}

		const id = Number(button.dataset.productId);

		if (!Number.isFinite(id)) {
			return;
		}

		//addToCart(id);
		alertify.success("Producto añadido al carrito");
	});
}

renderCategories();
renderProducts();
setupEvents()