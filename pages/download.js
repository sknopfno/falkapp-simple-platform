import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: 'config/falk-app-436618-b869a9479e7b.json',
        scopes: ['https://www.googleapis.com/auth/drive'],
      });

      const drive = google.drive({ version: 'v3', auth });

      // Replace 'your-file-id' with the actual file ID in your Google Drive
      const fileId = 'your-file-id';

      // Get the file's metadata (optional)
      const metadata = await drive.files.get({ fileId, fields: 'name' });

      // Stream the file content to the response
      const fileStream = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      );

      // Set the response headers
      res.setHeader('Content-Disposition', `attachment; filename="${metadata.data.name}"`);
      fileStream.data.pipe(res);
    } catch (error) {
      console.error('Google Drive Download Error:', error);
      res.status(500).json({ error: 'Failed to download file' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
