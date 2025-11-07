package models

import "database/sql"

type Category struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type CategoryModel struct {
	DB *sql.DB
}
