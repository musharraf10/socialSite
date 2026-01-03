import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { htmlToText } from "html-to-text";
import axios from "axios"; 
import truncateString from "../../utils/truncateString";
import { deletePostAPI } from "../../APIServices/posts/postsAPI";
import { BASE_URL } from "../../utils/baseEndpoint";

const DashboardPosts = () => {
  
  const [userPosts, setUserPosts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/posts/ownerposts`);
        setUserPosts(response.data);
        console.log("Response", response.data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  // Delete mutation
  const deletePostMutation = useMutation({
    mutationFn: deletePostAPI,
    onSuccess: () => {
      setUserPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    },
  });

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    try {
      await deletePostMutation.mutateAsync(postId);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  // Loading state
  if (loading) return <div>Loading...</div>;

  // Error state
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <section className="py-8">
      {userPosts.length === 0 ? (
        <div>No posts yet</div>
      ) : (
        <section className="py-8">
          <div className="container px-4 mx-auto">
            <div className="pt-4 bg-white shadow rounded">
              <div className="flex px-6 pb-4 border-b">
                <h3 className="text-xl font-bold">
                  Your Posts ({userPosts.length})
                </h3>
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="table-auto w-full">
                  <thead>
                    <tr className="text-xs text-gray-500 text-left">
                      <th className="pb-3 font-medium">Post</th>
                      <th className="pb-3 font-medium">This Month Earnings</th>
                      <th className="pb-3 font-medium">Total Earnings</th>
                      <th className="pb-3 font-medium">Date Created</th>
                      <th className="pb-3 font-medium">Upcoming Earning Date</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userPosts.map((post) => (
                      <tr key={post._id} className="text-xs bg-gray-50">
                        <td className="py-5 px-6 font-medium flex items-center space-x-2">
                          <img
                            src={post.image}
                            alt="Post"
                            className="w-10 h-10 object-cover rounded-full"
                          />
                          <div>{truncateString(htmlToText(post.description), 10)}</div>
                        </td>
                        <td className="font-medium">${post.thisMonthEarnings || 0}</td>
                        <td className="font-medium">${post.totalEarnings || 0}</td>
                        <td className="font-medium">
                          {new Date(post.createdAt).toDateString()}
                        </td>
                        <td>
                          <span className="inline-block py-1 px-2 text-white bg-green-500 rounded-full">
                            {new Date(post.nextEarningDate).toDateString()}
                          </span>
                        </td>
                        <td className="flex items-center space-x-2">
                          <Link to={`/dashboard/update-post/${post._id}`}>
                            <FiEdit className="text-green-500 cursor-pointer" />
                          </Link>
                          <button onClick={() => handleDeletePost(post._id)}>
                            <FiTrash2 className="text-red-500 cursor-pointer" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
    </section>
  );
};

export default DashboardPosts;
