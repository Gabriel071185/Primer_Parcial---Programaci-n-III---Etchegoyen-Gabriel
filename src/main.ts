import { PRODUCTS, getCategories } from "./data/data";
import type { IUser } from "./types/IUser";
import { navigate } from "./utils/navigate";

const heroCollage = document.getElementById("heroCollage") as HTMLDivElement | null;
const productsCount = document.getElementById("productsCount") as HTMLSpanElement | null;
const categoriesCount = document.getElementById("categoriesCount") as HTMLSpanElement | null;

function getSessionUser(): IUser | null {
	const raw = localStorage.getItem("userData");

	if (!raw) {
		return null;
	}

	try {
		return JSON.parse(raw) as IUser;
	} catch {
		return null;
	}
}

function redirectIfLoggedIn(): void {
	const sessionUser = getSessionUser();

	if (!sessionUser?.loggedIn) {
		return;
	}

	if (sessionUser.role === "admin") {
		navigate("/src/pages/admin/home/home.html");
		return;
	}

	navigate("/src/pages/client/home/home.html");
}

function renderHeroCollage(): void {
	if (!heroCollage) {
		return;
	}

	const images = PRODUCTS.filter((product) => !product.eliminado && !!product.imagen)
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

function renderMetrics(): void {
	if (productsCount) {
		const activeProducts = PRODUCTS.filter((product) => !product.eliminado).length;
		productsCount.textContent = String(activeProducts);
	}

	if (categoriesCount) {
		categoriesCount.textContent = String(getCategories().length);
	}
}

redirectIfLoggedIn();
renderHeroCollage();
renderMetrics();
