import axios from "axios";

const API_BASE_URL = "https://socialsite-xcdq.onrender.com/api/v1/trending"; // Adjust based on your backend URL

export const fetchTrendingContent = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      withCredentials: true, // Include this if using authentication (JWT/Cookies)
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching trending content:", error.response?.data || error.message);
    throw error;
  }
};
