import React from "react";
import { FaLightbulb } from "react-icons/fa";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="w-full py-24 flex flex-col items-center text-center">
      {/* Icon */}
      <div className="bg-gradient-to-r from-[#1565C0] to-[#42A5F5] p-4 rounded-full shadow-lg">
        <FaLightbulb className="text-white" size={28} />
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-10 leading-snug">
        Discover Fun and Exciting Knowledge
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-700 mt-6 max-w-2xl leading-relaxed">
        Embark on an exciting learning adventure together - Join now!
      </p>

      {/* CTA Button */}
      <div className="mt-20">
        <Link
          to="/register"
          className="bg-gradient-to-r from-[#1565C0] to-[#42A5F5] hover:from-[#0D47A1] hover:to-[#1E88E5] transition-all duration-300 text-white font-semibold text-lg px-7 py-3 rounded-full shadow-lg transform hover:scale-105"
        >
          Sign Up Now
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
