import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { checkAuthStatusAPI } from '../../APIServices/users/usersAPI';
import { useParams, Link } from 'react-router-dom';
import { FaBookmark } from 'react-icons/fa'; // Import the bookmark icon

export default function GuideDetails() {
  const { guideId } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false); 
  const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;

  const { isLoading, data } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
  });

  let userRole = data?.role;

  // Fetch guide details from the API
  const getGuideDetails = async () => {
    try {
      const response = await axios.get(`${BackendServername}/stepbystepguide/${guideId}`, {
        withCredentials: true,
      });

      // console.log('API Response:', response.data.response);

      if (response.status === 200) {
        setGuide(response.data.response);
        const userData = response.data.userData || {};
        setIsBookmarked(userData.bookmarks?.includes(guideId) || true);
      } else {
        throw new Error('Failed to fetch guide details');
      }
    } catch (error) {
      console.error('Error fetching guide details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle bookmark function
  const toggleBookmark = async () => {
    try {
      const endpoint = isBookmarked 
        ? `${BackendServername}/posts/${guideId}/unbookmark`
        : `${BackendServername}/posts/${guideId}/bookmark`;
      
      const response = await axios.post(endpoint, {}, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setIsBookmarked((prev) => !prev);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  useEffect(() => {
    getGuideDetails();
  }, [guideId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!guide) {
    return <div>No guide found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            to={`/${userRole}/stepbystepguide`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            &larr; Back to Guides
          </Link>
          
          <button 
            onClick={toggleBookmark}
            className={`flex items-center gap-2 ${
              isBookmarked ? "text-blue-600" : "text-gray-600"
            } hover:text-blue-500 border rounded-full p-2 transition-all duration-300 hover:bg-gray-200`}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <FaBookmark className="text-xl" />
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {guide.refId.title}
        </h1>
        <p className="text-gray-600 mb-8">{guide.refId.description}</p>

        
        <div className="space-y-8">
          {guide.refId.steps.map((step, index) => (
            <div key={step._id} className="border-t pt-8 first:border-t-0 first:pt-0">
              <div className="flex items-start">
               
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white font-bold">
                    {index + 1}
                  </span>
                </div>

                
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.stepTitle}
                  </h3>
                  <p className="text-gray-600 mb-4">{step.stepDescription}</p>

                 
                  {step.stepMedia && (
                    <div className="mt-4">
                      {step.stepMedia.includes('video') ? (
                        <video
                          controls
                          className="w-full rounded-lg shadow-lg"
                          src={step.stepMedia}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={step.stepMedia}
                          alt={`Step ${index + 1}`}
                          className="w-full rounded-lg shadow-lg"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}