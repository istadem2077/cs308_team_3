package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"

	"sabanci_pharmacy/internal/config"
	"sabanci_pharmacy/internal/handlers"
	"sabanci_pharmacy/internal/models"
)

type Application struct {
	Config config.Config
	DB     *sql.DB
}

func main() {
	cfg := config.Load()

	db, err := models.OpenDB(cfg.DB)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	fmt.Println("Connected to DB")

	app := &Application{
		Config: cfg,
		DB:     db,
	}

	handler := handlers.NewHandler(app.DB, app.Config)

	router := handler.Routes()

	port := fmt.Sprintf(":%s", cfg.Port)
	fmt.Printf("Listening on port %s\n", port)

	if err := http.ListenAndServe(port, router); err != nil {
		log.Fatal(err)
	}
}
