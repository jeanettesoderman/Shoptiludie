/**
 * ProductsComponent: Visar produkter för vald kategori.
 *
 * Lyssnar på:
 * 1. 'selected-category' - för att visa produkter för vald kategori
 * 2. 'search-products' - för att visa sökresultat
 *
 * När en användare klickar på en produkt eller "Visa mer"-knappen:
 * 1. Skickar ett 'selected-product'-event med produktens ID
 * 2. ProductDetails lyssnar på detta event och visar detaljerad info om produkten
 */
class ProductsComponent extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        // Vänta på att templaten ska laddas
        await compileTemplates();
        this.innerHTML = '<div class="text-muted">Välj en kategori för att se produkter.</div>';

        // Lyssnar på när en kategori väljs
        document.addEventListener('selected-category', async (e) => {
            try {
                const products = await API.getProductsByCategory(e.detail.category);
                this.render(products);
            } catch (error) {
                console.error("Fel vid laddning av produkter:", error);
                this.innerHTML = '<div class="alert alert-danger">Ett fel uppstod vid laddning av produkter.</div>';
            }
        });

        // Lyssnar på sökresultat
        document.addEventListener('search-products', (e) => {
            this.render(e.detail.products);
        });
    }

    render(products) {
        if (products && products.length > 0) {
            this.innerHTML = window.TEMPLATES.products({ products });
            this.addEventListeners();
        } else {
            this.innerHTML = '<div class="text-muted">Inga produkter hittades.</div>';
        }
    }

    addEventListeners() {
        // Lägg till klickhanterare för varje produktkort
        this.querySelectorAll('.card-product').forEach(card => {
            card.addEventListener('click', () => {
                // Skickar event när en produkt väljs (klick på hela kortet)
                document.dispatchEvent(new CustomEvent('selected-product', {
                    detail: { id: Number(card.dataset.id) }
                }));
            });
        });

        // Lägg till klickhanterare för "Visa mer"-knappar
        this.querySelectorAll('.btn-more').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Förhindra att båda hanterarna körs
                // Skickar event när "Visa mer" klickas
                document.dispatchEvent(new CustomEvent('selected-product', {
                    detail: { id: Number(btn.dataset.id) }
                }));
            });
        });
    }
}

customElements.define('products-component', ProductsComponent);
