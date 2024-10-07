package main

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func handler(ctx context.Context, req events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	// Decode the base64-encoded file data from the request body
	var requestBody struct {
		Files []string `json:"files"`
	}

	if err := json.Unmarshal([]byte(req.Body), &requestBody); err != nil {
		return &events.APIGatewayProxyResponse{StatusCode: http.StatusBadRequest}, nil
	}

	for _, fileData := range requestBody.Files {
		// Convert base64 string to bytes
		decodedData, err := decodeBase64File(fileData)
		if err != nil {
			return &events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError}, nil
		}

		// Here you can add logic to handle the uploaded file (e.g., save it to Google Drive)
		// For demonstration, we will save it locally
		err = saveFile("uploaded_file.xlsx", decodedData)
		if err != nil {
			return &events.APIGatewayProxyResponse{StatusCode: http.StatusInternalServerError}, nil
		}
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       "Files uploaded successfully",
	}, nil
}

// decodeBase64File decodes a base64 encoded string into bytes.
func decodeBase64File(data string) ([]byte, error) {
	return io.ReadAll(strings.NewReader(data))
}

// saveFile saves the byte data to a specified filename.
func saveFile(filename string, data []byte) error {
	return os.WriteFile(filename, data, 0644)
}

func main() {
	lambda.Start(handler)
}
