// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { FaBookmark } from "react-icons/fa";
// import { fetchBookmarkedPostsAPI } from "../../APIServices/posts/postsAPI"; 
// import { Link } from "react-router-dom";

// const BookmarkPost = () => {

//   const {
//     data: bookmarkedPosts,
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["bookmarked-posts"],
//     queryFn: fetchBookmarkedPostsAPI,
//   });
//   console.log(bookmarkedPosts);
//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
//       </div>
//     );
//   }

//   // Error state
//   if (isError) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <p className="text-red-500 text-lg">Failed to fetch bookmarked posts.</p>
//       </div>
//     );
//   }

//   // No bookmarked posts
//   if (!bookmarkedPosts || bookmarkedPosts.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <p className="text-gray-500 text-lg">No bookmarked posts found.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
//         <FaBookmark className="text-orange-500" />
//         Bookmarked Posts
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {bookmarkedPosts.posts.map((post) => (
//           <div
//             key={post._id}
//             className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
//           >
//             <Link to={`/posts/${post._id}`}>
//             <img
//               src={post.image}
//               alt={post.title}
//               className="w-full h-48 object-cover"
//               loading="lazy"
//             />
//             </Link>
//             <div className="p-4">
//               <h2 className="text-xl font-semibold text-gray-900 mb-2">
//                 {post.title}
//               </h2>
//               <p className="text-gray-600 text-sm mb-4">
//                 {new Date(post.createdAt).toLocaleDateString(undefined, {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </p>

//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export {BookmarkPost};
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaBookmark } from "react-icons/fa";
import { fetchBookmarkedPostsAPI } from "../../APIServices/posts/postsAPI";
import { Link } from "react-router-dom";
import { checkAuthStatusAPI } from "../../APIServices/users/usersAPI";

const BookmarkPost = () => {

  const {
    data: bookmarkedPosts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookmarked-posts"],
    queryFn: fetchBookmarkedPostsAPI,
  });

  const {data } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
  });

let userRole = data?.role;


  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E3A8A]"></div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">Failed to fetch bookmarked posts.</p>
      </div>
    );
  }

  // No bookmarked posts
  if (!bookmarkedPosts || bookmarkedPosts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">No bookmarked posts found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-transparent bg-clip-text mb-8 flex items-center gap-2">
        <FaBookmark className="text-[#1E3A8A]" />
        Bookmarked Posts
      </h1>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarkedPosts.posts.map((post) => (
          <div
            key={post._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg transition-all duration-300 transform hover:shadow-2xl hover:-translate-y-2"
          > {console.log("Post", post)}
            <Link to={`/posts/${post._id}`} className="relative block">
              <img
                src={post.refId.thumbnail}
                alt={post.refId.title}
                // className="w-full h-48 object-cover"
                loading="lazy"
                // src="https://images.pexels.com/photos/30638768/pexels-photo-30638768/free-photo-of-taj-mahal-at-sunrise-iconic-indian-landmark.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                // alt={post.title}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/80 to-transparent opacity-0"></div>
            </Link>
            <div className="p-3">
              <h2 className="text-lg fs-3 font-semibold text-gray-900 text-left truncate">
                {post.title}
              </h2>
              <p className="text-gray-500 text-sm mb-4 text-left mt-3 ms-2">
                {new Date(post.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <div className="flex justify-end mt-4">
            <Link
              to={`/${userRole}/${post.contentData === 'StepbyStepGuide' ? 'guide' : 'posts'}/${post._id}`}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              View More
            </Link>
          </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { BookmarkPost };

