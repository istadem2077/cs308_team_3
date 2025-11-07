package models

import (
	"database/sql"
	"log"
)

type Category struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type CategoryModel struct {
	DB *sql.DB
}

func (CategoryModel *CategoryModel) GetCategoryByID(id int) (*Category, error) {
	stmt := `SELECT id, name FROM db_308.categories WHERE id = ?`

	row := CategoryModel.DB.QueryRow(stmt, id)

	category := &Category{}

	err := row.Scan(&category.Id, &category.Name)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, err
	}
	return category, nil
}
func (CategoryModel *CategoryModel) GetCategoryByName(name string) (*Category, error) {
	stmt := `SELECT id, name FROM db_308.categories WHERE name = ?`

	row := CategoryModel.DB.QueryRow(stmt, name)

	category := &Category{}

	err := row.Scan(&category.Id, &category.Name)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, err
	}
	return category, nil
}
func (CategoryModel *CategoryModel) GetAllCategories() ([]Category, error) {
	stmt := `SELECT id, name FROM db_308.categories`
	rows, err := CategoryModel.DB.Query(stmt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, err
	}
	defer rows.Close()
	categories := make([]Category, 0)
	for rows.Next() {
		category := Category{}
		if err := rows.Scan(&category.Id, &category.Name); err != nil {
			log.Fatal(err)
		}
		categories = append(categories, category)
	}

	if rerr := rows.Close(); rerr != nil {
		log.Fatal(rerr)
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}

	return categories, nil
}
