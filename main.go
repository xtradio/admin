package main

import (
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

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
	apiRouter.
		PathPrefix("/static/").
		Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	log.Fatal(http.ListenAndServe(":10000", apiRouter))
}

func main() {
	log.Println("Rest API v2.0 - Mux Routers")
	publishAPI()
}
