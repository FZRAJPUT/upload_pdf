import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and About */}
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold mb-4">ExamVault</div>
            <p className="text-gray-400">Your one-stop solution for B.Tech previous year question papers.</p>
          </div>

          {/* Social Media Links */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">              
              <a href="https://instagram.com/subhash_kushwaah" className="hover:text-pink-500 transition duration-300">
                <FaInstagram size={24} />
              </a>
              <a href="https://www.linkedin.com/in/subhash-kumar-f98z" className="hover:text-blue-700 transition duration-300">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div> 
          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">Email: subhashkushwah134@gmail.com</p>
            <p className="text-gray-400">Phone: +91 9855369230</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2025 ExamVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;