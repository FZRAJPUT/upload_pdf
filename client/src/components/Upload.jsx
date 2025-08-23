import React, { useState } from 'react';
import axios from 'axios';

// IMPORTANT: This code is for a web-based React application.
// It will not run on a mobile device as a native app.
// To use this, you'll need to set up a basic web server
// or use a service like `create-react-app`.

// This will be rendered inside an HTML file that includes
// the necessary script tags for React, ReactDOM, Tailwind CSS, and Axios.
// This is provided for demonstration purposes.

// Replace this with your actual API endpoint URL.
// For example, if your backend is running on your local machine, use:
// const API_URL = 'http://localhost:5000/api/upload-profile';
const API_URL = 'http://localhost:3000/user/upload-profile';

// Replace with a valid user email that exists in your database.
const USER_EMAIL = 'subhashkushwah134@gmail.com';

export default function Upload() {
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  /**
   * Handles the file selection from the user's computer.
   * Reads the selected image file and sets up a preview URL.
   * @param {object} event - The file change event object.
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      // Create a temporary URL for image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setMessage('');
    } else {
      setProfileImage(null);
      setPreviewUrl(null);
      setMessage('');
    }
  };

  /**
   * Handles the image upload to the backend API.
   * Constructs a FormData object and sends it using an Axios POST request.
   */
  const handleImageUpload = async () => {
    if (!profileImage) {
      setMessage('Please select an image first.');
      return;
    }

    setUploading(true);
    setMessage('Uploading...');

    // Create a new FormData object.
    const formData = new FormData();
    
    // Append the image file. The backend expects the field name 'profileImage'.
    formData.append('profileImage', profileImage);

    // Append the user's email, which is required by your backend.
    formData.append('email', USER_EMAIL);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          // The browser automatically sets this header for FormData.
          // 'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setMessage('Upload successful!');
      } else {
        setMessage(response.data.message || 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Upload error:', error.response ? error.response.data : error.message);
      setMessage('An error occurred during upload. Check the console for details.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Web Profile Upload
        </h1>

        <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Profile Preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200">
              <span className="text-gray-500 text-center font-semibold">
                Select an image
              </span>
            </div>
          )}
        </div>

        <div className="mb-4">
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <label 
            htmlFor="file-upload" 
            className="block w-full text-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl cursor-pointer hover:bg-indigo-700 transition-colors"
          >
            {profileImage ? 'Change Image' : 'Choose Image'}
          </label>
        </div>

        <button
          onClick={handleImageUpload}
          disabled={!profileImage || uploading}
          className={`w-full px-4 py-3 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            ${uploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            'Upload Profile Image'
          )}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm font-medium text-gray-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
