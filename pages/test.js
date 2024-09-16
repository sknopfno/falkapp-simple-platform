import Head from 'next/head';
import Footer from '@components/Footer';
import ButtonWithImage from '../components/ButtonWithImage';  // Import the ButtonWithImage component
import styles from '../styles/Home.module.css';
import { useState } from 'react'; // Import useState to manage console messages

export default function Test() {
  const [consoleMessages, setConsoleMessages] = useState([]); // Initialize console messages state

  // Function to add a new message to the console
  const logMessage = (message) => {
    setConsoleMessages((prevMessages) => [...prevMessages, message]);
  };

  // Example: Simulate an upload failure message when clicking the Upload button
  const handleUploadClick = () => {
    logMessage("Upload failed: Network error");
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

        {/* Buttons */}
        <div className="button-container">
          <ButtonWithImage 
            href="/" 
            src="/upload.png" 
            alt="upload" 
            text="Upload"
            onClick={handleUploadClick}  // Call the function to simulate an upload failure
          />
          <ButtonWithImage 
            href="/" 
            src="/download.png" 
            alt="download" 
            text="Download" 
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
