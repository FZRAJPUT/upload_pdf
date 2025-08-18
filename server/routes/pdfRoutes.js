const express = require("express");
const multer = require("multer");
const Pdf = require("../models/Pdf");
const ImageKit = require("imagekit");
require("dotenv").config();

const router = express.Router();

// =================== IMAGEKIT CONFIG ===================
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// =================== MULTER CONFIG ===================
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed!"), false);
  },
});

// =================== UPLOAD ROUTE ===================
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const { branch, subject, type } = req.body;

    if (!req.file || !branch || !subject || !type) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer, // File buffer
      fileName: `pdf_${Date.now()}.pdf`,
      folder: "/pdfs",
    });

    // Save to MongoDB
    const newPdf = new Pdf({
      filename: req.file.originalname,
      url: uploadResponse.url,
      imagekitFileId: uploadResponse.fileId,
      branch:branch.toLowerCase(),
      subject,
      type,
    });

    const savedPdf = await newPdf.save();

    res.json({
      success: true,
      message: "Upload successful",
      pdf: savedPdf,
    });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: err.message,
    });
  }
});

// =================== GET FILES ===================
router.get("/files", async (req, res) => {
  try {
    const { branch, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = branch ? { branch } : {};

    // Convert page and limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Calculate the number of documents to skip for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch files with pagination, applying skip() and limit()
    const files = await Pdf.find(
      filter,
      "subject branch type url uploadedAt" // projection
    )
    .skip(skip)
    .limit(limitNumber);

    console.log(files);

    // Count total documents for the filter
    const total = await Pdf.countDocuments(filter);

    // Return response
    res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      limit: limitNumber,
      files,
    });
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({
      success: false,
      message: "Fetch failed",
      error: err.message,
    });
  }
});

// =================== DELETE FILE ===================
router.delete("/files/:id", async (req, res) => {
  try {
    const file = await Pdf.findById(req.params.id);
    if (!file)
      return res
        .status(404)
        .json({ success: false, message: "File not found" });

    // Delete from ImageKit
    if (file.imagekitFileId) {
      await imagekit.deleteFile(file.imagekitFileId);
    }

    await file.deleteOne();
    res.json({ success: true, message: "File deleted" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Deletion failed",
      error: err.message,
    });
  }
});

module.exports = router;
