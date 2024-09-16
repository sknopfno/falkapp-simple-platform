const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  const formData = JSON.parse(event.body);  // Parse the multipart/form-data
  const files = formData.files;  // Get the uploaded files

  if (!files || files.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No files uploaded' }),
    };
  }

  try {
    // Define the processing folder
    const processingDir = path.join(__dirname, '/xlsx/processing');

    // Ensure the folder exists
    if (!fs.existsSync(processingDir)) {
      fs.mkdirSync(processingDir, { recursive: true });
    }

    // Save each file to the processing folder
    files.forEach(file => {
      const filePath = path.join(processingDir, file.name);
      fs.writeFileSync(filePath, file.content);  // Save the file
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Files uploaded successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Error: ${error.message}` }),
    };
  }
};
