package models

import (
	"database/sql"
	"log"
)

type Product struct {
	Id          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	ImageUrl    string  `json:"image_url"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
	CategoryId  int     `json:"category_id"`
}

type ProductModel struct {
	DB *sql.DB
}

func (ProductModel *ProductModel) GetAllProducts() ([]Product, error) {

	stmt := `SELECT id, name, description, image_url, quantity, price, category_id FROM db_308.products`
	rows, err := ProductModel.DB.Query(stmt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, err
	}
	defer rows.Close()
	products := make([]Product, 0)
	for rows.Next() {
		product := Product{}
		if err := rows.Scan(&product.Id, &product.Name, &product.Description,
			&product.ImageUrl, &product.Quantity, &product.Price,
			&product.CategoryId); err != nil {
			log.Fatal(err)
		}
		products = append(products, product)
	}

	if rerr := rows.Close(); rerr != nil {
		log.Fatal(rerr)
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}

	return products, nil
}
func (ProductModel *ProductModel) GetProductByID(id int) (*Product, error) {
	stmt := `SELECT id, name, description, image_url, quantity, price, category_id FROM db_308.products WHERE id = ?`

	row := ProductModel.DB.QueryRow(stmt, id)

	product := &Product{}

	err := row.Scan(&product.Id, &product.Name, &product.Description, &product.ImageUrl, &product.Quantity, &product.Price, &product.CategoryId)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, err
	}
	return product, nil
}
