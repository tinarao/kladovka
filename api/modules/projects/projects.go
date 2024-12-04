package projects

import (
	"errors"
	"kladovka-api/db"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetMyProjects(c *gin.Context) {
	uctx, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Ошибка авторизации. Войдите в аккаунт и попробуйте ещё раз"})
		return
	}

	u := uctx.(*db.User)

	projects := make([]db.Project, 0)

	err := db.Client.Model(&db.User{}).Where("id = ?", u.ID).Association("Projects").Find(&projects)
	if err != nil && !(errors.Is(err, gorm.ErrRecordNotFound)) {
		slog.Error("failed to recieve projects list", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Ошибка при получении списка проектов"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"projects": projects})
	return
}
