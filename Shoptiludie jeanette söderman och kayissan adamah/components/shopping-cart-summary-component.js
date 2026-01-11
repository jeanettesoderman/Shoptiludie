/**
 * ShoppingCartSummary: Visar en sammanfattning av kundvagnen (antal artiklar och totalpris).
 *
 * Lyssnar på:
 * 1. 'cart-updated', för att uppdatera vyn när kundvagnen ändras
 *
 * När en användare klickar på kundvagnsikonen:
 * 1. Öppnar kundvagns-modalen (detta hanteras i huvudfilen)
 */
class ShoppingCartSummary extends HTMLElement {
    constructor() {
        super();
        this.render(CART.getCartSummary());

        // Lyssnar på när kundvagnen uppdateras
        document.addEventListener('cart-updated', e => this.render(e.detail.cart));
    }

    render(cart) {
        const totalItems = cart.totalItems || 0;
        const grand = cart.grandTotal || 0;
        this.innerHTML = `
            <div class="d-flex align-items-center">
                <button class="btn btn-outline-primary position-relative" id="openCartBtn" aria-label="Öppna kundvagn">
                    🛒 <span class="badge bg-primary rounded-pill cart-badge">${totalItems}</span>
                    <span class="sr-only">Varukorg, ${totalItems} artiklar</span>
                </button>
                <div class="ms-2 text-end small">
                    <div class="text-muted">Varukorg</div>
                    <div class="fw-bold">${new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(grand)}</div>
                </div>
            </div>`;

        // Öppnar kundvagnsmodalen när knappen klickas
        this.querySelector('#openCartBtn')?.addEventListener('click', () => {
            openCartModal(); // Denna funktion finns i huvudfilen
        });
    }
}

customElements.define('shopping-cart-summary', ShoppingCartSummary);
