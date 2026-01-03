import React, { useEffect, useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { checkAuthStatusAPI } from "../../APIServices/users/usersAPI";

export default function StepByStepGuide() {
  const { id } = useParams(); 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [steps, setSteps] = useState([]);
  const [status, setStatus] = useState('approved');
  const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchGuideDetails = async () => {
      try {
        const response = await axios.get(`${BackendServername}/posts/managecontent/getpost/${id}`, {
          withCredentials: true,
        });
        console.log('Fetched data:', response.data);
  
        // Ensure refId exists
        if (response.data.refId) {
          const data = response.data.refId;
          setTitle(data.title || '');
          setDescription(data.description || '');
          setTags(data.tags || []);
          setSteps(data.steps || []); // Update this if steps are stored differently
          setStatus(response.data.status || 'approved');
        } else {
          console.error('refId is undefined in the API response');
          alert('Guide details are incomplete.');
        }
      } catch (error) {
        console.error('Error fetching guide details:', error);
        alert('Failed to load guide details.');
      }
    };
    fetchGuideDetails();
  }, [id, BackendServername]);


  const { isLoading, data } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
  });

  let userRole = data?.role;
  

  const handleAddStep = () => {
    setSteps([...steps, { stepTitle: '', stepDescription: '', stepMedia: null }]);
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...steps];
    if (field === 'stepMedia' && value instanceof File) {
      newSteps[index][field] = value;
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

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!id) {
      alert("Error: Guide ID is missing!");
      return;
    }
  
    console.log("Updating guide with ID:", id);
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags));
    formData.append("status", status);
    formData.append("steps", JSON.stringify(steps));
  
    if (thumbnailImage) {
      formData.append("thumbnail", thumbnailImage);
    }
  
    steps.forEach((step, index) => {
      if (step.stepMedia) {
        formData.append(`stepMedia`, step.stepMedia);
      }
    });
  
    try {
      const response = await axios.put(`${BackendServername}/stepbystepguide/updateguide/${id}`, formData, {
        withCredentials: true,
      });
  
      console.log("Response:", response);
  
      if (response.status === 200) {
        alert("Guide updated successfully!");
        navigate(`/${userRole}/manage-content`);
      } else {
        alert("Failed to update guide");
      }
    } catch (error) {
      console.error("Error updating guide:", error);
      alert(`Error: ${error.response?.data?.message || "Failed to update guide"}`);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Update Step-by-Step Guide</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailImage(e.target.files?.[0] || null)}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 inline-flex items-center"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag and press Enter"
                className="flex-1 min-w-[200px] rounded-md border border-gray-300 px-3 py-1 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Steps</h2>
              <button
                type="button"
                onClick={handleAddStep}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="mr-2" size={16} />
                Add Step
              </button>
            </div>

            {steps.map((step, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">Step {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Step Title</label>
                    <input
                      type="text"
                      value={step.stepTitle}
                      onChange={(e) => handleStepChange(index, 'stepTitle', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Step Description</label>
                    <textarea
                      value={step.stepDescription}
                      onChange={(e) => handleStepChange(index, 'stepDescription', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Media (Optional)</label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => handleStepChange(index, 'stepMedia', e.target.files?.[0] || null)}
                      className="mt-1 block w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md">
            Update Guide
          </button>
        </form>
      </div>
    </div>
  );
}
