package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"google.golang.org/api/drive/v3"
	"google.golang.org/api/option"
)

func getDriveService() (*drive.Service, error) {
	clientEmail := os.Getenv("GOOGLE_CLIENT_EMAIL")
	privateKey := os.Getenv("GOOGLE_PRIVATE_KEY")

	// Create credentials in JSON format
	credentials := fmt.Sprintf(`{
        "type": "service_account",
        "client_email": "%s",
        "private_key": "%s"
    }`, clientEmail, strings.ReplaceAll(privateKey, "\\n", "\n"))

	ctx := context.Background()
	srv, err := drive.NewService(ctx, option.WithCredentialsJSON([]byte(credentials)))
	if err != nil {
		return nil, fmt.Errorf("unable to create Drive client: %v", err)
	}
	return srv, nil
}
func handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the form to retrieve the file
	r.ParseMultipartForm(10 << 20) // Limit file size to 10MB
	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Failed to read file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Initialize Google Drive service
	srv, err := getDriveService()
	if err != nil {
		http.Error(w, "Failed to create Google Drive client", http.StatusInternalServerError)
		return
	}

	// Upload file to Google Drive
	driveFile := &drive.File{
		Name: "UploadedFile",
	}
	uploadFile, err := srv.Files.Create(driveFile).Media(file).Do()
	if err != nil {
		http.Error(w, "Failed to upload file to Google Drive", http.StatusInternalServerError)
		return
	}

	// Send response back
	response := map[string]string{"message": "File uploaded successfully", "fileId": uploadFile.Id}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
func main() {
	http.HandleFunc("/upload-to-drive", handler)
	http.ListenAndServe(":8080", nil)
}
