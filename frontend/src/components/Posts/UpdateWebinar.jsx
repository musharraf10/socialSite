import { Plus, Calendar, Link as LinkIcon, Clock, FileText } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { checkAuthStatusAPI } from "../../APIServices/users/usersAPI";

const UpdateWebinar = () => {
  const { id } = useParams();
  const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    date: "",
    time: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebinar = async () => {
      try {
        const response = await axios.get(
          `${BackendServername}/posts/managecontent/getpost/${id}`
        );

        console.log("Fetched Webinar Data:", response.data);

        if (response.data && response.data.refId) {
          const webinar = response.data.refId;
          setFormData({
            title: webinar.title || "",
            link: webinar.link || "",
            date: webinar.date ? webinar.date.split("T")[0] : "",
            time: webinar.time || "",
            description: webinar.description || "",
          });
        } else {
          console.error("No webinar data found");
          alert("Webinar details not found.");
        }
      } catch (error) {
        console.error("Error fetching webinar:", error);
        alert("Failed to fetch webinar details.");
      } finally {
        setLoading(false);
      }
    };

    fetchWebinar();
  }, [id, BackendServername]);

  const { isLoading, data } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
  });

  let userRole = data?.role;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending update request with data:", formData);

      const response = await axios.put(
        `${BackendServername}/webinar/updatewebinar/${id}`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Webinar updated successfully:", response.data);
      alert("Webinar updated successfully!");
      navigate(`/${userRole}/manage-content`);
    } catch (error) {
      console.error("Error updating webinar:", error);
      alert(error.response?.data?.message || "There was an error updating the webinar.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6]">
          
            <Link
            to={`/${userRole}/manage-content`}
            className="inline-flex items-center text-white-600 hover:text-white-800 mb-2"
            style={{color:"white"}}
          >
            &larr; Back to Guides
          </Link>
            <h1 className="text-3xl font-bold text-white">Update Webinar</h1>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="ml-3 text-lg text-gray-600">Loading webinar details...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Webinar Title
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Enter webinar title"
                    />
                  </div>
                </div>

                {/* Link */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Webinar Link
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleChange}
                      required
                      placeholder="https://"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter webinar description"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white rounded-lg hover:from-[#1E40AF] hover:to-[#2563EB] transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    <span className="text-lg font-medium">Update Webinar</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateWebinar;