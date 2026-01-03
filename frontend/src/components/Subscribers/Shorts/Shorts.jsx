import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaComment, FaBookmark, FaRegBookmark, FaShare, FaArrowLeft, FaPlay } from "react-icons/fa";
import { fetchShorts, likeShort, saveShort } from "../../APIServices/subscribe/ShortsApi";
import CommentSection from "../../Subscribers/Shorts/CommentSection";

function ShortsPlayer() {
  const [shorts, setShorts] = useState([]);
  const [currentShortIndex, setCurrentShortIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadShorts = async () => {
      try {
        const data = await fetchShorts();
        setShorts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadShorts();
  }, []);

  if (loading) return <p className="text-white">Loading shorts...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (shorts.length === 0) return <p className="text-white">No shorts available</p>;

  const currentShort = shorts[currentShortIndex];

  const handleNextShort = () => {
    setCurrentShortIndex((prev) => (prev + 1) % shorts.length);
    setLiked(false);
    setSaved(false);
    setShowComments(false);
  };

  const handlePrevShort = () => {
    setCurrentShortIndex((prev) => (prev - 1 + shorts.length) % shorts.length);
    setLiked(false);
    setSaved(false);
    setShowComments(false);
  };

  const toggleLike = async () => {
    try {
      await likeShort(currentShort.id);
      setLiked(!liked);
    } catch (error) {
      console.error("Error liking the short:", error);
    }
  };

  const toggleSave = async () => {
    try {
      await saveShort(currentShort.id);
      setSaved(!saved);
    } catch (error) {
      console.error("Error saving the short:", error);
    }
  };

  const toggleComments = () => setShowComments(!showComments);

  return (
    <div className="h-screen bg-black flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Nicheflare Shorts</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {shorts.map((short, index) => (
            <Link
              to="/shorts"
              key={short.id}
              className="relative group"
              onClick={() => setCurrentShortIndex(index)}
            >
              <div className="aspect-[9/16] overflow-hidden rounded-xl relative">
                <img
                  src={short.thumbnail}
                  alt={short.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <FaPlay className="text-white text-3xl" />
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-medium text-sm line-clamp-2 text-white">{short.title}</h3>
                <p className="text-gray-400 text-xs">{short.views} views</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="relative w-full md:w-2/3 lg:w-3/5 h-full bg-black flex items-center justify-center">
          <Link
            to="/"
            className="absolute top-4 left-4 z-10 text-white p-2 rounded-full bg-black bg-opacity-50"
          >
            <FaArrowLeft size={20} />
          </Link>

          <video
            src={currentShort.videoUrl}
            className="h-full w-full object-contain"
            autoPlay
            loop
            muted
            onClick={handleNextShort}
          />

          <div className="absolute right-4 bottom-20 flex flex-col gap-6">
            <div className="icon-button" onClick={toggleLike}>
              {liked ? (
                <FaHeart size={28} className="text-red-500" />
              ) : (
                <FaRegHeart size={28} className="text-white" />
              )}
              <span className="text-white text-xs mt-1">
                {liked ? parseInt(currentShort.likes) + 1 : currentShort.likes}
              </span>
            </div>

            <div className="icon-button" onClick={toggleComments}>
              <FaComment size={28} className="text-white" />
              <span className="text-white text-xs mt-1">{currentShort.comments}</span>
            </div>

            <div className="icon-button" onClick={toggleSave}>
              {saved ? (
                <FaBookmark size={28} className="text-white" />
              ) : (
                <FaRegBookmark size={28} className="text-white" />
              )}
              <span className="text-white text-xs mt-1">Save</span>
            </div>

            <div className="icon-button">
              <FaShare size={28} className="text-white" />
              <span className="text-white text-xs mt-1">Share</span>
            </div>
          </div>
        </div>
      </div>

      {showComments && <CommentSection shortId={currentShort.id} />}
    </div>
  );
}

export default ShortsPlayer;
