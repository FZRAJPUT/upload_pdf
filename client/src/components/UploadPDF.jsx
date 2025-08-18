import { useState } from 'react';
import axios from 'axios';
import './Upload.css';

const apiUrl = import.meta.env.VITE_API_URL;

export default function PdfManager() {
  const [file, setFile] = useState(null);
  const [branch, setBranch] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState(''); // 🔍 search state
  const [showDropdown, setShowDropdown] = useState(false);

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

    if (!file || !branch || !subject || !type) {
      alert('Please select file, branch, subject, and type.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('branch', branch);
    formData.append('subject', subject);
    formData.append('type', type);

    setIsUploading(true);

    try {
      let res = await axios.post(`${apiUrl}/upload`, formData);
      console.log(res.data.pdf)
      alert('PDF uploaded successfully!');
      setFile(null);
      setBranch('');
      setSubject('');
      setType('');
      setSubjectSearch('');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload PDF. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    if (droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  // 🔍 Filter subjects based on search
  const filteredSubjects = allSubjects.filter((sub) =>
    sub.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  return (
    <div className="pdf-manager-container">
      <div className="card">
        <div className="card-header">
          <h2>Upload PDF Document</h2>
          <p>Share your documents with the department</p>
        </div>

        <form className="upload-form" onSubmit={handleUpload}>
          {/* File Upload */}
          <div
            className={`drop-area ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <p>{file ? file.name : 'Drag & Drop your PDF here'}</p>
            <span>or</span>
            <label className="file-input-label">
              Browse Files
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const selected = e.target.files[0];
                  if (selected?.type !== 'application/pdf') {
                    alert('Only PDF files are allowed.');
                    return;
                  }
                  setFile(selected);
                }}
                className="file-input"
              />
            </label>
            {file && (
              <div className="file-preview">
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
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

          {/* Branch */}
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

          {/* Subject with search */}
          <div className="form-group subject-search">
            <label>Select Subject</label>
            <input
              type="text"
              value={subjectSearch}
              onChange={(e) => {
                setSubjectSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search subject..."
              className="subject-input"
            />
            {showDropdown && (
              <ul className="subject-dropdown">
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((sub, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setSubject(sub);
                        setSubjectSearch(sub);
                        setShowDropdown(false);
                      }}
                    >
                      {sub}
                    </li>
                  ))
                ) : (
                  <li className="no-results">No subjects found</li>
                )}
              </ul>
            )}
          </div>

          {/* Type */}
          <div className="form-group">
            <label>Select Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="branch-select"
            >
              <option value="">Select Type</option>
              <option value="PYQ">PYQ (Previous Year Question)</option>
              <option value="Syllabus">Syllabus</option>
            </select>
          </div>

          {/* Upload button */}
          <button
            type="submit"
            className={`upload-btn ${isUploading ? 'uploading' : ''}`}
            disabled={!file || !branch || !subject || !type || isUploading}
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
