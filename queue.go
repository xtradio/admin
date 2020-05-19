package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func songQueue(w http.ResponseWriter, r *http.Request) {
	type httpResponse struct {
		Response string `json:"response"`
		Reason   string `json:"reason"`
	}

	var h httpResponse

	err := queueSong(r.FormValue("artist"), r.FormValue("title"), r.FormValue("length"), r.FormValue("share"), "", r.FormValue("filename"))

	if err != nil {
		log.Println("Error queuing song", err)
		h.Reason = fmt.Sprintf("Failed to queue song %s", err)
		h.Response = "fail"
	}

	h.Response = "ok"
	h.Reason = fmt.Sprintf("Queued song %s - %s", r.FormValue("artist"), r.FormValue("title"))

	json.NewEncoder(w).Encode(h)
}
