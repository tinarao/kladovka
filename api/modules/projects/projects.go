package projects

import (
	"errors"
	"kladovka-api/db"
	"kladovka-api/internal/keys"
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

func GetProjectById(c *gin.Context) {
	id := c.Param("id")
	uctx, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Ошибка авторизации. Войдите в аккаунт и попробуйте ещё раз"})
		return
	}

	u := uctx.(*db.User)
	project := &db.Project{}
	r := db.Client.Where("id = ?", id).First(&project)
	if r.Error != nil {
		if errors.Is(r.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"message": "Проект не найден"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"message": "Возникла внутренняя ошибка сервера"})
		return
	}

	var fc int64 = 0
	db.Client.Model(&db.File{}).Where("project_id = ?", id).Count(&fc)

	if project.CreatorId != u.ID {
		c.JSON(http.StatusForbidden, gin.H{"message": "Доступ запрещён"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"project": project, "filesCount": fc})
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

	k, err := keys.GetKeys()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Ошибка при создании проекта"})
		return
	}

	token, err := keys.Encrypt(u.Email, &k.PublicKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Ошибка при создании проекта"})
		return
	}

	p := &db.Project{
		Name:       dto.Name,
		CreatorId:  u.ID,
		PublicKey:  string(k.PublicKey),
		PrivateKey: string(k.PrivateKey),
		Token:      string(token),
	}
	if err := db.Client.Create(&p).Error; err != nil {
		slog.Error("failed to create project", err)

		c.JSON(http.StatusBadRequest, gin.H{"message": "Ошибка при создании проекта", "error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Новый проект успешно создан!"})
	return
}
