import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusCircle, Edit2, Trash2, Upload, Save, X, Eye } from 'lucide-react';

const PlaylistCreator = () => {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [playlistId, setPlaylistId] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showAddVideoForm, setShowAddVideoForm] = useState(false);

  // Fetch creator's playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/playlists/creator');
        setPlaylists(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        toast.error('Failed to load playlists');
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  // Fetch videos for a specific playlist
  const fetchPlaylistVideos = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/playlists/${id}`);
      setTitle(response.data.title);
      setDescription(response.data.description);
      setVideos(response.data.videos);
      setIsPublished(response.data.isPublished);
      setPlaylistId(id);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching playlist videos:', error);
      toast.error('Failed to load playlist videos');
      setLoading(false);
    }
  };

  // Handle video upload
  const handleVideoUpload = async (e) => {
    e.preventDefault();
    
    if (!videoFile || !videoTitle) {
      toast.error('Please provide a video file and title');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', videoTitle);
    formData.append('description', videoDescription);
    
    if (videoThumbnail) {
      formData.append('thumbnail', videoThumbnail);
    }
    
    if (editingVideo) {
      formData.append('videoId', editingVideo._id);
    }

    try {
      setIsUploading(true);
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      };

      let response;
      if (editingVideo) {
        response = await axios.put(`/api/videos/${editingVideo._id}`, formData, config);
        setVideos(videos.map(v => v._id === editingVideo._id ? response.data : v));
        toast.success('Video updated successfully');
      } else {
        response = await axios.post(`/api/playlists/${playlistId}/videos`, formData, config);
        setVideos([...videos, response.data]);
        toast.success('Video added successfully');
      }
      
      resetVideoForm();
      setIsUploading(false);
      setUploadProgress(0);
      setShowAddVideoForm(false);
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video');
      setIsUploading(false);
    }
  };

  // Reset video form
  const resetVideoForm = () => {
    setVideoFile(null);
    setVideoTitle('');
    setVideoDescription('');
    setVideoThumbnail(null);
    setEditingVideo(null);
    setUploadProgress(0);
  };

  // Create or update playlist
  const handleSavePlaylist = async () => {
    if (!title) {
      toast.error('Please provide a playlist title');
      return;
    }

    try {
      setLoading(true);
      const playlistData = {
        title,
        description,
        isPublished
      };

      let response;
      if (playlistId) {
        response = await axios.put(`/api/playlists/${playlistId}`, playlistData);
        toast.success('Playlist updated successfully');
      } else {
        response = await axios.post('/api/playlists', playlistData);
        setPlaylistId(response.data._id);
        setPlaylists([...playlists, response.data]);
        toast.success('Playlist created successfully');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error saving playlist:', error);
      toast.error('Failed to save playlist');
      setLoading(false);
    }
  };

  // Handle publish/unpublish
  const handlePublishToggle = async () => {
    try {
      setLoading(true);
      await axios.put(`/api/playlists/${playlistId}/publish`, { isPublished: !isPublished });
      setIsPublished(!isPublished);
      toast.success(isPublished ? 'Playlist unpublished' : 'Playlist published');
      setLoading(false);
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Failed to update publish status');
      setLoading(false);
    }
  };

  // Handle reordering of videos
  const handleDragEnd = useCallback(async (result) => {
    if (!result.destination) return;
    
    const items = Array.from(videos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setVideos(items);
    
    try {
      await axios.put(`/api/playlists/${playlistId}/reorder`, { 
        videoIds: items.map(item => item._id) 
      });
    } catch (error) {
      console.error('Error reordering videos:', error);
      toast.error('Failed to save new order');
    }
  }, [videos, playlistId]);

  // Delete video
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    try {
      await axios.delete(`/api/videos/${videoId}`);
      setVideos(videos.filter(video => video._id !== videoId));
      toast.success('Video deleted successfully');
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video');
    }
  };

  // Edit video
  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setVideoTitle(video.title);
    setVideoDescription(video.description || '');
    setShowAddVideoForm(true);
  };

  // Create new playlist
  const handleNewPlaylist = () => {
    setPlaylistId(null);
    setTitle('');
    setDescription('');
    setVideos([]);
    setIsPublished(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Playlist Creator Studio</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with playlists */}
        <div className="lg:col-span-1 bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Playlists</h2>
            <button 
              onClick={handleNewPlaylist}
              className="p-2 bg-blue-500 text-white rounded-full"
              title="Create New Playlist"
            >
              <PlusCircle size={20} />
            </button>
          </div>
          
          {loading && playlists.length === 0 ? (
            <p>Loading playlists...</p>
          ) : (
            <ul className="space-y-2">
              {playlists.map(playlist => (
                <li 
                  key={playlist._id}
                  className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${playlistId === playlist._id ? 'bg-gray-200' : ''}`}
                  onClick={() => fetchPlaylistVideos(playlist._id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="truncate">{playlist.title}</span>
                    {playlist.isPublished ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Published</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">Draft</span>
                    )}
                  </div>
                </li>
              ))}
              {playlists.length === 0 && !loading && (
                <p className="text-gray-500 text-sm">No playlists yet. Create your first one!</p>
              )}
            </ul>
          )}
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
          {/* Playlist details */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {playlistId ? 'Edit Playlist' : 'Create New Playlist'}
              </h2>
              {playlistId && (
                <div className="flex gap-2">
                  <button
                    onClick={handlePublishToggle}
                    className={`px-4 py-2 rounded ${isPublished ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}
                    disabled={loading || videos.length === 0}
                  >
                    {isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => window.open(`/playlist/${playlistId}`, '_blank')}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded flex items-center gap-1"
                    disabled={!playlistId}
                  >
                    <Eye size={16} /> Preview
                  </button>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="title">Playlist Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter playlist title"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded h-24"
                  placeholder="Enter playlist description"
                />
              </div>
              
              <button
                onClick={handleSavePlaylist}
                disabled={loading || !title}
                className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
              >
                <Save size={16} /> Save Playlist
              </button>
            </div>
          </div>
          
          {/* Videos Section */}
          {playlistId && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Videos</h3>
                <button
                  onClick={() => setShowAddVideoForm(!showAddVideoForm)}
                  className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2"
                  disabled={!playlistId}
                >
                  {showAddVideoForm ? (
                    <>
                      <X size={16} /> Cancel
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} /> Add Video
                    </>
                  )}
                </button>
              </div>
              
              {/* Add/Edit Video Form */}
              {showAddVideoForm && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-medium mb-3">
                    {editingVideo ? 'Edit Video' : 'Add New Video'}
                  </h4>
                  
                  <form onSubmit={handleVideoUpload} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1" htmlFor="videoTitle">Video Title</label>
                      <input
                        type="text"
                        id="videoTitle"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter video title"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1" htmlFor="videoDescription">Description</label>
                      <textarea
                        id="videoDescription"
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        className="w-full p-2 border rounded h-20"
                        placeholder="Enter video description"
                      />
                    </div>
                    
                    {!editingVideo && (
                      <div>
                        <label className="block text-gray-700 mb-1" htmlFor="videoFile">Video File</label>
                        <input
                          type="file"
                          id="videoFile"
                          accept="video/*"
                          onChange={(e) => setVideoFile(e.target.files[0])}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-gray-700 mb-1" htmlFor="thumbnailFile">Thumbnail Image (Optional)</label>
                      <input
                        type="file"
                        id="thumbnailFile"
                        accept="image/*"
                        onChange={(e) => setVideoThumbnail(e.target.files[0])}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    
                    {isUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                        <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
                      >
                        <Upload size={16} />
                        {editingVideo ? 'Update Video' : 'Upload Video'}
                      </button>
                      
                      {editingVideo && (
                        <button
                          type="button"
                          onClick={resetVideoForm}
                          className="px-4 py-2 bg-gray-600 text-white rounded"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
              
              {/* Video List */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="videos">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {videos.length === 0 ? (
                        <p className="text-gray-500 p-4 border border-dashed rounded text-center">
                          No videos in this playlist yet. Add your first video!
                        </p>
                      ) : (
                        videos.map((video, index) => (
                          <Draggable key={video._id} draggableId={video._id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-4 bg-gray-50 rounded-lg flex flex-col sm:flex-row gap-3 items-start sm:items-center border"
                              >
                                <div className="font-medium text-gray-700 w-6">{index + 1}.</div>
                                
                                <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                  {video.thumbnailUrl ? (
                                    <img 
                                      src={video.thumbnailUrl} 
                                      alt={video.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                      <span className="text-xs text-gray-600">No Thumb</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-grow">
                                  <h4 className="font-medium">{video.title}</h4>
                                  {video.description && (
                                    <p className="text-sm text-gray-600 truncate">{video.description}</p>
                                  )}
                                </div>
                                
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditVideo(video)}
                                    className="p-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                    title="Edit Video"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  
                                  <button
                                    onClick={() => handleDeleteVideo(video._id)}
                                    className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    title="Delete Video"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistCreator;