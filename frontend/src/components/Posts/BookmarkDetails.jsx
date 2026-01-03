import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown, FaEye, FaComment, FaBookmark } from "react-icons/fa";
import { RiUserUnfollowFill, RiUserFollowLine } from "react-icons/ri";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  dislikePostAPI,
  fetchPost,
  likePostAPI,
  bookmarkPostAPI,
  unbookmarkPostAPI,
} from "../../APIServices/posts/postsAPI";
import {
  followUserAPI,
  unfollowUserAPI,
  userProfileAPI,
} from "../../APIServices/users/usersAPI";
import { createCommentAPI } from "../../APIServices/comments/commentsAPI";
import { Bookmark } from "lucide-react";

const BookmarkDetails = () => {
  const { postId } = useParams();

  const { data, refetch: refetchPost } = useQuery({
    queryKey: ["post-details"],
    queryFn: () => fetchPost(postId),
  });

  const { data: profileData, refetch: refetchProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userProfileAPI(),
  });
  console.log(data);
  console.log(profileData);
  const targetId = data?.postFound?.author;
  const userId = profileData?.user?._id;
  console.log("Target", targetId);
  console.log("User", userId);
  const isFollowing = profileData?.user?.following?.some(
    (user) => user?._id?.toString() === targetId?.toString()
  );

  const isBookmarked = data?.postFound?.bookmarkedBy?.some(
    (id) => id.toString() === userId?.toString()
  );

  const followUserMutation = useMutation({ mutationFn: followUserAPI });
  const unfollowUserMutation = useMutation({ mutationFn: unfollowUserAPI });
  const likePostMutation = useMutation({ mutationFn: likePostAPI });
  const dislikePostMutation = useMutation({ mutationFn: dislikePostAPI });
  const bookmarkMutation = useMutation({ mutationFn: bookmarkPostAPI });
  const unbookmarkMutation = useMutation({ mutationFn: unbookmarkPostAPI });
  const commentMutation = useMutation({ mutationFn: createCommentAPI });

  const followUserHandler = async () => {
    followUserMutation.mutateAsync(targetId).then(() => refetchProfile());
  };

  const unfollowUserHandler = async () => {
    unfollowUserMutation.mutateAsync(targetId).then(() => refetchProfile());
  };

  const likePostHandler = async () => {
    likePostMutation.mutateAsync(postId).then(() => refetchPost());
  };

  const dislikesPostHandler = async () => {
    dislikePostMutation.mutateAsync(postId).then(() => refetchPost());
  };

  const bookmarkPostHandler = async () => {
    bookmarkMutation.mutateAsync(postId).then(() => refetchPost());
  };

  const unbookmarkPostHandler = async () => {
    unbookmarkMutation.mutateAsync(postId).then(() => refetchPost());
  };

  const formik = useFormik({
    initialValues: { content: "" },
    validationSchema: Yup.object({
      content: Yup.string().required("Comment content is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const data = { content: values.content, postId };
      commentMutation.mutateAsync(data).then(() => {
        refetchPost();
        resetForm();
      });
    },
  });

  return (
    <div className="flex justify-center items-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <img
          src={data?.postFound?.image}
          className="w-full max-w-lg h-64 object-cover rounded-lg mb-2 border-2   mx-auto transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl block"
        />

        {data?.postFound?.description}

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1 cursor-pointer" onClick={likePostHandler}>
              <FaThumbsUp /> {data?.postFound?.likes?.length || 0}
            </span>
            <span className="flex items-center gap-1 cursor-pointer" onClick={dislikesPostHandler}>
              <FaThumbsDown /> {data?.postFound?.dislikes?.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <FaEye /> {data?.postFound?.viewers?.length || 0}
            </span>
            <span
              className={`flex items-center gap-1 cursor-pointer ${isBookmarked ? "text-blue-600" : "text-gray-600"
                }`}
              onClick={isBookmarked ? unbookmarkPostHandler : bookmarkPostHandler}
            >
              <FaBookmark />
            </span>

          </div>

          {isFollowing ? (
            <button
              onClick={unfollowUserHandler}
              className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white p-2 rounded-md hover:bg-gradient-to-r hover:from-[#1E40AF] hover:to-[#2563EB] hover:text-black flex items-center gap-1"
            >
              <RiUserUnfollowFill /> Unfollow
            </button>
          ) : (
            <button
              onClick={followUserHandler}
              className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white p-2 rounded-md hover:bg-gradient-to-r hover:from-[#1E40AF] hover:to-[#2563EB] hover:text-black flex items-center gap-1"
            >
              <RiUserFollowLine /> Follow
            </button>
          )}
        </div>

        {/* <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>
          <form onSubmit={formik.handleSubmit} className="mb-6">
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="3"
              placeholder="Write a comment..."
              {...formik.getFieldProps("content")}
            ></textarea>
            {formik.touched.content && formik.errors.content && (
              <div className="text-red-500 mb-2">{formik.errors.content}</div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white p-2 rounded-md hover:bg-gradient-to-r hover:from-[#1E40AF] hover:to-[#2563EB] hover:text-black"
            >
              <FaComment className="inline mr-1" /> Add Comment
            </button>
          </form>

          <div className="space-y-4">
            {data?.postFound?.comments?.map((comment, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm text-left">
                <div className="mt-2 flex items-center text-gray-600 text-sm">
                  <span className="font-semibold text-primary">{comment.author?.username}</span>
                  <span className="ml-2 text-primary-500 ">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>3
                <p className="text-gray-800">{comment.content}</p>
                
              </div>
            ))}
          </div>
        </div> */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>
          <form onSubmit={formik.handleSubmit} className="mb-6">
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="3"
              placeholder="Write a comment..."
              {...formik.getFieldProps("content")}
            ></textarea>
            {formik.touched.content && formik.errors.content && (
              <div className="text-red-500 mb-2">{formik.errors.content}</div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white p-2 rounded-md hover:bg-gradient-to-r hover:from-[#1E40AF] hover:to-[#2563EB] hover:text-black"
            >
              <FaComment className="inline mr-1" /> Add Comment
            </button>
          </form>

          {/* Scrollable Comments Section */}
          {/* <div className="max-h-60 overflow-y-auto space-y-4 p-2 border rounded-lg">
            {data?.postFound?.comments?.map((comment, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded-lg shadow-sm text-left">
                <div className="mt-2 flex items-center text-gray-600 text-sm">
      
                  <div className="d-flex">
              
                    <img
                      src={comment.author?.image || "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=600"}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                    />
                    <div>
                      <span className="font-semibold text-primary">{comment.author?.username}</span>
                      <span className="ml-2 text-primary-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                  </div>

                </div>

              </div>
            ))}
          </div> */}

<div 
  className="space-y-4 p-2 border rounded-lg"
  style={{ maxHeight: "250px", overflowY: data?.postFound?.comments?.length > 3 ? "auto" : "visible" }}
>
  {data?.postFound?.comments?.map((comment, index) => (
    <div key={index} className="flex items-start space-x-4 p-2 bg-gray-100 rounded-lg shadow-sm text-left">
      
      {/* Profile Picture */}
      <img
        src={comment.author?.profilePic } // Default profile pic
        alt={comment.author?.username}
        className="w-10 h-10 rounded-full object-cover mt-2"
      />

      {/* Comment Content */}
      <div className="flex-1">
      

        {/* Author Name & Date */}
        <div className="mt-2 flex items-center text-sm">
          <span className="font-bold text-blue-600">{comment.author?.username}</span>
          <span className="ml-2 text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-800 font-semibold">{comment.content}</p>
      </div>

    </div>
  ))}
</div>


        </div>

      </div>
    </div>
  );
};

export default BookmarkDetails;