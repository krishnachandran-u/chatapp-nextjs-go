package main

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

type Message struct {
	SenderID   string `json:"sender_id"`
	ReceiverID string `json:"receiver_id"`
	Content    string `json:"content"`
}

var (
	clients  = make(map[string]*websocket.Conn)
	mutex    = sync.Mutex{}
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

func main() {
	http.HandleFunc("/ws", handleConnections)

	log.Println("Server started on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()

	var userID string
	userID = r.URL.Query().Get("userID")
	if userID == "" {
		log.Println("No userID provided. Connection refused.")
		return
	}

	mutex.Lock()
	clients[userID] = ws
	mutex.Unlock()

	log.Printf("User %s connected\n", userID)

	for {
		var msg Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("Error reading JSON message: %v\n", err)
			mutex.Lock()
			delete(clients, userID)
			mutex.Unlock()
			break
		}
		log.Printf("Succesfully read JSON message\n")
		sendMessageToReceiver(msg)
	}
}

func sendMessageToReceiver(msg Message) {
	mutex.Lock()
	receiver, found := clients[msg.ReceiverID]
	mutex.Unlock()

	if !found {
		log.Printf("Receiver %s is not connected.\n", msg.ReceiverID)
		return
	}

	err := receiver.WriteJSON(msg)
	if err != nil {
		log.Printf("Error writing message to receiver %s: %v\n", msg.ReceiverID, err)
		mutex.Lock()
		delete(clients, msg.ReceiverID)
		mutex.Unlock()
	}
}
