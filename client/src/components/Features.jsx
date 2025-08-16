import React from 'react';
import { FaBook, FaSearch, FaCloudDownloadAlt } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: <FaBook size={48} className="text-blue-500" />,
      title: 'Vast PYQ Collection',
      description: 'Gain instant access to a large library of previous year question papers for all supported branches. Our collection is regularly updated to ensure you have the latest papers.',
    },
    {
      icon: <FaSearch size={48} className="text-green-500" />,
      title: 'Easy Search & Navigation',
      description: 'Quickly find the papers you need with our intuitive search functionality. Filter by branch, year, or subject to save time and effort.',
    },
    {
      icon: <FaCloudDownloadAlt size={48} className="text-yellow-500" />,
      title: 'Offline Access',
      description: 'Download your question papers and access them anytime, anywhere, without an internet connection. Study on the go and never miss a beat.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md transform hover:scale-105 transition duration-300">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;