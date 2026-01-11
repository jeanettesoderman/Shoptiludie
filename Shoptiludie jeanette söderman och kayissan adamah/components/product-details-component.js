/**
 * ProductDetails: Visar detaljerad information om en produkt.
 *
 * Lyssnar på:
 * 1. 'selected-product' - för att visa detaljer om vald produkt
 *
 * När en användare klickar på "Lägg i kundvagn":
 * 1. Lägger till produkten i kundvagnen (CART)
 * 2. Skickar INTE något event här - istället skickar CART.addItem() ett 'cart-updated'-event
 */
class ProductDetails {
    constructor() {
        this.drawer = document.getElementById('detailsDrawer');
        this.content = document.getElementById('drawerContent');

        // Lyssnar på när en produkt väljs
        document.addEventListener('selected-product', async (e) => {
            await this.showDetails(e.detail.id);
        });
    }

    async showDetails(id) {
        try {
            const product = await API.getProduct(id);
            if (product) {
                this.content.innerHTML = window.TEMPLATES.productDetails({
                    product: product,
                    reviews: REVIEWS.reviews
                });

                // Hanterare för "Lägg i kundvagn"-knappen
                this.content.querySelector('.btn-add-cart').addEventListener('click', () => {
                    const qty = Number(this.content.querySelector('#qtyInput').value);
                    // Lägger till produkten i kundvagnen - detta kommer att skicka ett 'cart-updated'-event
                    CART.addItem(product, qty);
                    this.drawer.hide(); // Stänger drawer efter att produkten lagts till
                });

                // Hanterare för antal-knappar
                this.content.querySelectorAll('.qty-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const input = this.content.querySelector('#qtyInput');
                        if (btn.classList.contains('btn-minus')) {
                            input.value = Math.max(1, Number(input.value) - 1);
                        } else {
                            input.value = Number(input.value) + 1;
                        }
                    });
                });

                // Hanterare för recensionsformuläret
                this.content.querySelector('#submitReview').addEventListener('click', () => {
                    const user = this.content.querySelector('#reviewUser').value.trim();
                    const rating = this.content.querySelector('#reviewStars').value;
                    const comment = this.content.querySelector('#reviewComment').value.trim();
                    if (user && comment) {
                        REVIEWS.addReview(product.id, user, rating, comment);
                        this.showDetails(id); // Uppdaterar vyn för att visa den nya recensionen
                    } else {
                        alert('Vänligen fyll i ditt namn och din recension!');
                    }
                });

                this.drawer.show(); // Visar drawer med produktdetaljer
            } else {
                this.content.innerHTML = '<div class="alert alert-danger">Kunde inte ladda produktinformation.</div>';
                this.drawer.show();
            }
        } catch (error) {
            console.error("Fel vid hämtning av produkt:", error);
            this.content.innerHTML = '<div class="alert alert-danger">Ett fel uppstod vid laddning av produktinformation.</div>';
            this.drawer.show();
        }
    }
}

const PRODUCT_DETAILS = new ProductDetails();
