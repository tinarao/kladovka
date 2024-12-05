package auth

import (
	"errors"
	"kladovka-api/db"
	"kladovka-api/internal/jwtoken"
	"kladovka-api/internal/validator"
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type loginDTO struct {
	Email    string `json:"email" validate:"email,required"`
	Password string `json:"password" validate:"min=8,max=32,required"`
}

type registerDTO struct {
	Email     string `json:"email" validate:"email,required"`
	Password  string `json:"password" validate:"min=8,max=32,required"`
	FirstName string `json:"firstName" validate:"max=64,required"`
	LastName  string `json:"lastName" validate:"max=64,required"`
}

func Login(c *gin.Context) {
	dto := &loginDTO{}
	if err := c.ShouldBindJSON(dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Форма заполнена некорректно"})
		return
	}

	err := validator.Validate.Struct(dto)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Некорректные данные"})
		return
	}

	user := &db.User{}
	r := db.Client.Where("email = ?", dto.Email).First(&user)
	if r.Error != nil {
		if errors.Is(r.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"message": "Пользователь не найден"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"message": "Внутренняя ошибка сервера"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(dto.Password)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Неверный пароль!",
		})
		return
	}

	token, err := jwtoken.GenerateJwtToken(user.Email)
	if err != nil {
		slog.Error("failed to generate token", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Внутренняя ошибка сервера"})
		return
	}

	c.SetCookie("access_token", *token, 0, "/", "localhost", false, true)
	c.JSON(http.StatusOK, gin.H{
		"message": "Авторизация прошла успешно!",
		"user": gin.H{
			"id":        user.ID,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
			"email":     user.Email,
		},
	})
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

	dup := &db.User{}
	dr := db.Client.Where("email = ?", dto.Email).First(&dup)
	if dr.Error == nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Пользователь с такими же данными уже зарегистрирован"})
		return
	}

	user := &db.User{
		Email:     dto.Email,
		FirstName: dto.FirstName,
		LastName:  dto.LastName,
		Password:  string(hash),
	}

	if err := db.Client.Create(user).Error; err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			slog.Debug("err check constraint violated!")
			c.JSON(http.StatusBadRequest, gin.H{"message": "Пользователь с такими данными уже существует!"})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"message": "Внутренняя ошибка сервера"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Вы успешно зарегистрированы!"})
	return
}

func Verify(c *gin.Context) {
	tok, err := c.Cookie("access_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	user := &db.User{}
	email, err := jwtoken.DecodeJwtToken(tok)
	r := db.Client.Where("email = ?", email).First(&user)
	if r.Error != nil {
		c.SetCookie("access_token", "", 1, "", "localhost", false, true)
		c.JSON(http.StatusNotFound, gin.H{"message": "User does not exist!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "ok",
		"user": gin.H{
			"id":        user.ID,
			"firstName": user.FirstName,
			"lastName":  user.LastName,
			"email":     user.Email,
		},
	})
	return
}
