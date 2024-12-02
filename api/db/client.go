package db

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var Client *gorm.DB

func Connect() {
	db, err := gorm.Open(sqlite.Open("database.db"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		log.Fatalf("failed to establish db connection: %s", err)
	}

	if err = db.AutoMigrate(
		&User{},
		&Project{},
		&File{},
	); err != nil {
		log.Fatalf("failed to run automigrations: %s", err)
	}

	Client = db
}
