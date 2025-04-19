const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const Pdf = require('../models/Pdf');
const streamifier = require('streamifier');
require('dotenv').config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup multer memory storage & file filter for PDFs only
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const { branch, subject } = req.body;

    if (!req.file || !branch || !subject) {
      return res.status(400).json({ message: 'PDF, branch and Subject are required.' });
    }

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'raw' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    const pdf = new Pdf({
      filename: req.file.originalname,
      cloudinaryUrl: result.secure_url,
      branch,
      subject
    });

    await pdf.save();
    res.json({ message: 'PDF uploaded successfully!', pdf });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

router.get('/files', async (req, res) => {
  const { branch } = req.query;
  try {
    const filter = branch ? { branch } : {};
    const files = await Pdf.find(filter).sort({ uploadedAt: -1 });
    console.log(files);
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching files', error: err.message });
  }
});

// DELETE PDF by ID
router.delete('/files/:id', async (req, res) => {
  try {
    const file = await Pdf.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Delete from Cloudinary using public_id
    const publicId = file.cloudinaryUrl.split('/').pop().split('.')[0]; // extract from URL
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });

    await file.deleteOne();
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Deletion failed', error });
  }
});



module.exports = router;
