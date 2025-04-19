import { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewPDFs.css';

export default function ViewPDFs() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const getFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/files');
      if (Array.isArray(response.data)) {
        setFiles(response.data);
      } else {
        console.error('Expected an array but got:', response.data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFiles();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this file?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/files/${id}`);
      setFiles(files.filter(file => file._id !== id));
    } catch (err) {
      console.error('Error deleting file:', err);
      alert('Failed to delete the file.');
    }
  };

  const branches = ['All', ...new Set(files.map(file => file.branch))];
  const subjects = ['All', ...new Set(files.map(file => file.subject).filter(Boolean))];

  const filteredFiles = files.filter(file => {
    const branchMatch = selectedBranch === 'All' || file.branch === selectedBranch;
    const subjectMatch = selectedSubject === 'All' || file.subject === selectedSubject;
    const searchMatch = file.filename.toLowerCase().includes(searchTerm.toLowerCase());
    return branchMatch && subjectMatch && searchMatch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="pdf-viewer-container">
      <div className="pdf-viewer-header">
        <h1>PDF Document Library</h1>
        <p>Access and manage department documents</p>
      </div>

      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <select 
            value={selectedBranch} 
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="branch-filter"
          >
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>

          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="branch-filter"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading documents...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="empty-state">
          <h3>No documents found</h3>
          <p>
            {searchTerm || selectedBranch !== 'All' || selectedSubject !== 'All'
              ? 'Try changing your search or filter criteria' 
              : 'No PDFs are currently available for download'}
          </p>
        </div>
      ) : (
        <div className="pdf-grid">
          {filteredFiles.map((file) => (
            <div className="pdf-card" key={file._id}>
              <div className="pdf-card-header">
                <div className="pdf-icon">
                  <div className="pdf-icon-corner"></div>
                  <span>PDF</span>
                </div>
                <div className="pdf-badge">{file.branch}</div>
              </div>
              
              <div className="pdf-card-content">
                <h3 className="pdf-title">{file.filename}</h3>
                <p className="pdf-date">{formatDate(file.uploadedAt || file.updatedAt)}</p>
                <p className="pdf-date">{file.subject}</p>
              </div>
              
              <div className="pdf-card-footer">
                <a
                  href={file.cloudinaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={file.filename}
                  className="download-button"
                >
                  Download
                </a>
                <a
                  href={file.cloudinaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-button"
                >
                  View
                </a>
                <button 
                  onClick={() => handleDelete(file._id)} 
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="refresh-container">
        <button onClick={getFiles} className="refresh-button">
          Refresh List
        </button>
      </div>
    </div>
  );
}
