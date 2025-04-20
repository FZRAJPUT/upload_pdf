const express = require("express");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const Pdf = require("../models/Pdf");
const streamifier = require("streamifier");
require("dotenv").config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup multer memory storage & file filter for PDFs only
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
  },
});

// Upload route
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const { branch, subject, type } = req.body;

    // Enhanced validation
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "PDF file is required." 
      });
    }

    if (!branch || !subject || !type) {
      return res.status(400).json({ 
        success: false,
        message: "Branch, subject, and type are required." 
      });
    }

    // Validate input lengths
    if (branch.length > 50 || subject.length > 100 || type.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Input fields exceed maximum length."
      });
    }

    // Function to stream upload to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { 
            resource_type: "raw",
            format: "pdf",
            type: "upload",
            public_id: `pdf_${Date.now()}_${Math.random().toString(36).substring(7)}`
          },
          (error, result) => {
            if (error) {
              reject(new Error(`Cloudinary upload failed: ${error.message}`));
            } else if (result) {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    // Upload PDF
    const result = await streamUpload(req.file.buffer);

    // Save PDF metadata to MongoDB
    const pdf = new Pdf({
      filename: req.file.originalname,
      cloudinaryUrl: result.secure_url,
      branch,
      subject,
      type,
    });

    await pdf.save();

    res.json({ 
      success: true,
      message: "PDF uploaded successfully!", 
      pdf 
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ 
      success: false,
      message: "Upload failed", 
      error: err.message 
    });
  }
});

router.get("/files", async (req, res) => {
  const { branch } = req.query;
  try {
    const filter = branch ? { branch } : {};
    const files = await Pdf.find(filter).sort({ uploadedAt: -1 });
    res.json({ 
      success: true,
      files
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Error fetching files", 
      error: err.message 
    });
  }
});

// DELETE PDF by ID
router.delete("/files/:id", async (req, res) => {
  try {
    const file = await Pdf.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ 
        success: false,
        message: "File not found" 
      });
    }

    // Delete from Cloudinary using public_id
    const publicId = file.cloudinaryUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    await file.deleteOne();
    
    res.json({ 
      success: true,
      message: "File deleted successfully" 
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ 
      success: false,
      message: "Deletion failed", 
      error: error.message 
    });
  }
});

module.exports = router;
