import React, { useEffect, useState } from 'react';
import { PlusCircle, X, Upload, Image, FileVideo, Info, Tag } from 'lucide-react';
import axios from 'axios';

export default function StepByStepGuide() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [price, setPrice] = useState(''); // Changed from array to string
  const [currentTag, setCurrentTag] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [steps, setSteps] = useState([]);
  const [status, setStatus] = useState('approved');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;

  const handleAddStep = () => {
    setSteps([...steps, { stepTitle: '', stepDescription: '', stepMedia: null, previewUrl: null }]);
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...steps];
    if (field === 'stepMedia' && value instanceof File) {
      newSteps[index][field] = value;
      newSteps[index].previewUrl = URL.createObjectURL(value);
    } else if (typeof value === 'string') {
      newSteps[index][field] = value;
    }
    setSteps(newSteps);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  // Updated handlePrice function to correctly update price state
  const handlePriceChange = (e) => {
    // Allow only numbers and decimal point
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle thumbnail preview
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0] || null;
    setThumbnailImage(file);
    
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    } else {
      setThumbnailPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags));
    formData.append('status', status);
    formData.append('steps', JSON.stringify(steps.map(({ stepTitle, stepDescription }) => ({ stepTitle, stepDescription }))));
    
    // Add price to formData
    formData.append('price', price);
    
    if (thumbnailImage) {
      formData.append('thumbnail', thumbnailImage);
    }

    steps.forEach((step, index) => {
      if (step.stepMedia) {
        formData.append(`stepMedia`, step.stepMedia);
      }
    });
    
    try {
      const response = await axios.post(`${BackendServername}/stepbystepguide/addguide`, formData, {
        withCredentials: true
      });

      if (response.status === 201) {
        setMessage({ type: 'success', text: 'Guide created successfully!' });
        // Reset form after successful submission
        setTitle('');
        setDescription('');
        setTags([]);
        setPrice(''); // Reset price too
        setThumbnailImage(null);
        setThumbnailPreview(null);
        setSteps([]);
      } else {
        setMessage({ type: 'error', text: 'Failed to create guide' });
      }
    } catch (error) {
      console.error('Error creating guide:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error creating guide' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <h1 className="text-3xl font-bold text-white">Create Step-by-Step Guide</h1>
          <p className="text-blue-100 mt-2">Share your knowledge with a detailed guide</p>
        </div>
        
        {message.text && (
          <div className={`p-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} flex items-center`}>
            <Info className="mr-2" size={20} />
            <span>{message.text}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Title and Description Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guide Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                placeholder="Enter a descriptive title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                placeholder="Provide a detailed overview of your guide"
                required
              />
            </div>
          </div>

          {/* Thumbnail Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleThumbnailChange}
                    />
                  </label>
                </div>
              </div>
              
              {thumbnailPreview && (
                <div className="w-32 h-32 relative">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="w-full h-full object-cover rounded-lg border border-gray-300"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      setThumbnailImage(null);
                      setThumbnailPreview(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Tag size={16} className="mr-1" /> Tags
            </label>
            <div className="p-3 border border-gray-300 rounded-lg bg-white">
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 transition-colors hover:bg-blue-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1.5 text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tag and press Enter"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Price Section - Separate from tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              Price
            </label>
            <div className="flex">
              <div className="flex-none bg-gray-100 flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300">
                $
              </div>
              <input
                type="text"
                value={price}
                onChange={handlePriceChange}
                placeholder="Enter price (e.g., 19.99)"
                className="flex-1 rounded-r-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Steps Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                  {steps.length}
                </span>
                Steps
              </h2>
              <button
                type="button"
                onClick={handleAddStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <PlusCircle className="mr-2" size={16} />
                Add Step
              </button>
            </div>

            {steps.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <PlusCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No steps added</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first step</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                    Add Step
                  </button>
                </div>
              </div>
            )}

            {steps.map((step, index) => (
              <div key={index} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4 pb-2 border-b">
                  <h3 className="text-lg font-medium flex items-center">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">
                      {index + 1}
                    </span>
                    {step.stepTitle || 'New Step'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(index)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Step Title</label>
                    <input
                      type="text"
                      value={step.stepTitle}
                      onChange={(e) => handleStepChange(index, 'stepTitle', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="What is this step called?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Step Description</label>
                    <textarea
                      value={step.stepDescription}
                      onChange={(e) => handleStepChange(index, 'stepDescription', e.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Explain in detail what to do in this step"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Media (Optional)</label>
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-3 pb-3">
                              {step.stepMedia?.type?.startsWith('image') ? (
                                <Image className="w-6 h-6 mb-1 text-gray-500" />
                              ) : step.stepMedia?.type?.startsWith('video') ? (
                                <FileVideo className="w-6 h-6 mb-1 text-gray-500" />
                              ) : (
                                <Upload className="w-6 h-6 mb-1 text-gray-500" />
                              )}
                              <p className="text-sm text-gray-500">
                                <span className="font-semibold">Upload</span> image or video
                              </p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*,video/*" 
                              onChange={(e) => handleStepChange(index, 'stepMedia', e.target.files?.[0] || null)}
                            />
                          </label>
                        </div>
                      </div>
                      
                      {step.previewUrl && step.stepMedia?.type?.startsWith('image') && (
                        <div className="w-24 h-24 relative">
                          <img 
                            src={step.previewUrl} 
                            alt={`Preview for step ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border border-gray-300" 
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const newSteps = [...steps];
                              newSteps[index].stepMedia = null;
                              newSteps[index].previewUrl = null;
                              setSteps(newSteps);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      
                      {step.previewUrl && step.stepMedia?.type?.startsWith('video') && (
                        <div className="w-24 h-24 relative bg-black rounded-lg flex items-center justify-center">
                          <FileVideo size={32} className="text-white" />
                          <span className="text-white text-xs absolute bottom-1 left-0 right-0 text-center">
                            Video
                          </span>
                          <button 
                            type="button"
                            onClick={() => {
                              const newSteps = [...steps];
                              newSteps[index].stepMedia = null;
                              newSteps[index].previewUrl = null;
                              setSteps(newSteps);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Creating Guide...' : 'Create Guide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}