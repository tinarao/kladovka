package main

import (
	"kladovka-api/db"
	"kladovka-api/internal/validator"
	"kladovka-api/middleware"
	"kladovka-api/modules/auth"
	"kladovka-api/modules/projects"

	"github.com/gin-gonic/gin"
)

func main() {
	validator.Init()
	db.Connect()

	r := gin.Default()

	api := r.Group("/api")
	a := api.Group("/auth")
	v := api.Group("/v", middleware.AuthMiddleware)

	a.GET("/verify", auth.Verify)
	a.POST("/login", auth.Login)
	a.POST("/register", auth.Register)

	v.GET("/projects", projects.GetMyProjects)
	v.GET("/projects/:id")

	r.Run()
}
