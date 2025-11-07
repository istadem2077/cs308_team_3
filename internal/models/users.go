package models

import (
	"database/sql"
)

type User struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Address  string `json:"address"`
	Password string `json:"password"`
}

type UserModel struct {
	DB *sql.DB
}

func (UserModel *UserModel) GetUserByID(id int) (*User, error) {
	stmt := `SELECT id, name, email, address FROM db_308.users WHERE id = ?`

	row := UserModel.DB.QueryRow(stmt, id)

	user := &User{}

	err := row.Scan(&user.Id, &user.Name, &user.Email, &user.Address)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, err
	}
	return user, nil
}

func (UserModel *UserModel) GetUserByEmail(email string) (*User, error) {
	stmt := `SELECT id, name, email, address FROM db_308.users WHERE email = ?`

	row := UserModel.DB.QueryRow(stmt, email)

	user := &User{}

	err := row.Scan(&user.Id, &user.Name, &user.Email, &user.Address)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, err
	}
	return user, nil
}
