import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import "./postCss.css";
import { deletePostAPI, fetchAllPosts } from "../../APIServices/posts/postsAPI";
import { Link } from "react-router-dom";
import NoDataFound from "../Alert/NoDataFound";
import AlertMessage from "../Alert/AlertMessage";
import { FaSearch, FaBookmark, FaLock, FaCrown,FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import { MdClear } from "react-icons/md";
import truncateString from "../../utils/truncateString";
import { useLocation, useNavigate} from "react-router-dom";
import PublicNavbar from "../Navbar/PublicNavbar";
import axios from "axios";

import { loadStripe } from '@stripe/stripe-js';
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PostsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [page, setPage] = useState(1);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const [planName, setPlanName] = useState("");
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();
  const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;


  const getPlan = async () => {
    try {
      const response = await axios.get(`${BackendServername}/users/currentplan`, {
        withCredentials: true,
      });

      console.log("Fetched Plan:", response.data.data);
      setPlanName(response.data.data);
    } catch (error) {
      console.error("Error fetching plan:", error);
    }
  };

  useEffect(() => {
    getPlan();
  }, []);

  useEffect(() => {
    setIsUserSubscribed(planName);
  }, [planName]);


  const handleContent = async (postId, price) => {
    const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

    try {
      const response = await axios.post(
        `${BackendServername}/payments/create-checkout-session`,
        {
          postId,
          price,
        },
        { withCredentials: true }
      );

      const { sessionId } = response.data;
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const location = useLocation();
  const showHeaderFooter = location.pathname.includes("/posts");

  const { isError, isLoading, data, error, isSuccess, refetch } = useQuery({
    queryKey: ["lists-posts", { page }],
    queryFn: () =>
      fetchAllPosts(),
  });

  useEffect(() => {
    if (data?.posts) {
      let results = data.posts;
      
      // Apply search filter
      if (searchTerm) {
        results = results.filter(post =>
          post.refId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply first letter filter
      if (selectedLetter) {
        results = results.filter(post =>
          post.refId?.title?.startsWith(selectedLetter)
        );
      }

      setFilteredResults(results);
    }
  }, [searchTerm, selectedLetter, data]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Get unique first letters of posts
  const uniqueLetters = [...new Set(data?.posts?.map(post => post.refId?.title?.[0]?.toUpperCase() || ""))].sort();

  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch();
  };

  // Fixed clearFilters function - removed reference to setFilters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLetter("");
    setPage(1);
    refetch();
  };

  const postMutation = useMutation({
      mutationKey: ["delete-post"],
      mutationFn: deletePostAPI,
      onSuccess: () => {
        refetch()
      },
    })
  
  const handleDeletePost = (postId, e) => {
      e.stopPropagation()
      if (window.confirm("Are you sure you want to delete this post?")) {
        postMutation.mutate(postId)
      }
      setOpenMenuId(null)
    }

  const isPremiumPost = (post) => {
    return post.price > 0;
  };

  const renderPagination = () => {
    if (!data || !data.totalPages) return null;

    const totalPages = data.totalPages;
    const buttons = [];

    // Previous button
    buttons.push(
      <button
        key="prev"
        className="page-button"
        onClick={() => handlePageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        &lt;
      </button>
    );

    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - 1 && i <= page + 1)
      ) {
        buttons.push(
          <button
            key={i}
            className={`page-button ${page === i ? 'active' : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      } else if (
        (i === page - 2 && page > 3) ||
        (i === page + 2 && page < totalPages - 2)
      ) {
        buttons.push(<span key={`ellipsis-${i}`}>...</span>);
      }
    }

    // Next button
    buttons.push(
      <button
        key="next"
        className="page-button"
        onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        &gt;
      </button>
    );

    return <div className="pagination">{buttons}</div>;
  };

  // Added null checks for filteredResults
  const premiumPosts = filteredResults?.filter(isPremiumPost) || [];
  const nonPremiumPosts = filteredResults?.filter(post => !isPremiumPost(post)) || [];

  return (
    <>
      {showHeaderFooter && <PublicNavbar />}
      <section className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="pt-16 pb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center"
            >
              Discover Our Latest Content
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="text-lg text-gray-600 max-w-3xl mx-auto text-center"
            >
              Explore our collection of articles, tutorials, and resources to help you stay informed and inspired.
            </motion.p>
          </div>
          <div className="relative flex items-center justify-center mt-6">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative mb-5 flex items-center w-full max-w-lg bg-gradient-to-r from-blue-50 to-blue-100 rounded-full shadow-lg border border-gray-300 transition-all focus-within:border-blue-600 focus-within:shadow-xl"
            >
              <FaSearch className="absolute left-4 text-blue-600 text-lg animate-pulse" />
              <input
                type="text"
                placeholder="Search for content..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full py-3 pl-12 pr-12 text-gray-700 placeholder-gray-500 bg-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="absolute right-3 text-gray-500 hover:text-red-500 transition-transform transform hover:scale-110"
                  onClick={clearFilters}
                >
                  <MdClear className="text-xl" />
                </button>
              )}
            </form>
          </div>

          {/* Letter Filter */}
          <div className="flex flex-wrap gap-2 justify-center my-4">
            {uniqueLetters.map(letter => (
              <button
                key={letter}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  selectedLetter === letter ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
                onClick={() => setSelectedLetter(letter)}
              >
                {letter}
              </button>
            ))}
            {selectedLetter && (
              <button
                className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold"
                onClick={clearFilters}
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Error and Loading States */}
          {isError && <AlertMessage type="error" message="Something happened" />}

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : filteredResults.length === 0 ? (
            <NoDataFound text="No Posts Found" />
          ) : (
            <>
              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {nonPremiumPosts?.map((post) => {
                  const isPremium = isPremiumPost(post);
                  const isBookmarked = bookmarkedPosts.includes(post._id);

                  return (
                    <div key={post._id} className="post-card bg-white"
                    style={{
                      position: "relative",
                      borderRadius: "8px",
                      overflow: "hidden",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      border: "1px solid #e5e7eb",
                    }}>
                      {isPremium && (
                        <div className="premium-badge"
                        style={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                          background: "#2563EB",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          zIndex: 5,
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}>
                          <FaCrown />
                        </div>
                      )}
                      <div className="post-image-container" style={{ position: "relative" }}>
                          <img
                              className="post-image"
                              src={post.refId?.thumbnail || "/default-image.jpg"}
                              alt={post?.price || "Post image"}
                              style={{ width: "100%", height: "200px", objectFit: "cover" }}
                          />
                      </div>

                      {isPremium && !isUserSubscribed && (
                        <div className="premium-overlay">
                          <FaLock className="premium-lock-icon" />
                          <p className="premium-message">
                            This is premium content. Subscribe or buy this post to unlock.
                          </p>
                          <button
                            className="unlock-button"
                            onClick={() => handleContent(post._id, post.price)}
                          >
                            Buy Post for ${post.price}
                          </button>
                        </div>
                      )}
                      <Link
                        to={`/posts/${post._id}`}
                        className="block"
                      >
                        <div className="post-content">
                        <h3 className="post-title">
                           {post?.refId?.title || "Untitled Post"}
                        </h3>
                          <p className="post-excerpt">
                            {truncateString(post?.description || "", 120)}
                          </p>
                          <div className="post-meta">
                            <span className="post-date">
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span className={`post-status ${
                              post?.status === 'published' ? 'status-published' : 'status-draft'
                            }`}>
                              {post?.contentData}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Premium Posts */}
              {premiumPosts?.length > 0 && (
                <div className="pt-8">
                  <h2 className="text-3xl font-semibold text-gray-900 mt-3">Premium Content</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 mt-5">
                    {premiumPosts?.map((post) => {
                      const isBookmarked = bookmarkedPosts.includes(post._id);
                      return (
                        <div key={post._id} className="post-card bg-white" style={{position: "relative"}}
                        >
                          <div className="absolute top-2 left-2 p-1 text-yellow-500 z-10">
                            <FaCrown />
                          </div>
                          <div className="post-image-container" style={{ position: "relative" }}>
                            <img
                              className="post-image"
                              src={post?.refId?.thumbnail || "/default-image.jpg"}
                              alt={post?.price || "Post image"}
                              style={{ width: "100%", height: "200px", objectFit: "cover" }}
                            />
                            
                          </div>
                          {isPremiumPost(post) && !isUserSubscribed && (
                            <div className="premium-overlay">
                              <FaLock className="premium-lock-icon" />
                              <p className="premium-message">
                                This is premium content. Subscribe to unlock.
                              </p>
                              <button
                                className="unlock-button"
                                onClick={() => handleContent(post._id, post.price)}
                              >
                                Subscribe Now
                              </button>
                            </div>
                          )}
                          <Link to={`/posts/${post._id}`} className="block">
                            <div className="post-content">
                              <h3 className="post-title">{post?.refId?.title || "Untitled post"}</h3>
                              <p className="post-excerpt">
                                {truncateString(post?.description || "", 120)}
                              </p>
                              <div className="post-meta">
                                <span className="post-date">
                                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                                <span className={`post-status ${
                                    post?.status === 'published' ? 'status-published' : 'status-draft'
                                  }`}>
                                    {post?.contentData}
                               </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default PostsList;