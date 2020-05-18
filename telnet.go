package main

import (
	"bufio"
	"fmt"
	"log"
	"net"
)

func telnet(command string) ([]string, error) {
	var response []string

	liquidsoapHost, err := getEnv("LIQUIDSOAP_HOST")
	if err != nil {
		return response, err
	}
	liquidsoapPort, err := getEnv("LIQUIDSOAP_PORT")
	if err != nil {
		return response, err
	}

	conn, err := net.Dial("tcp", fmt.Sprintf("%s:%s", liquidsoapHost, liquidsoapPort))

	if err != nil {
		log.Printf("Failed to connect to %s:%s, reason: %s", liquidsoapHost, liquidsoapPort, err)
		return response, err
	}
	defer conn.Close()
	// read in input from stdin

	// send to socket
	fmt.Fprintf(conn, command+"\n")
	// listen for reply
	data := bufio.NewScanner(conn)

	for data.Scan() {

		response = append(response, data.Text())

	}

	return response, nil
}
