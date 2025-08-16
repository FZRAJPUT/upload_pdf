import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
          About ExamVault
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <p className="text-gray-600 text-lg mb-6">
              ExamVault is a dedicated platform designed to help B.Tech students prepare effectively for their university examinations. By providing a comprehensive collection of previous year question papers, we aim to give you a competitive edge and boost your confidence. Our app simplifies the process of finding and accessing study materials, allowing you to focus on what matters most—learning.
            </p>
            <p className="text-gray-600 text-lg">
              We understand the importance of practice and pattern recognition in exam preparation. ExamVault is built to be intuitive and accessible, ensuring you have the right tools to succeed.
            </p>
          </div>
          <div className="md:w-1/2 bg-gray-100 p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Supported Branches 📚
            </h3>
            <ul className="text-gray-600 text-lg list-disc list-inside space-y-2">
              <li>Computer Science Engineering (CSE)</li>
              <li>Mechanical Engineering (ME)</li>
              <li>Electrical Engineering (EE)</li>
              <li>Civil Engineering (CE)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;