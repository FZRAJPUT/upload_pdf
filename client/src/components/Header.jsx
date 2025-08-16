import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white sticky top-0 shadow-md z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800">
          ExamVault
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to={'/'} className="text-gray-600 hover:text-blue-600 transition duration-300">Home</Link>
          <a href="#about" className="text-gray-600 hover:text-blue-600 transition duration-300">About</a>
          <a href="#features" className="text-gray-600 hover:text-blue-600 transition duration-300">Features</a>
          <a href="#download" className="text-gray-600 hover:text-blue-600 transition duration-300">Download</a>
          <Link to={'/admin'} className="text-gray-600 hover:text-blue-600 transition duration-300">Admin</Link>

        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 transition-all duration-300 ease-in-out">
          <Link to={'/'} onClick={toggleMenu} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Home</Link>
          <a href="#about" onClick={toggleMenu} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">About</a>
          <a href="#features" onClick={toggleMenu} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Features</a>
          <a href="#download" onClick={toggleMenu} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Download</a>
          <Link to={'/admin'} onClick={toggleMenu} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Admin</Link>

        </div>
      )}
    </header>
  );
};

export default Header;