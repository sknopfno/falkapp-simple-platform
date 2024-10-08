import Head from 'next/head';
import Footer from '@components/Footer';
import ButtonWithImage from '../components/ButtonWithImage';  // Import the ButtonWithImage component
import styles from '../styles/Home.module.css';
import { useState, useRef } from 'react'; // Import useState and useRef

export default function Test() {
  const [consoleMessages, setConsoleMessages] = useState([]); // Initialize console messages state
  const fileInputRef = useRef(null);  // To reference the hidden file input

  // Function to add a new message to the console
  const logMessage = (message) => {
    setConsoleMessages((prevMessages) => [...prevMessages, message]);
  };
  // Function to clear the console messages
  const handleClearLogClick = () => {
    setConsoleMessages([]);  // Clear the console log by resetting the state
    logMessage("Console log cleared.");  // Optional: Add a message to show the log has been cleared
  };
  // Handle file selection and upload to the backend
  const handleFileChange = async (event) => {
    const files = event.target.files;

    // Check if only .xlsx files are selected
    const xlsxFiles = Array.from(files).filter(file => file.name.endsWith('.xlsx'));

    if (xlsxFiles.length === 0) {
      logMessage("Error: Please select only .xlsx files.");
      return;
    }

    logMessage(`${xlsxFiles.length} .xlsx file(s) selected. Uploading...`);

    // Prepare the form data for the file upload
    const formData = new FormData();
    xlsxFiles.forEach(file => {
      formData.append('file', file);
    });

    try {
      // Make a POST request to your backend to handle file uploads
      const response = await fetch('/netlify/functions/upload-to-drive', {

        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        logMessage("Files uploaded successfully.");
      } else {
        logMessage("Upload failed: " + response.statusText);
      }
    } catch (error) {
      logMessage("Upload failed: " + error.message);
    }
  };

  // Handle the button click to trigger the file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();  // Trigger the hidden file input
    }
  };

  return (
    <div className="container">
      <Head>
        <title>falk.app</title>
        <meta name="description" content="falk.app" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <h1 className={styles.title}></h1>

        {/* Console Window */}
        <div className={styles.console}>
          {consoleMessages.length > 0 ? (
            consoleMessages.map((msg, index) => (
              <p key={index} className={styles.consoleMessage}>{msg}</p>
            ))
          ) : (
            <p className={styles.consolePlaceholder}>No messages</p>
          )}
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          multiple 
          accept=".xlsx" 
          ref={fileInputRef}  // Attach the reference to the file input
          onChange={handleFileChange}  // Handle file selection and automatic upload
          style={{ display: 'none' }}  // Hide the file input
        />

        {/* Buttons */}
        <div className="button-container">

          <ButtonWithImage 
        src="/upload.png" 
        alt="upload" 
        text="Upload"
        onClick={handleUploadClick}  // Trigger file input when button is clicked
        />
        <ButtonWithImage 
        src="/clear.png" 
        alt="Clear" 
        text="Clear"
        onClick={handleClearLogClick}  // Trigger clearing the console log
/>
        </div>
      </main>

      <Footer />
    </div>
  );
}