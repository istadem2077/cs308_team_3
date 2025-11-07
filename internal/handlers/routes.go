package handlers

import "net/http"

func (h *Handler) Routes() http.Handler {
	mux := http.NewServeMux()

	fileServer := http.FileServer(http.Dir("./ui/static/"))
	mux.Handle("/static/", http.StripPrefix("/static/", fileServer))

	//Testing Handles
	mux.HandleFunc("/", h.HomePageHandler)
	mux.HandleFunc("/api/users/{id}", h.UsersHandler)

	// Products End-Points
	mux.HandleFunc("/api/products", h.ProductsHandler)
	mux.HandleFunc("/api/products/{id}", h.ProductIDHandler)

	// Cart Handles, these will be implemented during or after sprint 2, because it requires authentication to work.
	mux.HandleFunc("/api/cart/items", h.CartItemsHandler)
	mux.HandleFunc("/api/cart/summary", h.CartSummaryHandler)

	// Categories
	mux.HandleFunc("/api/categories", h.CategoriesHandler)
	mux.HandleFunc("/api/categories/{slug}/products", h.CatProdHandler) // eg /api/categories/vitamins/products

	return mux
}
