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

	image, err := sendToCDN(r.FormValue("image"))
	if err != nil {
		log.Printf("Failed to send image to CDN: %s", err)
		h.Response = "fail"
		h.Reason = fmt.Sprintf("Failed to update db: %s", err)
		json.NewEncoder(w).Encode(h)
		return
	}

	err = songUpdateDbCall(db, r.FormValue("filename"), r.FormValue("artist"), r.FormValue("title"), r.FormValue("url"), image)
	if err != nil {
		log.Printf("Update failed: %s", err)
		h.Response = "fail"
		h.Reason = fmt.Sprintf("Failed to update db: %s", err)
		json.NewEncoder(w).Encode(h)
		return
	}

	h.Response = "success"
	h.Reason = fmt.Sprintf("Updated field %s", r.FormValue("filename"))

	err = generatePlaylist(db)
	if err != nil {
		log.Println("Error updating the playlist ", err)
	}

	json.NewEncoder(w).Encode(h)
	return
}

func songUpdateDbCall(db *sql.DB, filename string, artist string, title string, share string, image string) error {
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

	if _, err = tx.Exec("UPDATE details SET artist = ?, title = ?, share = ?, image = ? WHERE filename = ?", artist, title, share, image, filename); err != nil {
		return err
	}

	return nil
}
