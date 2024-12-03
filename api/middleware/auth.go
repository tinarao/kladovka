package middleware

import (
	"kladovka-api/db"
	"kladovka-api/internal/jwtoken"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(c *gin.Context) {
	tok, err := c.Cookie("access_token")
	if err != nil {
		c.Status(http.StatusUnauthorized)
		c.Abort()
		return
	}

	user := &db.User{}
	email, err := jwtoken.DecodeJwtToken(tok)
	r := db.Client.Where("email = ?", email).First(&user)
	if r.Error != nil {
		c.Status(http.StatusUnauthorized)
		c.Abort()
		return
	}

	c.Set("user", user)
	c.Next()
}
