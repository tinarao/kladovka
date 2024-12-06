package projects

import (
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
	projects := &[]db.Project{}

	dbr := db.Client.Where("creator_id = ?", u.ID).Find(&projects)
	if dbr.Error != nil && dbr.Error != gorm.ErrRecordNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Возникла ошибка сервера при получении проектов"})
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
