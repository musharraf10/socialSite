import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, ChevronUp, User, Play, Pause } from 'lucide-react';

// Sample data for demonstration
const sampleVideos = [
  {
    id: '1',
    videoUrl: '/api/placeholder/400/720', // Placeholder for actual video
    creator: {
      name: 'JaneCreator',
      avatar: null,
      id: '101'
    },
    title: 'Amazing sunset at the beach',
    description: 'Caught this incredible moment while traveling. Double tap if you love sunsets! #travel #sunset #beach',
    likes: 1243,
    comments: 89,
    shares: 45
  },
  {
    id: '2',
    videoUrl: '/api/placeholder/400/720',
    creator: {
      name: 'TravelExplorer',
      avatar: null,
      id: '102'
    },
    title: 'Mountain hiking adventure',
    description: 'Reached the summit after 4 hours of hiking. The view was totally worth it! #hiking #mountains #adventure',
    likes: 892,
    comments: 56,
    shares: 23
  },
  {
    id: '3',
    videoUrl: '/api/placeholder/400/720',
    creator: {
      name: 'FoodieDelights',
      avatar: null,
      id: '103'
    },
    title: 'How to make perfect pasta',
    description: 'Secret tip: Add a bit of the pasta water to your sauce for that restaurant quality finish! #cooking #pasta #foodie',
    likes: 3421,
    comments: 156,
    shares: 78
  }
];

const VideoShorts = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [startY, setStartY] = useState(null);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  // Prepare refs for each video
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, sampleVideos.length);
  }, []);

  // Handle play/pause
  const togglePlayPause = () => {
    const video = videoRefs.current[currentVideoIndex];
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle swipe navigation
  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (startY === null) return;
    
    const endY = e.changedTouches[0].clientY;
    const diff = startY - endY;
    
    // If swipe distance is significant (more than 50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentVideoIndex < sampleVideos.length - 1) {
        // Swipe up - go to next video
        setCurrentVideoIndex(currentVideoIndex + 1);
      } else if (diff < 0 && currentVideoIndex > 0) {
        // Swipe down - go to previous video
        setCurrentVideoIndex(currentVideoIndex - 1);
      }
    }
    
    setStartY(null);
  };

  // Handle video changes
  useEffect(() => {
    // Pause all videos
    videoRefs.current.forEach(video => {
      if (video) video.pause();
    });
    
    // Play the current video
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      currentVideo.play();
      setIsPlaying(true);
    }
    
    // Scroll to the current video
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: currentVideoIndex * window.innerHeight,
        behavior: 'smooth'
      });
    }
  }, [currentVideoIndex]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full bg-black overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-full">
        {sampleVideos.map((video, index) => (
          <div 
            key={video.id}
            className={`absolute inset-0 h-full w-full ${index === currentVideoIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {/* Video */}
            <div className="relative h-full w-full" onClick={togglePlayPause}>
              <video
                ref={el => videoRefs.current[index] = el}
                src={video.videoUrl}
                className="h-full w-full object-cover"
                loop
                muted
              />
              
              {/* Play/Pause indicator */}
              {!isPlaying && index === currentVideoIndex && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full p-4">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              {/* Creator info */}
              <div className="flex items-center mb-3">
                <div className="bg-gray-600 rounded-full h-10 w-10 flex items-center justify-center mr-2">
                  {video.creator.avatar ? (
                    <img src={video.creator.avatar} alt={video.creator.name} className="rounded-full" />
                  ) : (
                    <User className="text-white" />
                  )}
                </div>
                <span className="font-medium">@{video.creator.name}</span>
                <button className="ml-2 bg-red-600 text-white text-sm px-4 py-1 rounded-full">
                  Follow
                </button>
              </div>
              
              {/* Video description */}
              <div className="mb-12">
                <h3 className="font-bold mb-1">{video.title}</h3>
                <p className="text-sm">{video.description}</p>
              </div>
            </div>

            {/* Side actions */}
            <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
              <div className="flex flex-col items-center">
                <button className="bg-gray-800 rounded-full p-2 mb-1">
                  <Heart className="w-6 h-6 text-white" />
                </button>
                <span className="text-white text-xs">{formatNumber(video.likes)}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <button className="bg-gray-800 rounded-full p-2 mb-1">
                  <MessageCircle className="w-6 h-6 text-white" />
                </button>
                <span className="text-white text-xs">{formatNumber(video.comments)}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <button className="bg-gray-800 rounded-full p-2 mb-1">
                  <Share2 className="w-6 h-6 text-white" />
                </button>
                <span className="text-white text-xs">{formatNumber(video.shares)}</span>
              </div>
              
              <button className="bg-gray-800 rounded-full p-2">
                <MoreVertical className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation indicator */}
      <div className="absolute top-4 left-0 right-0 flex justify-center text-white">
        <div className="flex items-center">
          <ChevronUp className="w-5 h-5 mr-1" />
          <span className="text-sm">Swipe for next video</span>
        </div>
      </div>
    </div>
  );
};

export default VideoShorts;