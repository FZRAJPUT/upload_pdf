const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  filename: String,
  cloudinaryUrl: String,
  branch: {
    type: String,
    enum: ['CSE', 'ME', 'CE', 'EE'], // Add more branches as needed
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  type:{
    type:String,
    enum:["PYQ","Syllabus"],
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pdf', pdfSchema);
