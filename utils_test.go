package main

import (
	"os"
	"testing"
)

func TestGetEnvTrue(t *testing.T) {
	testEnvVarValue := "testing"
	testEnvVarKey := "TEST_ENV"
	os.Setenv(testEnvVarKey, testEnvVarValue)

	returnEnv, err := getEnv(testEnvVarKey)

	if returnEnv != testEnvVarValue {
		t.Errorf("Return was incorect, got: %s, want: %s", returnEnv, testEnvVarValue)
	}

	if err != nil {
		t.Errorf("Error was returned: %s", err)
	}
}

func TestGetEnvFalse(t *testing.T) {
	testReturn, _ := getEnv("testing")

	if testReturn != "" {
		t.Error("Value returned, we expected an error")
	}

}

func TestAnnotate(t *testing.T) {
	testArtist := "foo"
	testTitle := "bar"
	testURL := "http://foo.bar"
	testLength := "300.03"
	testFilename := "/path/to/foo/bar.mp3"

	getData := annotate(testArtist, testTitle, testLength, testURL, testFilename)

	if getData == "" {
		t.Errorf("Expected annotation got empty string.")
	}
}
