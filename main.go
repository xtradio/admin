package main

import (
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

// SongDetails to output details of the songs to json
type SongDetails struct {
	ID       int64  `json:"id"`
	Title    string `json:"title"`
	Artist   string `json:"artist"`
	Show     string `json:"show"`
	Image    string `json:"image"`
	Filename string `json:"filename"`
	Album    string `json:"album"`
	Length   string `json:"lenght"`
	Share    string `json:"share"`
	URL      string `json:"url"`
	Playlist string `json:"playlist"`
}

func init() {
	db, err := dbConnection()
	if err != nil {
		log.Println("Connection to database failed: ", err)
		return
	}

	err = generatePlaylist(db)
	if err != nil {
		log.Println("Error updating the playlist ", err)
	}
}

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "XTRadio Admin.")
	log.Println(r.RemoteAddr, r.Method, r.URL)
}

func publishAPI() {
	apiRouter := mux.NewRouter().StrictSlash(true)
	// apiRouter.PathPrefix("/static").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	// apiRouter.HandleFunc("/", homePage)
	apiRouter.HandleFunc("/search", songSearch)
	apiRouter.HandleFunc("/v1/song/list", songList).
		Methods("GET")
	apiRouter.HandleFunc("/v1/song/upload", songUpload).
		Methods("POST")
	apiRouter.HandleFunc("/v1/song/update", songUpdate).
		Methods("POST")
	apiRouter.
		PathPrefix("/").
		Handler(http.StripPrefix("/", http.FileServer(http.Dir("./static"))))

	log.Fatal(http.ListenAndServe(":10000", apiRouter))
}

func main() {
	log.Println("Rest API v2.0 - Mux Routers")
	publishAPI()
}
