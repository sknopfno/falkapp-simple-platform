package main

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"time"

	"golang.org/x/oauth2/google"
	"google.golang.org/api/drive/v3"
	"google.golang.org/api/option"
)

// Authenticate and create a Drive client using the service account credentials
func createDriveService() (*drive.Service, error) {
	ctx := context.Background()
	credentials, err := os.ReadFile("config/falk-app-436618-b869a9479e7b.json") // Ensure the correct path to credentials.json
	if err != nil {
		return nil, fmt.Errorf("unable to read service account credentials: %v", err)
	}

	config, err := google.CredentialsFromJSON(ctx, credentials, drive.DriveFileScope)
	if err != nil {
		return nil, fmt.Errorf("unable to parse client secret file to config: %v", err)
	}

	driveService, err := drive.NewService(ctx, option.WithCredentials(config))
	if err != nil {
		return nil, fmt.Errorf("unable to retrieve Drive client: %v", err)
	}
	return driveService, nil
}

// Handler for file upload
func uploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseMultipartForm(10 << 20) // 10 MB max file size
	if err != nil {
		http.Error(w, "Error parsing form data", http.StatusBadRequest)
		return
	}

	files := r.MultipartForm.File["files"]
	if len(files) == 0 {
		http.Error(w, "No files uploaded", http.StatusBadRequest)
		return
	}

	driveService, err := createDriveService()
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to create Drive service: %v", err), http.StatusInternalServerError)
		return
	}

	for _, fileHeader := range files {
		if fileHeader.Filename[len(fileHeader.Filename)-5:] != ".xlsx" {
			http.Error(w, "Only .xlsx files are allowed", http.StatusBadRequest)
			return
		}

		file, err := fileHeader.Open()
		if err != nil {
			http.Error(w, "Unable to open uploaded file", http.StatusInternalServerError)
			return
		}
		defer file.Close()

		uploadedFile, err := uploadToDrive(driveService, file, fileHeader.Filename)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to upload file: %v", err), http.StatusInternalServerError)
			return
		}

		fmt.Fprintf(w, "File '%s' uploaded successfully to Google Drive.\n", uploadedFile.Name)
	}
}

// Function to upload the file to Google Drive
func uploadToDrive(service *drive.Service, file multipart.File, filename string) (*drive.File, error) {
	driveFile := &drive.File{
		Name:    filename,
		Parents: []string{"1DORdLN_vzbiThwkueh1axWXrrDod1bZJ"}, // Specify the folder ID if needed
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Minute*2)
	defer cancel()

	uploadedFile, err := service.Files.Create(driveFile).Media(file).Context(ctx).Do()
	if err != nil {
		return nil, fmt.Errorf("unable to upload file to Drive: %v", err)
	}

	return uploadedFile, nil
}

func main() {
	http.HandleFunc("/upload", uploadHandler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
