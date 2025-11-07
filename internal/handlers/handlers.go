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

func (h *Handler) ProductsHandler(w http.ResponseWriter, r *http.Request) {}

func (h *Handler) HelloAPIHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"message": "Hello World!"}`))
}

func (h *Handler) HomePageHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./ui/html/index.html")
}

func (h *Handler) UsersHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil || id < 1 {
		h.errorJSON(w, http.StatusBadRequest, "Invalid User ID")
	}

	user, err := h.Models.Users.GetUserByID(id)
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			h.errorJSON(w, http.StatusNotFound, "User not found")
		default:
			h.errorJSON(w, http.StatusInternalServerError, "Internal server error")
			log.Println(err)
		}
		return
	}
	h.writeJSON(w, http.StatusOK, user)
}

func (h *Handler) writeJSON(w http.ResponseWriter, status int, data any) {
	js, err := json.Marshal(data)
	if err != nil {
		h.errorJSON(w, http.StatusInternalServerError, "Error marshalling JSON")
		log.Printf("writeJSON: error marshalling JSON: %v", err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(js)

}
func (h *Handler) errorJSON(w http.ResponseWriter, status int, message string) {
	type jsonErr struct {
		Error string `json:"error"`
	}
	h.writeJSON(w, status, jsonErr{message})
}
