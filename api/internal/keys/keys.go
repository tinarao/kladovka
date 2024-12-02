package keys

import (
	"crypto"
	"crypto/md5"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"fmt"
	"log/slog"
)

type ApiKey struct {
	PrivateKey []byte
	PublicKey  []byte
}

func GetKeys() (*ApiKey, error) {
	key, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return nil, fmt.Errorf("failed to generate keys: %s", err)
	}

	marshalPrivateKey := x509.MarshalPKCS1PrivateKey(key)
	marshalPublicKey := x509.MarshalPKCS1PublicKey(&key.PublicKey)

	return &ApiKey{PublicKey: marshalPublicKey, PrivateKey: marshalPrivateKey}, nil
}

func Encrypt(payload string, publicKey *[]byte) ([]byte, error) {
	pk, err := x509.ParsePKCS1PublicKey(*publicKey)
	if err != nil {
		slog.Error("invalid public key provided", err)
		return nil, err
	}

	encBytes, err := rsa.EncryptOAEP(md5.New(), rand.Reader, pk, []byte(payload), nil)
	if err != nil {
		return nil, fmt.Errorf("failed to encrypt bytes: %s", err)
	}

	return encBytes, nil
}

func Decrypt(payload []byte, privateKey *[]byte) ([]byte, error) {
	pk, err := x509.ParsePKCS1PrivateKey(*privateKey)
	if err != nil {
		return nil, fmt.Errorf("invalid private key provided: %s", err)
	}

	decrypted, err := pk.Decrypt(nil, payload, &rsa.OAEPOptions{Hash: crypto.MD5})
	if err != nil {
		return nil, fmt.Errorf("failed to decrypt")
	}

	return decrypted, nil
}

func MarshalRSA(key []byte) (b64 string) {
	return base64.StdEncoding.EncodeToString(key)
}

func UnmarshalRSA(b64 string) (key []byte, err error) {
	return base64.StdEncoding.DecodeString(b64)
}
