package keys

import (
	"testing"
)

func TestMarshal(t *testing.T) {
	email := "yo@ya.ya"
	k, err := GetKeys()
	if err != nil {
		t.Errorf("Failed: %s", err.Error())
	}

	token, err := Encrypt(email, &k.PublicKey)
	if err != nil {
		t.Errorf("Failed: %s", err.Error())
	}

	tokenStr := MarshalRSA(token)
	t.Logf("token: %s", tokenStr)
}
