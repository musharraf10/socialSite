import { useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { fetchComments, postComment } from "../../../APIServices/subscribe/ShortsApi";

function CommentSection({ shortId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(shortId);
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [shortId]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      const comment = await postComment(shortId, newComment);
      setComments((prevComments) => [comment, ...prevComments]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  if (loading) return <p className="text-white">Loading comments...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg max-w-lg mx-auto mt-4">
      <h2 className="text-white text-lg font-semibold mb-2">Comments</h2>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-1 p-2 text-white bg-gray-800 rounded-md focus:outline-none"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
          onClick={handlePostComment}
        >
          <FaPaperPlane />
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-2 border-b border-gray-700">
              <p className="text-gray-300 text-sm">
                <span className="font-semibold text-white">{comment.user}</span>: {comment.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommentSection;
