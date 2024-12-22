package main

import (
	"kladovka-api/db"
	"kladovka-api/internal/validator"
	"kladovka-api/middleware"
	"kladovka-api/modules/auth"
	"kladovka-api/modules/files"
	"kladovka-api/modules/projects"
	"kladovka-api/modules/tokens"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	validator.Init()
	db.Connect()

	r := gin.Default()

	api := r.Group("/api")
	api.GET("/signed/:alias", files.HandleSignedUrlVisit)

	a := api.Group("/auth")

	u := api.Group("/u", middleware.Token)
	u.GET("/url/:id", files.GetSignedUrl)
	u.POST("/upload", files.Upload)

	v := api.Group("/v", middleware.AuthMiddleware)

	a.GET("/verify", auth.Verify)
	a.POST("/login", auth.Login)
	a.POST("/register", auth.Register)

	// Products
	p := v.Group("/projects")
	p.GET("/", projects.GetMyProjects)
	p.GET("/:id", projects.GetProjectById)
	p.POST("/", projects.Create)

	t := v.Group("/tokens")
	t.GET("/:id", tokens.GetProjectTokens)

	r.Run()
}
