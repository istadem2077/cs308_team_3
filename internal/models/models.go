package models

import (
	"database/sql"
)

type Models struct {
	Users      UserModel
	Orders     OrderModel
	OrderItems OrderItemModel
	Products   ProductModel
	Reviews    ReviewModel
	Categories CategoryModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Users:      UserModel{db},
		Orders:     OrderModel{db},
		OrderItems: OrderItemModel{db},
		Products:   ProductModel{db},
		Reviews:    ReviewModel{db},
		Categories: CategoryModel{db},
	}
}
