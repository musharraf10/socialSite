import { BASE_URL } from "../../utils/baseEndpoint";
import axios from "axios";
const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;

// ! Register user
export const registerAPI = async (userData) => {
  const response = await axios.post(
    `${BASE_URL}/users/register`,
    {
      username: userData?.username,
      password: userData?.password,
      email: userData?.email,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};
// ! login user
export const loginAPI = async (userData) => {
  const response = await axios.post(
    `${BASE_URL}/users/login`,
    {
      username: userData?.username,
      password: userData?.password,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

//http://localhost:5000/api/v1/users/checkAuthenticated
// ! checkAuthStatus user
export const checkAuthStatusAPI = async () => {
  const response = await axios.get(`${BASE_URL}/users/check-auth`, {
    withCredentials: true,
  });
  console.log(response.data);
  return response.data;
};
// ! user profile
export const userProfileAPI = async () => {
  const response = await axios.get(`${BASE_URL}/users/profile`, {
    withCredentials: true,
  });
  return response.data;
};

// ! logout user
export const logoutAPI = async (userData) => {
  const response = await axios.post(
    `${BASE_URL}/users/logout`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};

// ! follw user
export const followUserAPI = async (userId) => {
  const response = await axios.put(
    `${BASE_URL}/users/follow/${userId}`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};
// ! unfollw user
export const unfollowUserAPI = async (userId) => {
  const response = await axios.put(
    `${BASE_URL}/users/unfollow/${userId}`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};
// ! send Email verification token
export const sendEmailVerificatonTokenAPI = async () => {
  const response = await axios.put(
    `${BASE_URL}/users/send-verification-email`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};
// ! updateEmailAPI
export const updateEmailAPI = async (email) => {
  const response = await axios.patch(
    `${BASE_URL}/users/update-email`,
    {
      email,
    },
    {
      withCredentials: true,
    }
  );
  console.log(response.data);
  return response.data;
};

// !Verify user account
export const verifyUserAccountAPI = async (verifyToken) => {
  const response = await axios.put(
    `${BASE_URL}/users/verify-account/${verifyToken}`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};
// !forgot password
export const forgotPasswordAPI = async (email) => {
  const response = await axios.post(
    `${BASE_URL}/users/forgot-password`,
    {
      email,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};
// !upload profile pic
export const uploadProfilePicAPI = async (formData) => {
  const response = await axios.patch(
    `${BASE_URL}/users/upload-profile-picture`,
    formData,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

// !reset password
export const resetPasswordAPI = async (data) => {
  const response = await axios.post(
    `${BASE_URL}/users/reset-password/${data?.verifyToken}`,
    {
      password: data?.password,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const changePasswordAPI = async (data) => {  
  const response = await axios.put(
    `${BASE_URL}/users/change-password`,
    {
      oldPassword: data?.oldPassword,
      newPassword: data?.newPassword,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const paidSub = async () =>{
  try {
    const response= await axios.get(`${BackendServername}/users/paidusers/count`,{
      withCredentials:true
    })

    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const UnpaidSub = async () =>{
  try {
    const response= await axios.get(`${BackendServername}/users/unpaidusers/count`,{
      withCredentials:true
    })

    return response.data
  } catch (error) {
    console.error(error)
  }
}



export const becomeCreatorAPI = async (formData) => {
  try {
    console.log("formData", formData);
    const response = await axios.post(
      `${BASE_URL}/users/become-creator`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
};