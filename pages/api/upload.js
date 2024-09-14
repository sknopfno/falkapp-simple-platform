import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm({
      multiples: true, // allows multiple file uploads
      keepExtensions: true, // keep file extension
    });

    // Specify the directory to save the uploaded files
    const processingFolder = path.resolve('./processing');

    // Ensure the "processing" directory exists
    if (!fs.existsSync(processingFolder)) {
      fs.mkdirSync(processingFolder, { recursive: true });
    }

    form.uploadDir = processingFolder;

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error uploading files:', err);
        return res.status(500).json({ error: 'Error uploading files' });
      }

      // Process the uploaded files
      const uploadedFiles = files.file instanceof Array ? files.file : [files.file];

      uploadedFiles.forEach(file => {
        const oldPath = file.path;
        const newPath = path.join(processingFolder, file.name);
        
        // Rename the file to keep the original file name
        fs.renameSync(oldPath, newPath);
      });

      return res.status(200).json({ message: 'Files uploaded successfully' });
    });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};
