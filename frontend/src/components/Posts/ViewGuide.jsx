import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { checkAuthStatusAPI } from '../../APIServices/users/usersAPI';
import { FaLock, FaCrown } from 'react-icons/fa';

export default function Home() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const [planName, setPlanName] = useState("");
  const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;

  // Fetch guides from the API
  const getdata = async () => {
    try {
      const response = await axios.get(`${BackendServername}/stepbystepguide`, {
        withCredentials: true,
      });

      console.log('API Response:', response.data);

      if (response.status === 200) {
        if (Array.isArray(response.data.response)) {
          setGuides(response.data.response);
        } else {
          throw new Error('API response is not an array');
        }
      } else {
        throw new Error('Failed to fetch guides');
      }
    } catch (error) {
      console.error('Error fetching guides:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's current plan
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

  // Set up Stripe payment
  const handleContent = async (guideId, price) => {
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

      const response = await axios.post(
        `${BackendServername}/payments/create-checkout-session`,
        {
          guideId,
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

  const { isLoading, data } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
  });

  let userRole = data?.role;

  useEffect(() => {
    getdata();
    getPlan();
  }, []);

  useEffect(() => {
    setIsUserSubscribed(planName);
  }, [planName]);

  // Function to check if a guide is premium
  const isPremiumGuide = (guide) => {
    return guide.price > 0;
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  }

  if (!Array.isArray(guides) || guides.length === 0) {
    return <div className="text-center p-8 text-gray-600">No guides found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Guides</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => {
            const isPremium = isPremiumGuide(guide);
            
            return (
              <div
                key={guide._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
              >
                {/* Premium Badge */}
                {isPremium && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
                    <FaCrown className="text-yellow-300" />
                    <span>Premium</span>
                  </div>
                )}

                {/* Thumbnail Image */}
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={guide.refId.thumbnail}
                    alt={guide.refId.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Premium Overlay */}
                  {isPremium && !isUserSubscribed && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white p-4">
                      <FaLock className="text-3xl mb-2" />
                      <p className="text-center mb-4">
                        This is premium content. Subscribe or buy to unlock.
                      </p>
                      <button
                        onClick={() => handleContent(guide._id, guide.price)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        {guide.price ? `Buy for $${guide.price}` : 'Subscribe Now'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Guide Title and Description */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {guide.refId.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{guide.refId.description}</p>

                  {/* View Details Button */}
                  {isPremium && !isUserSubscribed ? (
                    <button
                      onClick={() => handleContent(guide._id, guide.price)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Unlock Content
                    </button>
                  ) : (
                    <Link
                      to={`/${userRole}/guide/${guide._id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}