package handlers

import "net/http"

func (h *Handler) Routes() http.Handler {
	mux := http.NewServeMux()

	fileServer := http.FileServer(http.Dir("./ui/static/"))
	mux.Handle("/static/", http.StripPrefix("/static/", fileServer))

	//Testing Handles
	mux.HandleFunc("/", h.HomePageHandler)
	mux.HandleFunc("/api/hello", h.HelloAPIHandler)
	mux.HandleFunc("/api/users/{id}", h.UsersHandler)

	// Products End-Points
	mux.HandleFunc("/api/products/", h.ProductsHandler)
	mux.HandleFunc("/api/products/{id}", h.ProductsHandler)

	return mux
}
