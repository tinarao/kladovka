package projects

import (
	"errors"
	"kladovka-api/db"
	"kladovka-api/internal/validator"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type createProjectDTO struct {
	Name string `json:"name" validate:"min=1,max=32,required"`
}

func GetMyProjects(c *gin.Context) {
	uctx, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Ошибка авторизации. Войдите в аккаунт и попробуйте ещё раз"})
		return
	}

	u := uctx.(*db.User)

	var projects []db.Project

	err := db.Client.Model(&db.User{}).Where("id = ?", u.ID).Association("Projects").Find(&projects)
	if err != nil && !(errors.Is(err, gorm.ErrRecordNotFound)) {
		slog.Error("failed to recieve projects list", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Ошибка при получении списка проектов"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"projects": projects})
	return
}

func Create(c *gin.Context) {
	uctx, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Ошибка авторизации. Войдите в аккаунт и попробуйте ещё раз"})
		return
	}

	u := uctx.(*db.User)

	dto := &createProjectDTO{}
	if err := c.ShouldBindJSON(dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Форма заполнена некорректно"})
		return
	}

	err := validator.Validate.Struct(dto)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Некорректные данные"})
		return
	}

	p := &db.Project{
		Name:       dto.Name,
		CreatorId:  u.ID,
		PublicKey:  "public",
		PrivateKey: "private", // MAKE!
	}
	if err := db.Client.Create(&p).Error; err != nil {
		slog.Error("failed to create project", err)

		c.JSON(http.StatusBadRequest, gin.H{"message": "Ошибка при создании проекта", "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Новый проект успешно создан!"})
	return
}
