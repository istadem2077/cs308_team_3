package models

import "database/sql"

type OrderItem struct {
	Id        int     `json:"id"`
	OrderId   int     `json:"order_id"`
	ProductId int     `json:"product_id"`
	Quantity  int     `json:"quantity"`
	UnitPrice float64 `json:"unit_price"`
}

type OrderItemModel struct {
	DB *sql.DB
}
