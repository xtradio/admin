package main

import (
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

func publishAPI() {
	apiRouter := mux.NewRouter().StrictSlash(true)
	apiRouter.HandleFunc("/search", songSearch)
	apiRouter.HandleFunc("/v1/song/list", songList).
		Methods("GET")
	apiRouter.HandleFunc("/v1/song/upload", songUpload).
		Methods("POST")
	apiRouter.PathPrefix("/").Handler(http.FileServer(http.Dir("./static")))

	log.Fatal(http.ListenAndServe(":10000", apiRouter))
}

func main() {
	log.Println("Rest API v2.0 - Mux Routers")
	publishAPI()
}
