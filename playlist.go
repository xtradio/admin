package main

import (
	"database/sql"
	"fmt"
	"os"
)

func generatePlaylist(db *sql.DB) error {

	filename, err := getEnv("PLAYLIST_FILE_LOCATION")
	if err != nil {
		return err
	}

	tx, err := db.Begin()
	if err != nil {
		return err
	}

	defer func() {
		switch err {
		case nil:
			err = tx.Commit()
		default:
			tx.Rollback()
		}
	}()

	f, err := os.Create(filename)
	if err != nil {
		return err
	}

	rows, err := tx.Query("SELECT id, filename, artist, title, lenght, share, image FROM details WHERE playlist=? ORDER BY id DESC", "daily")
	if err != nil {
		return err
	}

	for rows.Next() {
		var s SongDetails

		err := rows.Scan(&s.ID, &s.Filename, &s.Artist, &s.Title, &s.Length, &s.Share, &s.Image)

		annotation := annotate(s.Artist, s.Title, s.Length, s.Share, s.Filename, s.Image)
		fmt.Fprintln(f, annotation)
		// fmt.Println(s.ID, s.Filename, s.Artist, s.Title, s.Length, s.Share)

		if err != nil {
			fmt.Println("Fetching item failed.", err)
			return err
		}

	}

	err = f.Close()
	if err != nil {
		return err
	}
	defer rows.Close()
	return nil
}
