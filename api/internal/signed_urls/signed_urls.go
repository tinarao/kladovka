package signed_urls

import (
	"fmt"
	"kladovka-api/db"
	"log/slog"
	"time"

	"github.com/go-co-op/gocron/v2"
	gonanoid "github.com/matoous/go-nanoid/v2"
)

func Create(fileId uint) (url *string, err error) {
	i, _ := gonanoid.New(8)

	su := db.SignedUrl{
		Alias:  i,
		FileId: fileId,
	}

	dbr := db.Client.Create(&su)
	if dbr.Error != nil {
		return nil, err
	}

	go PlanDeleteJob(su.ID)

	return &su.Alias, nil
}

func PlanDeleteJob(signedUrlId uint) error {
	s, err := gocron.NewScheduler()
	if err != nil {
		return err
	}

	interval := time.Minute * 30

	_, err = s.NewJob(
		gocron.DurationJob(
			interval,
		),
		gocron.NewTask(
			func(suId uint) {
				dbr := db.Client.Model(&db.SignedUrl{}).Delete(suId)
				if dbr.Error != nil {
					slog.Error("failed to delete signed url record", dbr.Error)
					return
				}

				fmt.Printf("deleted a signed url with id = %d", signedUrlId)
			},
			signedUrlId,
		),
	)
	if err != nil {
		return err
	}

	s.Start()
	select {
	case <-time.After(interval):
	}

	err = s.Shutdown()
	if err != nil {
		return err
	}

	return nil
}
