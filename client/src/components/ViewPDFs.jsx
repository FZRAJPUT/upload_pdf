import { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewPDFs.css';

const apiUrl = import.meta.env.VITE_API_URL;

export default function ViewPDFs() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const getFiles = async (pageNum = 1) => {
    try {
      setLoading(true);

      const params = {
        page: pageNum,
        limit,
      };

      if (selectedBranch !== 'All') {
        params.branch = selectedBranch;
      }

      const response = await axios.get(`${apiUrl}/files`, { params });
      console.log(response.data.files)

      if (response.data && response.data.files && Array.isArray(response.data.files)) {
        setFiles(response.data.files);
        setTotal(response.data.total || 0);
        setPage(response.data.page || 1);
      } else {
        console.error('Expected files array in response but got:', response.data);
        setFiles([]);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFiles(1); // fetch first page on load
  }, [selectedBranch]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this file?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${apiUrl}/files/${id}`);
      setFiles(files.filter((file) => file._id !== id));
    } catch (err) {
      console.error('Error deleting file:', err);
      alert('Failed to delete the file.');
    }
  };

  const branches = ['All', ...new Set(files.map((file) => file.branch))];
  const subjects = ['All', ...new Set(files.map((file) => file.subject).filter(Boolean))];

  // Apply subject + search filter on frontend
  const filteredFiles = files.filter((file) => {
  const subjectMatch =
    selectedSubject === "All" || file.subject === selectedSubject;

  const fileName = (file?.filename || "").toLowerCase();
  const search = (searchTerm || "").toLowerCase();

  const searchMatch = fileName.includes(search);

  return subjectMatch && searchMatch;
});

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${filename}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download the file.');
    }
  };

  return (
    <div className="pdf-viewer-container">
      <div className="pdf-viewer-header">
        <h1>ExamVault Admin</h1>
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
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="branch-filter"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
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
                <p className="pdf-subject">{file.subject}</p>
                <p className="pdf-type">{file.type || 'Document'}</p>
              </div>

              <div className="pdf-card-footer">
                <button
                  onClick={() => handleDownload(file.url, file.filename)}
                  className="download-button"
                >
                  Download
                </button>

                <button onClick={() => handleDelete(file._id)} className="delete-button">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination-container">
        <button
          disabled={page <= 1}
          onClick={() => getFiles(page - 1)}
          className="pagination-button"
        >
          Prev
        </button>
        <span>
          Page {page} of {Math.ceil(total / limit) || 1}
        </span>
        <button
          disabled={page >= Math.ceil(total / limit)}
          onClick={() => getFiles(page + 1)}
          className="pagination-button"
        >
          Next
        </button>
      </div>

      <div className="refresh-container">
        <button onClick={() => getFiles(page)} className="refresh-button">
          Refresh List
        </button>
      </div>
    </div>
  );
}
