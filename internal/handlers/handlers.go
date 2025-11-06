package handlers

import (
	"database/sql"
	"log"
	"net/http"
	"sabanci_pharmacy/internal/config"
)

type Handler struct {
	DB     *sql.DB
	Config config.Config
	Logger *log.Logger
}

func NewHandler(DB *sql.DB, Config config.Config) *Handler {
	return &Handler{
		DB:     DB,
		Config: Config,
	}
}

func (h *Handler) HelloAPIHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"message": "Hello World!"}`))
}

func (h *Handler) HomePageHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./ui/html/index.html")
}
