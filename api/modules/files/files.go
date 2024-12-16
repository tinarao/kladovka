package files

import (
	"fmt"
	"io"
	"kladovka-api/db"
	"kladovka-api/internal/validator"
	"log/slog"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

type uploadDto struct {
	File      multipart.FileHeader `form:"file" json:"file" validate:"required"`
	Name      string               `form:"name" json:"name" validate:"required"`
	ProjectId uint                 `form:"projectId" json:"projectId" validate:"required"`
}

func Upload(c *gin.Context) {
	pctx, exists := c.Get("project")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Ошибка авторизации. Войдите в аккаунт и попробуйте ещё раз"})
		return
	}

	p := pctx.(*db.Project)

	c.Header("Access-Control-Allow-Origin", "*")
	f := &uploadDto{}
	if err := c.Bind(&f); err != nil {
		fmt.Printf("failed to bind formdata value: %s", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"message": "Некорректные данные"})
		return
	}

	err := validator.Validate.Struct(f)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Некорректные данные"})
		return
	}

	fi, err := f.File.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Внутренняя ошибка сервера при работе с файлом"})
		return
	}
	defer fi.Close()

	var fs float64 = float64(f.File.Size) / 1024.0 / 1024.0
	filesize, _ := strconv.ParseFloat(fmt.Sprintf("%.2f", fs), 64)

	limitMb, _ := strconv.ParseFloat(os.Getenv("FILE_SIZE_LIMIT_MB"), 32)
	if filesize > limitMb {
		c.JSON(http.StatusRequestEntityTooLarge, gin.H{"message": "Файл превышает максимальный размер"})
		return
	}

	cwd, _ := os.Getwd()
	uploadpath := filepath.Join(cwd, "uploads", fmt.Sprint(f.ProjectId))
	if _, err := os.Stat(uploadpath); os.IsNotExist(err) {
		os.MkdirAll(uploadpath, os.ModePerm)
	}
	path := filepath.Join(uploadpath, f.File.Filename)

	file := &db.File{
		Name:      f.File.Filename,
		Location:  path,
		Mb:        filesize,
		ProjectId: p.ID,
	}
	r := db.Client.Create(&file)
	if r.Error != nil {
		slog.Error(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Не удалось сохранить файл. Попробуйте ещё раз"})
		return
	}

	dst, err := os.Create(filepath.FromSlash(path))
	if _, err := io.Copy(dst, fi); err != nil {
		slog.Error(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Не удалось сохранить файл. Попробуйте ещё раз"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"limit": limitMb, "form": f, "size": filesize})
	return
}
