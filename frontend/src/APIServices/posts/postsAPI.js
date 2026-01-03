import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
const BASE_URL = "http://localhost:5000/api/v1/posts";
const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;

//!Create post api
export const createPostAPI = async (postData) => {
  console.log(postData);
  const response = await axios.post(`${BASE_URL}/create`, postData, {
    withCredentials: true,
  });
  return response.data;
};


export const updatePostAPI = async ({ formData, postId }) => {
  const response = await axios.patch(
    `${BASE_URL}/${postId}`,

    formData,

    {
      withCredentials: true,
    }
  );
  return response.data;
};
//! Fetch all posts
export const fetchAllPosts = async (filters) => {
  const posts = await axios.get(BASE_URL, {
    params: filters,
  });
  return posts.data;
};

export const fetchAllWebiners = async () => {
  const posts = await axios.get(`${BASE_URL}/allwebiners`);
  return posts.data;
};
//! Fetch  post
export const fetchPost = async (postId) => {
  const posts = await axios.get(`${BASE_URL}/${postId}`, {
    withCredentials: true,
  });
  return posts.data;
};
//! delete  post
// export const deletePostAPI = async (postId) => {
//   const posts = await axios.delete(`${BASE_URL}/${postId}`, {
//     withCredentials: true,
//   });
//   return posts.data;
// };

//!like post api
export const likePostAPI = async (postId) => {
  console.log("Like",postId)
  const response = await axios.patch(
    `${BASE_URL}/likes/${postId}`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};
//!dislike post api
export const dislikePostAPI = async (postId) => {
  console.log("disLike",postId)
  const response = await axios.patch(
    `${BASE_URL}/dislikes/${postId}`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};


export const fetchPendingPosts = async () => {
  const response = await axios.get(`${BASE_URL}/pendingposts`);
  return response.data;
};
export const useFetchPendingPosts = () => {
  return useQuery(["pendingPosts"], fetchPendingPosts);
};

//! Update Post Status
export const updatePostStatusAPI = async ({ postId, status }) => {
  console.log("PostId", postId, status);
  const response = await axios.patch(
    `${BASE_URL}/updatestatus/${postId}`,
    { status },
    { withCredentials: true }
  );
  return response.data;
};
export const useUpdatePostStatus = () => {
  const queryClient = useQueryClient();
  return useMutation(updatePostStatusAPI, {
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingPosts"]);
    },
  });
};

//! Delete Post
export const deletePostAPI = async (postId) => {
  const response = await axios.delete(`${BASE_URL}/${postId}`, {
    withCredentials: true,
  });
  return response.data;
};
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation(deletePostAPI, {
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingPosts"]);
    },
  });
};


export const fetchPostAnalytics = async () => {
  const response = await axios.get(`${BASE_URL}/analytics`);
  return response.data;
}


export const bookmarkPostAPI = async (postId) => {
  console.log("Post", postId);
  const response = await axios.post(`${BASE_URL}/${postId}/bookmark`,
    {},
    {
      withCredentials: true,
    }
);
  return response.data;
};

export const unbookmarkPostAPI = async (postId) => {
  const response = await axios.post(`${BASE_URL}/${postId}/unbookmark`,{},
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const fetchBookmarkedPostsAPI = async () => {
  const response = await axios.get(`${BASE_URL}/bookmarked`,
    {
      withCredentials: true,
    }
  );
  
  return response.data;
};




  export const getallpostsdata = async () => {
    try {
      const response = await axios.get(
        `${BackendServername}/posts/getallpublishedposts`
      );
      return response.data.posts; 
    } catch (error) {
      console.log(error);
      return [];
    }
  };


  export const getArticles = async() =>{
    try {
      const response = await axios.get(`${BackendServername}/posts/articles/count`,{
        withCredentials:true
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  export const getWebinars = async() =>{
    try {
      const response = await axios.get(`${BackendServername}/posts/webinars/count`,{
        withCredentials:true
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  export const getStepbyStepGuides = async() =>{
    try {
      const response = await axios.get(`${BackendServername}/posts/guides/count`,{
        withCredentials:true
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  export const approveAll = async() =>{
    try {
      await axios.put(`${BackendServername}/posts/approveall`,{},{
        withCredentials: true
      })
    } catch (error) {
      console.error(error)
    }
  }
  export const rejectAll = async() =>{
    try {
      await axios.put(`${BackendServername}/posts/rejectall`,{},{
        withCredentials:true
      })

    } catch (error) {
      console.error(error)
    }
  }