import { promises as fs } from 'fs';
import path from 'path';
import formidable from 'formidable';

// Disable Next.js' body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), '/xlsx/processing'); // Upload directory
    form.keepExtensions = true; // Keep file extensions

    // Ensure the directory exists
    await fs.mkdir(form.uploadDir, { recursive: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing files' });
      }

      const uploadedFiles = files.files instanceof Array ? files.files : [files.files];

      for (const file of uploadedFiles) {
        const filePath = path.join(form.uploadDir, file.originalFilename);
        await fs.rename(file.filepath, filePath); // Move file to the desired directory
      }

      res.status(200).json({ message: 'Files uploaded successfully' });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
