import React, { useEffect, useState } from "react";
import { FileText, Video, BookOpen, Plus, Calendar, Eye, Search, Edit, Trash2 } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
// import Previewdata from "./Previewdata";
import { useQuery } from "@tanstack/react-query";
import { checkAuthStatusAPI } from "../../APIServices/users/usersAPI";

"use client"


const ManageData = () => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
  });

  console.log("userdata", data);
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <AuthCheckingComponent />;

  if (!data) {
    return <Navigate to="/login" />;
  } else {
    var userId = data?._id;
    
    console.log("userId",userId);
  }
  let userRole = data?.role;


  const navigate = useNavigate();
  const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;
  const [selectedeyebutton, setselectedeyebutton] = useState(null);
  const [selectedcontent, setselectedcontent] = useState(null);
  const [contentItems, setContentItems] = useState([]);

  useEffect(() => {
    const fetchContentItems = async () => {
      try {
        const response = await axios.get(
          `${BackendServername}/posts/managecontent/getpost`,
          {
            params: { userId },
            withCredentials: true, 
          }
        );        
        const data = response.data;
        console.log(data.data);        
        setContentItems(data.data);
      } catch (error) {
        alert(error);
        console.error("Error fetching content items:", error);
      }
    };

    fetchContentItems();
  }, []);
  const [activeFilter, setActiveFilter] = useState("all");

  const categoryDetails = [
    {
      type: "Article",
      label: "Articles",
      icon: FileText,
      description: "Rich text, images, embedded media",
      color: "#3b82f6",
    },
    {
      type: "VideoTutorial",
      label: "Videos",
      icon: Video,
      description: "Host content with adaptive streaming",
      color: "#ef4444",
    },
    {
      type: "StepbyStepGuide",
      label: "Interactive Guides",
      icon: BookOpen,
      description: "Step-by-step tutorials with interactive elements",
      color: "#22C55E",
    },
    {
      type: "Webinar",
      label: "Webinars",
      icon: Calendar,
      description: "Scheduled live video sessions with chat/Q&A",
      color: "#A855F7 ",
    },
  ];

  const articleCount = contentItems.filter(
    (item) => item.contentData === "Article"
  ).length;
  const videoCount = contentItems.filter(
    (item) => item.contentData === "video-tutorial"
  ).length;
  const guideCount = contentItems.filter(
    (item) => item.contentData === "StepbyStepGuide"
  ).length;
  const webinarCount = contentItems.filter(
    (item) => item.contentData === "Webinar"
  ).length;

  // Filter content items
  const filteredItems =
    activeFilter === "all"
      ? contentItems
      : contentItems.filter((item) => item.contentData === activeFilter);

  const handleOpenModalofposts = (post) => {
    setselectedcontent(post);
    setselectedeyebutton(true);
  };

  const handleCloseModalofposts = () => {
    setselectedcontent(null);
    setselectedeyebutton(null);
  };
  const handleDelete=(id)=>{
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;
      axios.delete(`${BackendServername}/posts/managecontent/deletepost/${id}`)
      .then(()=>{
        alert("Post Deleted Successfully")
        setContentItems((prevItems) => prevItems.filter(item => item._id !== id));
      })
      .catch((err)=>{
        console.log(err);
      })
  }
  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-[#1565C0] to-[#42A5F5] text-white py-16 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMCAwaDEyMHYyMEgweiIvPjxwYXRoIGQ9Ik0wIDBoMTIwdjIwSDB6IiBmaWxsPSIjRkZGIiBmaWxsLW9wYWNpdHk9Ii4yIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-center tracking-tight">Content Management Dashboard</h1>
          <p className="text-xl text-center max-w-2xl mx-auto opacity-90 font-light">
            Manage, update, and organize your content efficiently
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full px-4 py-12 max-w-full overflow-hidden">
        {/* Content Types */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden mb-12 transform transition-all duration-300 hover:shadow-xl">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-gradient-to-r from-[#1565C0] to-[#42A5F5] w-1.5 h-6 rounded mr-3 inline-block"></span>
              Content Types
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryDetails.map((contentType) => (
                <div
                  key={contentType.type}
                  className="bg-white border border-gray-200 rounded-xl p-6 group transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl relative overflow-hidden"
                  onClick={() => navigate(`/${userRole}/create-post/${contentType.type}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1565C0] to-[#42A5F5] opacity-0 transition-opacity duration-300 group-hover:opacity-5"></div>
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg mr-4 transition-colors duration-300 group-hover:bg-blue-100">
                      <contentType.icon className="h-7 w-7 text-[#1565C0] transition-colors duration-300 group-hover:text-[#0D47A1]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-[#1565C0]">
                      {contentType.label}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{contentType.description}</p>
                  <button
                    className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-[#1565C0] to-[#42A5F5] text-white text-sm font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden group-hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/${userRole}/create-post/${contentType.type}`)
                    }}
                  >
                    <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 hover:opacity-20"></span>
                    <Plus className="h-4 w-4 mr-1.5" />
                    Create New
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Type Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {categoryDetails.map((type) => {
            let count = 0
            if (type.type === "Article") count = articleCount
            else if (type.type === "VideoTutorial") count = videoCount
            else if (type.type === "StepbyStepGuide") count = guideCount
            else if (type.type === "Webinar") count = webinarCount

            return (
              <div
                key={type.type}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 group"
              >
                <div className="bg-gradient-to-r from-[#1565C0] to-[#42A5F5] p-6 text-white flex items-center justify-between transition-all duration-300">
                  <h3 className="font-semibold text-lg">{type.label}</h3>
                  <span className="text-3xl font-bold">{count}</span>
                </div>
                <div className="p-5 bg-white">
                  <div className="text-sm text-gray-600 flex items-center justify-between">
                    <span>{count === 1 ? "item" : "items"} published</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full transition-colors duration-300 group-hover:bg-gray-200">
                      {contentItems.length > 0 ? Math.round((count / contentItems.length) * 100) : 0}% of total
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3">
                    <div
                      className="bg-gradient-to-r from-[#1565C0] to-[#42A5F5] h-1.5 rounded-full transition-all duration-500 ease-out group-hover:from-[#0D47A1] group-hover:to-[#1976D2]"
                      style={{
                        width: `${contentItems.length > 0 ? Math.round((count / contentItems.length) * 100) : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-xl shadow-lg mb-12 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-200 overflow-x-auto">
            <div className="flex items-center space-x-2 w-full flex-wrap gap-y-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-2 rounded-lg transition-all duration-300 font-medium whitespace-nowrap text-xs ${
                  activeFilter === "all"
                    ? "bg-gradient-to-r from-[#1565C0] to-[#42A5F5] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                All Content ({contentItems.length})
              </button>

              {categoryDetails.map((type) => {
                let count = 0
                if (type.type === "Article") count = articleCount
                else if (type.type === "VideoTutorial") count = videoCount
                else if (type.type === "StepbyStepGuide") count = guideCount
                else if (type.type === "Webinar") count = webinarCount

                return (
                  <button
                    key={type.type}
                    onClick={() => setActiveFilter(type.type)}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 font-medium whitespace-nowrap text-xs ${
                      activeFilter === type.type
                        ? "bg-gradient-to-r from-[#1565C0] to-[#42A5F5] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    {type.label} ({count})
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content table */}
          <div className="overflow-x-auto max-w-full">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Author
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-8 py-5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  // Find matching category based on contentData
                  const category = categoryDetails.find((cat) => cat.type === item.contentData)

                  return (
                    <tr key={item._id} className="hover:bg-blue-50 transition-all duration-300">
                      <td className="px-8 py-6">
                        <div className="text-sm font-medium text-gray-800 hover:text-[#1565C0] transition-colors duration-300">
                          {item.refId?.title}
                        </div>
                        {/* <div className="text-sm text-gray-500 truncate max-w-xs mt-1">{item.refId?.description}</div> */}
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span
                          className={`px-3 py-1.5 text-xs font-semibold rounded-full inline-block transition-all duration-300 ${
                            category ? category.badge : "bg-gray-100 text-gray-800"
                          } hover:shadow-sm`}
                        >
                          {category ? category.label : item.contentData}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-600 text-center">{item.author?.username}</td>
                      <td className="px-6 py-6 text-sm text-gray-600 text-center">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right text-sm font-medium space-x-3 text-center">
                        {/* <Eye onClick={() => handleOpenModalofposts(item)} /> */}
                        <button onClick={()=>navigate(`/update-post/${item.contentData}/${item._id}`)} className="px-3 py-1.5 bg-gradient-to-r from-[#1565C0] to-[#42A5F5] text-white rounded-md transition-all duration-300 hover:shadow-md hover:from-[#0D47A1] hover:to-[#1565C0] text-xs font-medium transform hover:-translate-y-0.5 relative overflow-hidden group">
                          <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></span>
                          <Edit className="h-3.5 w-3.5 inline mr-1.5" />
                          Edit
                        </button>
                        <button onClick={()=>handleDelete(item._id)}className="px-3 py-1.5 bg-gradient-to-r from-[#D32F2F] to-[#F44336] text-white rounded-md transition-all duration-300 hover:shadow-md hover:from-[#B71C1C] hover:to-[#D32F2F] text-xs font-medium transform hover:-translate-y-0.5 relative overflow-hidden group">
                          <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></span>
                          <Trash2 className="h-3.5 w-3.5 inline mr-1.5" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="py-20 text-center text-gray-500">
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Search className="h-10 w-10 text-[#1565C0]" />
              </div>
              <p className="text-lg font-medium text-gray-700">No content found for the selected filter.</p>
              <p className="text-sm mt-2 text-gray-500 max-w-md mx-auto">
                Try selecting a different category or create new content to get started.
              </p>
              <button
                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#1565C0] to-[#42A5F5] text-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 font-medium relative overflow-hidden group"
                onClick={() => setActiveFilter("all")}
              >
                <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></span>
                View All Content
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    {/* {selectedeyebutton && (
        <Previewdata
          post={selectedcontent}
          onHide={handleCloseModalofposts}
          show={true}
        />
      )} */}
    </>

  )
}

export default ManageData
