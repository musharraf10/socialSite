import React from "react";
import { FaUserCircle, FaEnvelope, FaKey, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const SettingsSubPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-500 p-6">
          <h2 className="text-2xl font-bold text-center text-white">
            User Settings
          </h2>
        </div>
        
        {/* Content */}
        <div className="bg-white p-6 space-y-4">
          {/* upload profile photo */}
          <Link to={`/curator/upload-profile-photo`} className="block">
            <div className="group flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-all duration-200 hover:shadow-md">
              <div className="bg-gradient-to-r from-blue-900 to-blue-500 p-3 rounded-full">
                <FaUserCircle className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-800 font-semibold text-lg group-hover:text-blue-700 transition-colors">
                  Update Profile Photo
                </h3>
                <p className="text-gray-600">Change your profile photo</p>
              </div>
              <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </div>
          </Link>
          
          {/* add email */}
          <Link to="/curator/add-email" className="block">
            <div className="group flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-all duration-200 hover:shadow-md">
              <div className="bg-gradient-to-r from-blue-900 to-blue-500 p-3 rounded-full">
                <FaEnvelope className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-800 font-semibold text-lg group-hover:text-blue-700 transition-colors">
                  Update Email
                </h3>
                <p className="text-gray-600">Change your email address</p>
              </div>
              <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </div>
          </Link>
          
          {/* Back button */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Link to="/curator">
              <button className="w-full bg-gradient-to-r from-blue-900 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-800 hover:to-blue-600 transition-all duration-200 shadow-md">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSubPage;