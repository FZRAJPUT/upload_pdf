# PDF Uploader App (MERN + Cloudinary)

## Features
- Upload PDFs to Cloudinary (as raw files)
- Store file metadata in MongoDB
- Display and download uploaded files from React frontend

## Technologies Used
- MongoDB
- Express.js
- React.js
- Node.js
- Cloudinary

## Setup Instructions

### Backend
1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create `.env` file in `server` directory with:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. Start server:
   ```bash
   node server.js
   ```

### Frontend
1. Go to `client` folder:
   ```bash
   cd ../client
   npm install
   npm start
   ```

## Deployment
- Host backend on Render/Railway
- Host frontend on Vercel/Netlify
- Update API URLs accordingly
