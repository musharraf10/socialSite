import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/v1/shorts"; // Adjust based on your backend URL

// Fetch all shorts
export const fetchShorts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      withCredentials: true, // Include if using authentication (JWT/Cookies)
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shorts:", error.response?.data || error.message);
    throw error;
  }
};

// Like a short
export const likeShort = async (id) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${id}/like`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error liking short:", error.response?.data || error.message);
    throw error;
  }
};

// Save a short
export const saveShort = async (id) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${id}/save`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error saving short:", error.response?.data || error.message);
    throw error;
  }
};

// Add a comment to a short
export const addComment = async (id, comment) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${id}/comment`, { comment }, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error.response?.data || error.message);
    throw error;
  }
};
