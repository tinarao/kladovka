package main

import (
	"kladovka-api/internal/validator"
	auth "kladovka-api/modules"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	api := r.Group("/api")
	a := api.Group("/auth")

	validator.Init()
	a.POST("/login", auth.Login)
	a.POST("/register", auth.Register)

	r.Run()
}
