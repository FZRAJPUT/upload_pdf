import { useState } from 'react';
import axios from 'axios';
import './Upload.css';

export default function PdfManager() {
  const [file, setFile] = useState(null);
  const [branch, setBranch] = useState('');
  const [subject, setSubject] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // All available subjects
  const allSubjects = [
    'Data Structures', 'Algorithms', 'Database Management Systems',
    'Operating Systems', 'Computer Networks', 'Discrete Mathematics',
    'Thermodynamics', 'Mechanics of Materials', 'Fluid Mechanics',
    'Manufacturing Processes', 'Strength of Materials', 'Engineering Mathematics',
    'Structural Analysis', 'Geotechnical Engineering', 'Transportation Engineering',
    'Environmental Engineering', 'Surveying',
    'Circuits & Systems', 'Control Systems', 'Power Systems',
    'Electromagnetic Fields', 'Signals & Systems', 'Electrical Machines',
  ];

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !branch || !subject) return alert('Select a file, branch, and subject.');

    setIsUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('branch', branch);
    formData.append('subject', subject);

    try {
      await axios.post('http://localhost:5000/upload', formData);
      alert('PDF uploaded!');
      setFile(null);
      setBranch('');
      setSubject('');
      // getFiles(); // Refresh list
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  return (
    <div className="pdf-manager-container">
      <div className="card">
        <div className="card-header">
          <h2>Upload PDF Document</h2>
          <p>Share your documents with the department</p>
        </div>
        
        <form className="upload-form" onSubmit={handleUpload}>
          <div 
            className={`drop-area ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p>{file ? file.name : 'Drag & Drop your PDF here'}</p>
            <span>or</span>
            <label className="file-input-label">
              Browse Files
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="file-input"
              />
            </label>
            {file && (
              <div className="file-preview">
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <button 
                  type="button" 
                  className="remove-file-btn"
                  onClick={() => setFile(null)}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Select Department</label>
            <select 
              value={branch} 
              onChange={(e) => setBranch(e.target.value)}
              className="branch-select"
            >
              <option value="">Select Branch</option>
              <option value="CSE">Computer Science</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="CE">Civil Engineering</option>
              <option value="EE">Electrical Engineering</option>
            </select>
          </div>

          <div className="form-group">
            <label>Select Subject</label>
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="branch-select"
            >
              <option value="">Select Subject</option>
              {allSubjects.map((sub, index) => (
                <option key={index} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

            {/* <div className="form-group">
            <label>Select Subject</label>
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="branch-select"
            >
              <option value="">Select Subject</option>
              {allSubjects.map((sub, index) => (
                <option key={index} value={sub}>{sub}</option>
              ))}
            </select>
          </div> */}
          
          <button 
            type="submit" 
            className={`upload-btn ${isUploading ? 'uploading' : ''}`}
            disabled={!file || !branch || !subject || isUploading}
          >
            {isUploading ? (
              <>
                <span className="spinner"></span>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <span className="upload-icon-btn"></span>
                <span>Upload Document</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
