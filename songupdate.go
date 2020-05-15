package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func songUpdate(w http.ResponseWriter, r *http.Request) {

	type httpResponse struct {
		Response string `json:"response"`
		Reason   string `json:"reason"`
	}

	var h httpResponse
	var err error

	db, err := dbConnection()
	if err != nil {
		log.Println("Connection to database failed: ", err)
	}

	err = updateSong(db, r.FormValue("id"), r.FormValue("artist"), r.FormValue("title"), r.FormValue("share"), r.FormValue("image"), r.FormValue("playlist"))
	if err != nil {
		log.Printf("Update failed: %s", err)
		h.Response = "fail"
		h.Reason = fmt.Sprintf("Failed to update db: %s", err)
		json.NewEncoder(w).Encode(h)
		return
	}

	h.Response = "success"
	h.Reason = fmt.Sprintf("Updated field with ID %s", r.FormValue("id"))

	err = generatePlaylist(db)
	if err != nil {
		log.Println("Error updating the playlist ", err)
	}

	json.NewEncoder(w).Encode(h)
	return
}

func updateSong(db *sql.DB, id string, artist string, title string, share string, image string, playlist string) error {
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

	if _, err = tx.Exec("UPDATE details SET artist = ?, title = ?, share = ?, image = ?, playlist = ? WHERE id = ?", artist, title, share, image, playlist, id); err != nil {
		return err
	}

	return nil
}
