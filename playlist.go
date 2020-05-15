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

	rows, err := tx.Query("SELECT id, filename, artist, title, lenght, share FROM details WHERE playlist=? ORDER BY id DESC", "daily")
	if err != nil {
		return err
	}

	for rows.Next() {
		var s SongDetails

		err := rows.Scan(&s.ID, &s.Filename, &s.Artist, &s.Title, &s.Length, &s.Share)
		// annotate:artist="Ivan Jack, Catullux",title="Rapture (Original Mix) [Redisco] (00:00) ",lenght="0":/MUSIC/BACKUP/remix/crayon/Ivan_Jack,_Catullux_-_Rapture_(Original_Mix)_[Redisco].mp3
		annotate := fmt.Sprintf(`annotate:artist="%s",title="%s / %s",lenght="%s":%s`, s.Artist, s.Title, s.Share, s.Length, s.Filename)
		fmt.Fprintln(f, annotate)
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
