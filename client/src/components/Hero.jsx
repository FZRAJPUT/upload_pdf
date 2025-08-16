import React from 'react';

const Hero = () => {
  return ( 
    <section id="home" className="bg-gray-100 flex justify-center py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight mb-4">
          Ace Your Exams with PYQ!
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          ExamVault is your ultimate companion for B.Tech exams. Access a vast repository of previous year question papers for CSE, ME, EE, and CE branches, all in one place.
        </p>
        <a 
          href="#download" 
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg"
        >
          Download Now
        </a>
      </div>
    </section>
  );
};

export default Hero;