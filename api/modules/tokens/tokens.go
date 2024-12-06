package tokens

import (
	"kladovka-api/db"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetProjectTokens(c *gin.Context) {
	projId := c.Param("id")
	uctx, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Ошибка авторизации. Войдите в аккаунт и попробуйте ещё раз"})
		return
	}

	u := uctx.(*db.User)

	project := &db.Project{}
	dbr := db.Client.Where("id = ?", projId).First(&project)
	if dbr.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Проект не найден"})
		return
	}

	if project.CreatorId != u.ID {
		c.JSON(http.StatusForbidden, gin.H{"message": "Доступ запрещён"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": project.Token})
	return
}
