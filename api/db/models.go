package db

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Projects  []Project      `json:"projects" gorm:"foreignKey:CreatorId"`
	LatestIP  *string        `json:"latestIp"`
	FirstName string         `json:"firstName"`
	LastName  string         `json:"lastName"`
	Email     string         `json:"email" gorm:"uniqueIndex"`
	Password  string         `json:"-"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"deletedAt" gorm:"index"`
}

type Project struct {
	ID        uint   `json:"id" gorm:"primaryKey"`
	CreatorId uint   `json:"creatorId"`
	Name      string `json:"name"`
	Files     []File `json:"files" gorm:"foreignKey:ProjectId"`
}

type File struct {
	ID        uint `json:"id" gorm:"primaryKey"`
	ProjectId uint `json:"projectId"`
}
