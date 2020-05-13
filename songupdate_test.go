package main

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestUpdateSong(t *testing.T) {
	// Set up test variables
	id := "1"
	artist := "foo"
	title := "bar"
	image := "foo-bar.jpg"
	share := "http://foo.bar/baz"
	playlist := "daily"

	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()

	mock.ExpectBegin()
	mock.ExpectExec("UPDATE details").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectCommit()

	err = updateSong(db, id, artist, title, share, image, playlist)

	if err != nil {
		t.Errorf("Assert failed, was not expecting an error, got %s", err)
	}

	// we make sure that all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}

}
