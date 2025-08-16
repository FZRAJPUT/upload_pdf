import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Download from './components/Download';
import Footer from './components/Footer';
import { Route, Routes } from 'react-router-dom';
import PdfManager from './components/UploadPDF';
import ViewPDFs from './components/ViewPDFs';
import ProtectedRoute from './components/ProtectedRoute'; // Import the new component

function App() {
  const ADMIN_PASSWORD = import.meta.env.VITE_API_ADMIN_KEY

  return (
    <div className="h-auto bg-gray-50 font-sans text-gray-800">
      <Header />
      <Routes>
        <Route path='/' element={
          <main>
            <Hero />
            <About />
            <Features />
            <Download />
          </main>
        } />
        <Route path='/admin' element={
          <ProtectedRoute password={ADMIN_PASSWORD}>
            <div className='main'>
              <PdfManager />
              <ViewPDFs />
            </div>
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;