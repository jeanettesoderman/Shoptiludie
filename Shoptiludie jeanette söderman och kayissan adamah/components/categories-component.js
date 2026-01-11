/**
 * CategoriesComponent: Visar en lista över produktkategorier.
 *
 * När en användare klickar på "Visa"-knappen för en kategori:
 * 1. Skickar ett 'selected-category'-event med kategorinamnet
 * 2. ProductsComponent lyssnar på detta event och visar produkter för den valda kategorin
 */

class CategoriesComponent extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        // Vänta på att templaten ska laddas
        await compileTemplates();

        try {
            const categories = await API.getCategories();
            if (categories.length > 0) {
                this.innerHTML = window.TEMPLATES.categories({ categories });
                this.querySelectorAll('.btn-select').forEach(btn => {
                    btn.addEventListener('click', () => {
                        // Skickar event när en kategori väljs
                        // Data som skickas: { detail: { category: "kategorinamn" } }
                        document.dispatchEvent(new CustomEvent('selected-category', {
                            detail: { category: btn.dataset.category }
                        }));
                    });
                });

                // Välj den första kategorin automatiskt när sidan laddas
                setTimeout(() => {
                    this.querySelector('.btn-select')?.click();
                }, 100);
            } else {
                this.innerHTML = '<div class="alert alert-warning">Kunde inte ladda kategorier. Försök igen senare.</div>';
            }
        } catch (error) {
            console.error("Fel vid laddning av kategorier:", error);
            this.innerHTML = '<div class="alert alert-danger">Ett fel uppstod vid laddning av kategorier.</div>';
        }
    }
}

customElements.define('categories-component', CategoriesComponent);
