import type { CartItem } from "../../../types/product";
import {
	clearCart,
	getCart,
	getCartItemsCount,
	getCartTotal,
	removeProductFromCart,
	updateProductQuantity,
} from "../../../utils/cart.utils";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.min.css";

const cartBadge = document.getElementById("cartBadge") as HTMLSpanElement | null;
const clearCartBtn = document.getElementById("clearCartBtn") as HTMLButtonElement | null;
const cartContent = document.getElementById("cartContent") as HTMLDivElement | null;
const emptyCart = document.getElementById("emptyCart") as HTMLDivElement | null;
const itemsCount = document.getElementById("itemsCount") as HTMLSpanElement | null;
const itemsList = document.getElementById("itemsList") as HTMLDivElement | null;
const subtotal = document.getElementById("subtotal") as HTMLSpanElement | null;
const total = document.getElementById("total") as HTMLSpanElement | null;
const checkoutBtn = document.getElementById("checkoutBtn") as HTMLButtonElement | null;

const confirmModal = document.getElementById("confirmModal") as HTMLDivElement | null;
const modalMessage = document.getElementById("modalMessage") as HTMLParagraphElement | null;
const modalConfirm = document.getElementById("modalConfirm") as HTMLButtonElement | null;
const modalCancel = document.getElementById("modalCancel") as HTMLButtonElement | null;
const modalClose = document.getElementById("modalClose") as HTMLButtonElement | null;

let confirmAction: (() => void) | null = null;

function formatCurrency(value: number): string {
	return new Intl.NumberFormat("es-AR", {
		style: "currency",
		currency: "ARS",
		maximumFractionDigits: 0,
	}).format(value);
}

function openConfirm(message: string, action: () => void): void {
	if (!confirmModal || !modalMessage) {
		action();
		return;
	}

	modalMessage.textContent = message;
	confirmAction = action;
	confirmModal.classList.add("show");
}

function closeConfirm(): void {
	if (!confirmModal) {
		return;
	}

	confirmModal.classList.remove("show");
	confirmAction = null;
}

function renderItems(cart: CartItem[]): void {
	if (!itemsList) {
		return;
	}

	itemsList.innerHTML = cart
		.map((item) => {
			const stockReached = item.quantity >= item.product.stock;

			return `
				<article class="cart-item" data-product-id="${item.product.id}">
					<div class="item-image-container">
						<img src="${item.product.imagen}" alt="${item.product.nombre}" class="item-image" />
					</div>

					<div class="item-details">
						<div>
							<h4 class="item-name">${item.product.nombre}</h4>
							<p class="item-category">${item.product.categorias[0]?.nombre ?? "General"}</p>
							<p class="item-price">${formatCurrency(item.product.precio)}</p>
						</div>

						<div class="item-subtotal">
							<span class="subtotal-label">Subtotal</span>
							<span class="subtotal-value">${formatCurrency(item.product.precio * item.quantity)}</span>
						</div>
					</div>

					<div class="item-actions">
						<button class="btn-remove" data-action="remove" title="Eliminar producto">🗑️</button>

						<div class="quantity-controls">
							<button class="btn-quantity" data-action="decrease" ${item.quantity <= 1 ? "disabled" : ""}>−</button>
							<span class="quantity-value">${item.quantity}</span>
							<button class="btn-quantity" data-action="increase" ${stockReached ? "disabled" : ""}>+</button>
						</div>
					</div>
				</article>
			`;
		})
		.join("");
}

function renderCart(): void {
	const cart = getCart();
	const totalItems = getCartItemsCount(cart);
	const orderTotal = getCartTotal(cart);

	if (cartBadge) {
		cartBadge.textContent = String(totalItems);
	}

	if (itemsCount) {
		itemsCount.textContent = `${totalItems} item${totalItems === 1 ? "" : "s"}`;
	}

	if (subtotal) {
		subtotal.textContent = formatCurrency(orderTotal);
	}

	if (total) {
		total.textContent = formatCurrency(orderTotal);
	}

	if (cart.length === 0) {
		if (emptyCart) {
			emptyCart.style.display = "flex";
		}

		if (cartContent) {
			cartContent.style.display = "none";
		}

		if (clearCartBtn) {
			clearCartBtn.style.display = "none";
		}

		if (itemsList) {
			itemsList.innerHTML = "";
		}

		return;
	}

	if (emptyCart) {
		emptyCart.style.display = "none";
	}

	if (cartContent) {
		cartContent.style.display = "block";
	}

	if (clearCartBtn) {
		clearCartBtn.style.display = "inline-block";
	}

	renderItems(cart);
}

function setupEvents(): void {
	clearCartBtn?.addEventListener("click", () => {
		openConfirm("¿Seguro que quieres vaciar el carrito?", () => {
			clearCart();
			renderCart();
			alertify.success("Carrito vaciado");
		});
	});

	checkoutBtn?.addEventListener("click", () => {
		alertify.warning("En breve podrás finalizar tu compra. Estamos trabajando para ofrecerte la mejor experiencia.");
	});

	itemsList?.addEventListener("click", (event) => {
		const target = event.target as HTMLElement;
		const button = target.closest("button[data-action]") as HTMLButtonElement | null;

		if (!button) {
			return;
		}

		const item = button.closest(".cart-item") as HTMLElement | null;

		if (!item) {
			return;
		}

		const productId = Number(item.dataset.productId);

		if (!Number.isFinite(productId)) {
			return;
		}

		const action = button.dataset.action;
		const current = getCart().find((cartItem) => cartItem.product.id === productId);

		if (!current) {
			return;
		}

		if (action === "increase") {
			if (current.quantity >= current.product.stock) {
				alertify.warning("No puedes superar el stock disponible");
				return;
			}

			updateProductQuantity(productId, current.quantity + 1);
			renderCart();
			return;
		}

		if (action === "decrease") {
			updateProductQuantity(productId, current.quantity - 1);
			renderCart();
			return;
		}

		if (action === "remove") {
			openConfirm("¿Seguro que deseas eliminar este producto?", () => {
				removeProductFromCart(productId);
				renderCart();
				alertify.success("Producto eliminado del carrito");
			});
		}
	});

	modalConfirm?.addEventListener("click", () => {
		if (confirmAction) {
			confirmAction();
		}

		closeConfirm();
	});

	modalCancel?.addEventListener("click", closeConfirm);
	modalClose?.addEventListener("click", closeConfirm);

	confirmModal?.addEventListener("click", (event) => {
		if (event.target === confirmModal) {
			closeConfirm();
		}
	});
}

renderCart();
setupEvents();
