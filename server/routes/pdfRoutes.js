const express = require("express");
const multer = require("multer");
const Pdf = require("../models/Pdf");
const ImageKit = require("imagekit");
require("dotenv").config();

const router = express.Router();

// Configure ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Setup multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed!"), false);
  },
});

// Upload endpoint
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const { branch, subject, type } = req.body;

    if (!req.file || !branch || !subject || !type) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }


    const uploadResponse = await imagekit.upload({
      file: req.file.buffer, // Buffer
      fileName: `pdf_${Date.now()}.pdf`,
      folder: "/pdfs",
    });

    const newPdf = new Pdf({
      filename: req.file.originalname,
      url: uploadResponse.url,
      imagekitFileId: uploadResponse.fileId,
      branch,
      subject,
      type,
    });

    const savedPdf = await newPdf.save();

    res.json({ success: true, message: "Upload successful", pdf: savedPdf });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ success: false, message: "Upload failed", error: err.message });
  }
});

// Get files (filter by branch)
router.get("/files", async (req, res) => {
  try {
    const { branch } = req.query;
    const filter = branch ? { branch } : {};
    const files = await Pdf.find(filter).sort({ uploadedAt: -1 });
    res.json({ success: true, files });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch failed", error: err.message });
  }
});

// Delete file
router.delete("/files/:id", async (req, res) => {
  try {
    const file = await Pdf.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: "File not found" });

    if (file.imagekitFileId) {
      await imagekit.deleteFile(file.imagekitFileId);
    }

    await file.deleteOne();
    res.json({ success: true, message: "File deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Deletion failed", error: err.message });
  }
});

module.exports = router;
