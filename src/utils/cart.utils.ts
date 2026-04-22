import type { CartItem, Product } from "../types/product";

const CART_KEY = "cart";



export function getCart(): CartItem[] {
	const stored = localStorage.getItem(CART_KEY);

	if (!stored) {
		return [];
	}
	return JSON.parse(stored) as CartItem[];
}

function saveCart(cart: CartItem[]): void {
	localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addProductToCart(product: Product): boolean {
	const cart = getCart();
	const existingItem = cart.find((item) => item.product.id === product.id);
	const currentQuantity = existingItem?.quantity ?? 0;

	if (!product.disponible || product.stock <= 0) {
		return false;
	}

	if (currentQuantity >= product.stock) {
		return false;
	}

	if (existingItem) {
		existingItem.quantity += 1;
	} else {
		cart.push({ product, quantity: 1 });
	}

	saveCart(cart);
	return true;
}

export function removeProductFromCart(productId: number): CartItem[] {
	const cart = getCart().filter((item) => item.product.id !== productId);
	saveCart(cart);
	return cart;
}

export function updateProductQuantity(productId: number, quantity: number): CartItem[] {
	const cart = getCart();
	const target = cart.find((item) => item.product.id === productId);
	if (!target) {
		return cart;
	}
	if (quantity <= 0) {
		return removeProductFromCart(productId);
	}
	target.quantity = quantity;
	saveCart(cart);
	return cart;
}

export function clearCart(): void {
	localStorage.removeItem(CART_KEY);
}

export function getCartItemsCount(cart: CartItem[] = getCart()): number {
	return cart.reduce((acc, item) => acc + item.quantity, 0);
}

export function getCartTotal(cart: CartItem[] = getCart()): number {
	return cart.reduce((acc, item) => acc + item.product.precio * item.quantity, 0);
}

export function removeItemFromCart(productId: number): CartItem[] {
    const updatedCart = getCart().filter((item) => item.product.id !== productId);
    saveCart(updatedCart);
    return updatedCart;
} 