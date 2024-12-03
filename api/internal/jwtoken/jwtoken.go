package jwtoken

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJwtToken(adminEmail string) (token *string, error error) {
	claims := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 8)),
		Issuer:    "rms",
		Subject:   adminEmail,
	}

	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	ss, err := tok.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return nil, err
	}

	return &ss, nil
}

func DecodeJwtToken(token string) (sub *string, err error) {
	tok, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}

	if !tok.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	subject, err := tok.Claims.GetSubject()
	if err != nil {
		return nil, err
	}

	return &subject, nil
}
