import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/notifications";

export const fetchNotificationsAPI = async (postData) => {
  const response = await axios.get(`${BASE_URL}`, {
    withCredentials: true,
  });
  return response.data;
};

//! Read notification
export const readNotificationAPI = async (notificationId) => {
  const posts = await axios.patch(`${BASE_URL}/${notificationId}`, {},{
    withCredentials: true
  });
  return posts.data;
};
