package models

import (
	"database/sql"
	"time"

	_ "github.com/go-sql-driver/mysql"

	"sabanci_pharmacy/internal/config"
)

func OpenDB(dbConfig config.DBConfig) (*sql.DB, error) {
	db, err := sql.Open("mysql", dbConfig.DSN)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(dbConfig.MaxOpenConns)
	db.SetMaxIdleConns(dbConfig.MaxIdleConns)
	db.SetConnMaxLifetime(5 * time.Minute)

	if err := db.Ping(); err != nil {
		return nil, err
	}
	return db, nil
}
