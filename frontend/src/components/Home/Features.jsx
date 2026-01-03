import React, { useState, useEffect } from "react";
import {
  FaDollarSign,
  FaUsers,
  FaChartLine,
  FaHeart,
  FaStar,
  FaThumbsUp,
} from "react-icons/fa";

const Features = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("features-section");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          setAnimate(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="features-section"
      className="py-24 bg-[#F4F8FC] flex justify-center items-center"
    >
      <div className="container mx-auto px-6 lg:px-12 text-center">
        <p
          className={`uppercase text-black-600 text-30px font-semibold tracking-wide mb-4 transition-opacity duration-1000 ease-out ${
            animate ? "opacity-100" : "opacity-0"
          }`}
        >
          Unique Features
        </p>
        <h1
          className={`text-4xl lg:text-5xl font-extrabold text-gray-900 mb-20 transition-all duration-1000 ease-out transform ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Engage, Grow, and Monetize Your Passion
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 place-items-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex items-start space-x-6 bg-white p-6 rounded-2xl shadow-md transition-all duration-500 ease-out hover:scale-105 hover:shadow-lg transform ${
                animate
                  ? `opacity-100 translate-y-0 delay-[${index * 200}ms]`
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div
                className="rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg transition-transform duration-300 hover:rotate-3"
                style={{ background: feature.gradient }}
              >
                {feature.icon}
              </div>
              <div className="flex-1 pl-6 text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    icon: <FaDollarSign className="text-white" size="28" />,
    title: "Earn with Every View",
    description:
      "Turn your passion into profit! Earn from every post view and build a steady stream of income through your content.",
    gradient: "linear-gradient(135deg, #1565C0, #42A5F5)",
  },
  {
    icon: <FaUsers className="text-white" size="28" />,
    title: "Build Your Community",
    description:
      "Grow your audience and engage deeply. Offer exclusive content through subscriptions.",
    gradient: "linear-gradient(135deg, #E53935, #FF7043)",
  },
  {
    icon: <FaChartLine className="text-white" size="28" />,
    title: "Intuitive Dashboard",
    description:
      "Navigate your journey with ease. Our dashboard provides real-time insights into your performance and audience engagement.",
    gradient: "linear-gradient(135deg, #1565C0, #42A5F5)",
  },
  {
    icon: <FaHeart className="text-white" size="28" />,
    title: "Connect with Followers",
    description:
      "Build a loyal fanbase by engaging with followers, understanding their interests, and tailoring content to them",
    gradient: "linear-gradient(135deg, #D81B60, #FF4081)",
  },
  {
    icon: <FaStar className="text-white" size="28" />,
    title: "Creators Leaderboard",
    description:
      "Climb the ranks in our creators leaderboard. Showcase your talent and gain recognition within our vibrant community.",
    gradient: "linear-gradient(135deg, #FFC107, #FFD54F)",
  },
  {
    icon: <FaThumbsUp className="text-white" size="28" />,
    title: "Engage and Inspire",
    description:
      "Foster engagement with likes and interactive features. Inspire your audience and encourage meaningful interactions.",
    gradient: "linear-gradient(135deg, #7B1FA2, #BA68C8)",
  },
];

export default Features;
