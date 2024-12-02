package auth

import (
	"errors"
	"kladovka-api/db"
	"kladovka-api/internal/validator"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type loginDTO struct {
	Email    string `json:"email" validate:"email,required"`
	Password string `json:"password" validate:"min=10,max=32,required"`
}

type registerDTO struct {
	Email     string `json:"email" validate:"email,required"`
	Password  string `json:"password" validate:"min=10,max=32,required"`
	FirstName string `json:"firstName" validate:"min=1,max=32,required"`
	LastName  string `json:"lastName" validate:"min=1,max=32,required"`
}

func Login(c *gin.Context) {
	dto := &loginDTO{}
	if err := c.ShouldBindJSON(dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "required data is not provided"})
		return
	}

	err := validator.Validate.Struct(dto)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "validation failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ok", "email": dto.Email})
	return
}

func Register(c *gin.Context) {
	dto := &registerDTO{}
	if err := c.ShouldBindJSON(dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "required data is not provided"})
		return
	}

	err := validator.Validate.Struct(dto)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "validation failed"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		slog.Error("failed to generate password hash", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal error",
			"details": "Failed to hash",
		})

	}

	user := &db.User{
		FirstName: dto.FirstName,
		Email:     dto.Email,
		LastName:  dto.LastName,
		Password:  string(hash),
	}

	r := db.Client.Create(user)
	if r.Error != nil {
		if errors.Is(gorm.ErrDuplicatedKey, r.Error) {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Пользователь с такими данными уже существует"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed"})
	}

	c.JSON(http.StatusCreated, gin.H{"message": "ok"})
	return
}
