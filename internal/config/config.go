package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv string
	Port   string
	DB     DBConfig
}

type DBConfig struct {
	DSN          string
	MaxOpenConns int
	MaxIdleConns int
}

func Load() Config {
	godotenv.Load(".env")

	maxOpenConns, err := strconv.Atoi(getEnv("DB_MAX_OPEN_CONNS", "25"))
	if err != nil {
		log.Fatal("Invalid DB_MAX_OPEN_CONNS: %v", err)
	}

	maxIdleConns, err := strconv.Atoi(getEnv("DB_MAX_IDLE_CONNS", "25"))
	if err != nil {
		log.Fatal("Invalid DB_MAX_IDLE_CONNS: %v", err)
	}

	return Config{
		AppEnv: getEnv("APP_ENV", "development"),
		Port:   getEnv("PORT", "8080"),
		DB: DBConfig{
			DSN:          getEnv("DB_DSN", "localhost"),
			MaxOpenConns: maxOpenConns,
			MaxIdleConns: maxIdleConns,
		},
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
