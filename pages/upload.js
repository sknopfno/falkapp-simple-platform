import { google } from 'googleapis';
import multiparty from 'multiparty';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle file uploads
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      try {
        // Define path to service account key dynamically
        const keyPath = path.join(process.cwd(), 'config/falk-app-436618-b869a9479e7b.json');

        const drive = google.drive({ version: 'v3', auth });

        // Process the file to upload
        const file = files.files[0];  // Assuming one file is uploaded
        const fileMetadata = {
          name: file.originalFilename,  // Name the file as the original
          parents: ['your-folder-id'],  // Replace with your Google Drive folder ID
        };

        const media = {
          mimeType: file.headers['content-type'],
          body: fs.createReadStream(file.path),
        };

        const response = await drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'id',  // Return the file ID after upload
        });

        return res.status(200).json({ fileId: response.data.id });
      } catch (error) {
        console.error('Google Drive Upload Error:', error);
        return res.status(500).json({ error: 'Failed to upload file' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
