const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  filename: String,
  url: String,
  imagekitFileId: String,
  branch: String,
  subject: String,
  type: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Pdf", pdfSchema);