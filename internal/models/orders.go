package models

import "database/sql"

type Order struct {
	Id        int    `json:"id"`
	UserId    int    `json:"user_id"`
	Status    string `json:"status"`
	CreatedAt string `json:"created_at"`
}

type OrderModel struct {
	DB *sql.DB
}

func (om *OrderModel) GetOrderByID() (*Order, error)  {}
func (om *OrderModel) GetAllOrders() ([]Order, error) {}
