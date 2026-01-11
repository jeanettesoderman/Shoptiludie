/**
 * ShoppingCart: Hanterar kundvagnen (visar innehåll, låter användaren ändra antal, ta bort produkter etc.)
 *
 * Lyssnar på:
 * 1. 'cart-updated' - för att uppdatera vyn när kundvagnen ändras
 * 2. 'added-to-cart' - för att visa en notis när en produkt läggs till
 *
 * När en användare:
 * - Ändrar antal: Uppdaterar CART som skickar 'cart-updated'-event
 * - Tar bort en produkt: Uppdaterar CART som skickar 'cart-updated'-event
 */
class ShoppingCart extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        // Vänta på att templaten ska laddas
        await compileTemplates();

        // Lyssnar på när kundvagnen uppdateras
        document.addEventListener('cart-updated', e => this.render(e.detail.cart));

        // Lyssnar på när en produkt läggs till för att visa en notis
        document.addEventListener('added-to-cart', e => {
            const toast = document.createElement('div');
            toast.className = 'position-fixed top-0 end-0 p-3';
            toast.style.zIndex = 1000;
            toast.innerHTML = `
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header bg-success text-white">
                        <strong class="me-auto">Produkt tillagd</strong>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Stäng"></button>
                    </div>
                    <div class="toast-body">
                        ${e.detail.product.title} (x${e.detail.qty}) är tillagd i kundkorgen!
                    </div>
                </div>
            `;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        });

        this.render(CART.getCartSummary());
    }

    render(cart) {
        const items = (cart.items || []).map(i => ({ ...i, total: i.price * i.qty }));
        this.innerHTML = window.TEMPLATES.cart({ items, grandTotal: cart.grandTotal || 0 });
        this._bindEvents();
    }

    _bindEvents() {
        // Ta bort-produkt-knappar
        this.querySelectorAll('.btn-remove').forEach(b => {
            b.addEventListener('click', () => {
                CART.removeItem(Number(b.dataset.id)); // Detta kommer att skicka 'cart-updated'-event
            });
        });

        // Öka antal-knappar
        this.querySelectorAll('.btn-increase').forEach(b => {
            b.addEventListener('click', () => {
                CART.changeQty(Number(b.dataset.id), 1); // Detta kommer att skicka 'cart-updated'-event
            });
        });

        // Minska antal-knappar
        this.querySelectorAll('.btn-decrease').forEach(b => {
            b.addEventListener('click', () => {
                CART.changeQty(Number(b.dataset.id), -1); // Detta kommer att skicka 'cart-updated'-event
            });
        });
    }
}

customElements.define('shopping-cart', ShoppingCart);
