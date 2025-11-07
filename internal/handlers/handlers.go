package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"sabanci_pharmacy/internal/models"
	"strconv"
)

type Handler struct {
	Models models.Models
}

func NewHandler(m models.Models) *Handler {
	return &Handler{
		Models: m,
	}
}

func (h *Handler) ProductsHandler(w http.ResponseWriter, r *http.Request) {
	products, err := h.Models.Products.GetAllProducts()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		h.errorJSON(w, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	h.writeJSON(w, products)
}
func (h *Handler) ProductIDHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil || id < 1 {
		w.WriteHeader(http.StatusBadRequest)
		h.errorJSON(w, "Invalid User ID")
		return
	}

	product, err := h.Models.Products.GetProductByID(id)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			w.WriteHeader(http.StatusNotFound)
			h.errorJSON(w, "User not found")
		default:
			w.WriteHeader(http.StatusInternalServerError)
			h.errorJSON(w, "Internal server error")
			log.Println(err)
		}
		return
	}

	w.WriteHeader(http.StatusOK)
	h.writeJSON(w, product)
}

func (h *Handler) CartItemsHandler(w http.ResponseWriter, r *http.Request)   {}
func (h *Handler) CartSummaryHandler(w http.ResponseWriter, r *http.Request) {}

func (h *Handler) CategoriesHandler(w http.ResponseWriter, r *http.Request) {}
func (h *Handler) CatProdHandler(w http.ResponseWriter, r *http.Request)    {}

func (h *Handler) HomePageHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./ui/html/index.html")
}

func (h *Handler) UsersHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil || id < 1 {
		w.WriteHeader(http.StatusBadRequest)
		h.errorJSON(w, "Invalid User ID")
	}

	user, err := h.Models.Users.GetUserByID(id)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			w.WriteHeader(http.StatusNotFound)
			h.errorJSON(w, "User not found")
		default:
			w.WriteHeader(http.StatusInternalServerError)
			h.errorJSON(w, "Internal server error")
			log.Println(err)
		}
		return
	}
	w.WriteHeader(http.StatusOK)
	h.writeJSON(w, user)
}

func (h *Handler) writeJSON(w http.ResponseWriter, data any) {
	js, err := json.Marshal(data)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		h.errorJSON(w, "Error marshalling JSON")
		log.Printf("writeJSON: error marshalling JSON: %v", err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)

}
func (h *Handler) errorJSON(w http.ResponseWriter, message string) {
	type jsonErr struct {
		Error string `json:"error"`
	}
	h.writeJSON(w, jsonErr{message})
}
