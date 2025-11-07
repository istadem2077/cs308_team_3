package main

import (
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
	Models models.Models
}

type modelWrapper struct {
	Users      models.UserModel
	Orders     models.OrderModel
	OrderItems models.OrderItemModel
	Products   models.ProductModel
	Reviews    models.ReviewModel
	Categories models.CategoryModel
}

func main() {
	cfg := config.Load()

	db, err := models.OpenDB(cfg.DB)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	fmt.Println("Connected to DB")

	appModels := models.NewModels(db)

	app := &Application{
		Config: cfg,
		Models: appModels,
	}

	handler := handlers.NewHandler(app.Models)

	router := handler.Routes()

	port := fmt.Sprintf(":%s", cfg.Port)
	fmt.Printf("Listening on port %s\n", port)

	if err := http.ListenAndServe(port, router); err != nil {
		log.Fatal(err)
	}
}
