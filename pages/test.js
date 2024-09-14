import { useState, useRef } from 'react';
import ButtonWithImage from '../components/ButtonWithImage';  // Import the ButtonWithImage component

export default function test() {
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null); // Reference to the hidden file input

  // Function to trigger the file input dialog
  const handleChooseAndUpload = async () => {
    fileInputRef.current.click(); // Simulate click on the hidden file input
  };

  // Handle file selection and automatic upload
  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;

    if (selectedFiles.length > 0) {
      const formData = new FormData();

      for (const file of selectedFiles) {
        formData.append('file', file);
      }

      // Upload the files
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('Files uploaded successfully');
      } else {
        setUploadStatus('Failed to upload files');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Upload</h1>
      {/* Hidden file input */}
      <input
        type="file"
        accept=".xlsx"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }} // Hide the file input
      />

      {/* The visible button for selecting and uploading files */}
      <button
        onClick={handleChooseAndUpload}
        className="button"
      >
        Upload Files
      </button>

      {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
    </div>
  );
}
