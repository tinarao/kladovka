package middleware

import (
	"errors"
	"kladovka-api/db"
	"kladovka-api/internal/keys"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Token(c *gin.Context) {
	token := c.GetHeader("kl_token")
	publicKey := c.GetHeader("kl_key")
	if token == "" || publicKey == "" {
		c.Status(http.StatusUnauthorized)
		c.Abort()
		return
	}

	project := &db.Project{}
	r := db.Client.Where("public_key = ?", publicKey).First(&project)
	if r.Error != nil {
		if errors.Is(r.Error, gorm.ErrRecordNotFound) {
			c.Status(http.StatusNotFound)
			c.Abort()
			return
		}

		c.Status(http.StatusInternalServerError)
		c.Abort()
		return
	}

	creator := db.User{}
	r = db.Client.Where("id = ?", project.CreatorId).First(&creator)
	if r.Error != nil {
		if errors.Is(r.Error, gorm.ErrRecordNotFound) {
			c.Status(http.StatusNotFound)
			c.Abort()
			return
		}

		c.Status(http.StatusInternalServerError)
		c.Abort()
		return
	}

	tokenBytes, err := keys.UnmarshalRSA(token)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Invalid token provided",
		})
		return
	}
	privateKeyBytes, err := keys.UnmarshalRSA(project.PrivateKey)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Invalid token provided",
		})
		return
	}

	email, err := keys.Decrypt(tokenBytes, &privateKeyBytes)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Invalid token provided",
		})
		return
	}

	if creator.Email != string(email) {
		// Излишне уже, но пусть будет
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"message": "Доступ запрещён",
		})
		return
	}

	c.Set("project", project)
	c.Next()
}
