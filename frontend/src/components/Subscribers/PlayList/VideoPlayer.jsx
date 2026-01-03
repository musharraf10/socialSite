import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, Pause, Volume2, VolumeX, SkipForward, ThumbsUp, ThumbsDown, 
  Bookmark, Share2, MessageSquare, X, ChevronUp, ChevronDown 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const VideoPlayer = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const commentInputRef = useRef(null);
  
  const [playlist, setPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userReaction, setUserReaction] = useState(null); // 'like', 'dislike', or null
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  
  // Fetch playlist and videos
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/playlists/${playlistId}`);
        
        if (!response.data || !response.data.isPublished) {
          setError('Playlist not found or not available');
          setLoading(false);
          return;
        }
        
        setPlaylist(response.data);
        setVideos(response.data.videos || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching playlist:', error);
        setError('Failed to load playlist');
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  // Fetch current video comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!videos.length || currentVideoIndex >= videos.length) return;
      
      try {
        const videoId = videos[currentVideoIndex]._id;
        const response = await axios.get(`/api/videos/${videoId}/comments`);
        setComments(response.data || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [videos, currentVideoIndex]);

  // Check if current video is bookmarked
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!videos.length || currentVideoIndex >= videos.length) return;
      
      try {
        const videoId = videos[currentVideoIndex]._id;
        const response = await axios.get(`/api/videos/${videoId}/bookmark`);
        setIsBookmarked(response.data.isBookmarked);
      } catch (error) {
        console.error('Error checking bookmark status:', error);
        setIsBookmarked(false);
      }
    };

    checkBookmarkStatus();
  }, [videos, currentVideoIndex]);

  // Check user reaction (like/dislike)
  useEffect(() => {
    const checkUserReaction = async () => {
      if (!videos.length || currentVideoIndex >= videos.length) return;
      
      try {
        const videoId = videos[currentVideoIndex]._id;
        const response = await axios.get(`/api/videos/${videoId}/reaction`);
        setUserReaction(response.data.reaction); // 'like', 'dislike', or null
      } catch (error) {
        console.error('Error checking user reaction:', error);
        setUserReaction(null);
      }
    };

    checkUserReaction();
  }, [videos, currentVideoIndex]);

  // Handle video play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  // Handle video progress updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle seeking
  const handleSeek = (e) => {
    if (videoRef.current) {
      const seekTime = parseFloat(e.target.value);
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Load video metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Format time (seconds -> MM:SS)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Play next video
  const playNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setCurrentTime(0);
      // Video will autoplay when loaded
    }
  };

  // Handle video ended (for autoplay)
  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (isAutoPlayEnabled && currentVideoIndex < videos.length - 1) {
      playNextVideo();
    }
  };

  // Switch to a specific video
  const switchToVideo = (index) => {
    setCurrentVideoIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // Submit a comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    try {
      const videoId = videos[currentVideoIndex]._id;
      const response = await axios.post(`/api/videos/${videoId}/comments`, {
        content: newComment
      });
      
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    }
  };

  // Toggle bookmark
  const toggleBookmark = async () => {
    try {
      const videoId = videos[currentVideoIndex]._id;
      await axios.post(`/api/videos/${videoId}/bookmark`, {
        isBookmarked: !isBookmarked
      });
      
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('Failed to update bookmark');
    }
  };

  // Handle like/dislike
  const handleReaction = async (reaction) => {
    try {
      const videoId = videos[currentVideoIndex]._id;
      await axios.post(`/api/videos/${videoId}/reaction`, {
        reaction: userReaction === reaction ? null : reaction
      });
      
      setUserReaction(userReaction === reaction ? null : reaction);
    } catch (error) {
      console.error('Error setting reaction:', error);
      alert('Failed to update reaction');
    }
  };

  // Toggle comments visibility
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // Share video
  const shareVideo = () => {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: videos[currentVideoIndex]?.title || 'Shared video',
        text: 'Check out this video!',
        url: url
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
      }).catch(err => {
        console.error('Error copying to clipboard:', err);
      });
    }
  };

  // Toggle autoplay
  const toggleAutoPlay = () => {
    setIsAutoPlayEnabled(!isAutoPlayEnabled);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-xl">Loading playlist...</div>
      </div>
    );
  }

  if (error || !videos.length) {
    return (
      <div className="w-full h-screen flex items-center justify-center flex-col gap-4">
        <div className="text-xl text-red-600">{error || 'No videos available in this playlist'}</div>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const currentVideo = videos[currentVideoIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player Column */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={currentVideo.videoUrl}
              className="w-full aspect-video"
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleVideoEnded}
              poster={currentVideo.thumbnailUrl}
            />
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              {/* Progress Bar */}
              <div className="mb-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 rounded-full"
                />
                <div className="flex justify-between text-white text-xs mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              
              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Play/Pause Button */}
                  <button onClick={togglePlay} className="text-white p-1">
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  
                  {/* Next Video Button */}
                  <button 
                    onClick={playNextVideo} 
                    className="text-white p-1"
                    disabled={currentVideoIndex >= videos.length - 1}
                  >
                    <SkipForward size={20} />
                  </button>
                  
                  {/* Volume Controls */}
                  <div className="relative">
                    <button 
                      onClick={toggleMute} 
                      onMouseEnter={() => setShowVolumeControl(true)}
                      className="text-white p-1"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    
                    {showVolumeControl && (
                      <div 
                        className="absolute bottom-8 left-0 bg-gray-800 p-2 rounded-md"
                        onMouseEnter={() => setShowVolumeControl(true)}
                        onMouseLeave={() => setShowVolumeControl(false)}
                      >
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-24 h-2 rounded-full rotate-90 origin-left translate-x-4 translate-y-8"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Autoplay Toggle */}
                <div className="flex items-center text-white text-xs">
                  <span className="mr-2">Autoplay</span>
                  <button 
                    onClick={toggleAutoPlay}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full ${isAutoPlayEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isAutoPlayEnabled ? 'translate-x-5' : 'translate-x-1'}`} 
                    />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Big Play Button (visible when paused) */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={togglePlay}
                  className="bg-white/20 rounded-full p-5 text-white hover:bg-white/30 transition-colors"
                >
                  <Play size={40} />
                </button>
              </div>
            )}
          </div>
          
          {/* Video Information */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold">{currentVideo.title}</h1>
            <p className="text-gray-500 mt-1">
              From playlist: {playlist.title}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between mt-4 border-b pb-4">
              <div className="flex space-x-4">
                {/* Like Button */}
                <button 
                  onClick={() => handleReaction('like')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full ${
                    userReaction === 'like' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp size={18} />
                  <span>{userReaction === 'like' ? 'Liked' : 'Like'}</span>
                </button>
                
                {/* Dislike Button */}
                <button 
                  onClick={() => handleReaction('dislike')}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full ${
                    userReaction === 'dislike' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <ThumbsDown size={18} />
                  <span>{userReaction === 'dislike' ? 'Disliked' : 'Dislike'}</span>
                </button>
                
                {/* Bookmark Button */}
                <button 
                  onClick={toggleBookmark}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full ${
                    isBookmarked ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Bookmark size={18} />
                  <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>
              </div>
              
              {/* Share Button */}
              <button 
                onClick={shareVideo}
                className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-gray-100"
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>
            
            {/* Video Description */}
            <div className="mt-4">
              <p className="text-gray-800 whitespace-pre-line">
                {currentVideo.description || 'No description provided.'}
              </p>
            </div>
            
            {/* Comments Section */}
            <div className="mt-6">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={toggleComments}
              >
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <MessageSquare size={20} />
                  Comments ({comments.length})
                </h3>
                {showComments ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              
              {showComments && (
                <div className="mt-4">
                  {/* Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="mb-6">
                    <div className="flex gap-2">
                      <input
                        ref={commentInputRef}
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
                      >
                        Comment
                      </button>
                    </div>
                  </form>
                  
                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment._id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                              {comment.user.avatar ? (
                                <img 
                                  src={comment.user.avatar} 
                                  alt={comment.user.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white">
                                  {comment.user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{comment.user.name}</p>
                              <p className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-800">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Playlist Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-100 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">
              {playlist.title} ({videos.length} videos)
            </h2>
            
            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 videoslist">
              {videos.map((video, index) => (
                <div 
                  key={video._id}
                  onClick={() => switchToVideo(index)}
                  className={`flex gap-3 p-2 rounded cursor-pointer ${
                    currentVideoIndex === index ? 'bg-blue-100' : 'hover:bg-gray-200'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-12 bg-gray-300 rounded overflow-hidden">
                      {video.thumbnailUrl ? (
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xs">
                          No Thumb
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                      {formatTime(video.duration || 0)}
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <p className={`line-clamp-2 text-sm ${currentVideoIndex === index ? 'font-medium' : ''}`}>
                      {video.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;