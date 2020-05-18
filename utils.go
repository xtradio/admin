package main

import (
	"database/sql"
	"fmt"
	"os"
)

func getEnv(envKey string) (envValue string, err error) {

	envValue, ok := os.LookupEnv(envKey)
	if ok != true {
		err = fmt.Errorf("please set %s environment variable", envKey)
		return
	}

	return envValue, nil
}

func dbConnection() (*sql.DB, error) {
	username, err := getEnv("MYSQL_USERNAME")
	if err != nil {
		return nil, err
	}

	password, err := getEnv("MYSQL_PASSWORD")
	if err != nil {
		return nil, err
	}

	host, err := getEnv("MYSQL_HOST")
	if err != nil {
		return nil, err
	}

	database, err := getEnv("MYSQL_DATABASE")
	if err != nil {
		return nil, err
	}

	connection := fmt.Sprintf("%s:%s@tcp(%s:3306)/%s?charset=utf8", username, password, host, database)

	// Open and connect do DB
	db, err := sql.Open("mysql", connection)
	if err != nil {
		return nil, err
	}

	// Open doesn't open a connection. Validate DSN data:
	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}

// annotate:artist="Camila Cabello",title="Havana (Nitsuga Remix) / https://soundcloud.com/nitsuga-3/camila-cabello-havana-ft-young-thug-nitsuga-remix",length="229":/MUSIC/BACKUP/remix/puck/Camila_Cabello_-_Havana_(Nitsuga_Remix).mp3
func annotate(artist string, title string, length string, share string, filename string) string {
	annotation := fmt.Sprintf(`annotate:artist="%s",title="%s / %s",length="%s":%s`, artist, title, share, length, filename)

	return annotation
}
