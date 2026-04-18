import type { Product } from "../types/product";
import type { CategoryFilter } from "../types/categoria";



export function searchProductsByName(products: Product[], searchTerm: string): Product[] {
	const term = searchTerm.trim().toLowerCase();
	if (term.length === 0) return products;
    return products.filter((product) =>
		product.nombre.toLowerCase().includes(term)
	);
}

export function filterProductsByCategory(products: Product[], selectedCategory: CategoryFilter): Product[] {
    if (selectedCategory === "all") return products;
    return products.filter((product) =>
        product.categorias.some((category) => category.id === selectedCategory)
    );
}