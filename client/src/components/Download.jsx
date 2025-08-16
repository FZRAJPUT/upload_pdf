import React from 'react';
const Download = () => {
  return (
    <section id="download" className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
          Download ExamVault
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Get the app on your favorite platform and start acing your exams today!
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-10">
          <a 
            href={'../assets/exam.apk'} // Direct link to the APK file in the public directory
            download="ExamVault-App.apk" // Suggests a filename for the download
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg w-full md:w-auto"
          >
            Download for Android
          </a>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-10">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Scan to Download (Android)</h3>
            {/* You can add a QR code image here */}
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Download;