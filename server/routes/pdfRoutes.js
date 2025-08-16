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
      branch,
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
    const filter = branch ? { branch } : {};

    const files = await Pdf.find(
      filter,
      "subject branch type url uploadedAt" // projection (send only required fields)
    )
      .sort({ uploadedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Pdf.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      files,
    });
  } catch (err) {
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
