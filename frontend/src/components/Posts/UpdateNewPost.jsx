import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JoditEditor from "jodit-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { checkAuthStatusAPI } from "../../APIServices/users/usersAPI";
import { FileText, Tag, DollarSign, Save } from "lucide-react";

const UpdateNewPost = () => {
  const { id } = useParams();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();
  const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;

  const { isLoading, data } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
  });

  let userRole = data?.role;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${BackendServername}/posts/managecontent/getpost/${id}`);
        const post = response.data;
        console.log(post);
        setTitle(post.refId.title);
        setContent(post.refId.description);
        setTags(post.refId.tags.join(","));
        setPrice(post.price || "0");
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Failed to load post details.");
      }
    };

    fetchPost();
  }, [id, BackendServername]);

  const updatePost = async () => {
    if (title.trim().length === 0 || content.trim().length === 0) {
      alert("Title and content cannot be empty!");
      return;
    }

    try {
      const response = await axios.put(
        `${BackendServername}/article/updatearticle/${id}`,
        {
          title,
          content,
          tags: tags.split(",").map((tag) => tag.trim()),
          price,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Post updated successfully!");
        navigate(`/${userRole}/manage-content`);
      } else {
        alert("Something went wrong! Please try again.");
      }
    } catch (error) {
      console.error("Error updating content:", error);
      alert("Failed to update content. Please try again.");
    }
  };

  const config = {
    readonly: false,
    toolbarAdaptive: false,
    height: 500,
    width: "100%",
    pastePlainText: true,
    theme: "default",
    toolbarButtonSize: "large",
    buttons: [
      "source",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "image",
      "link",
      "table",
      "|",
      "align",
      "undo",
      "redo",
      "|",
      "hr",
      "eraser",
      "copyformat",
      "|",
      "fullsize",
    ],
    uploader: {
      insertImageAsBase64URI: true
    },
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6]">
            <h1 className="text-3xl font-bold text-white">Edit Post</h1>
            <p className="mt-2 text-blue-100">Update your content and make it shine</p>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Post Title</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter post title"
                  />
                </div>
              </div>

              {/* Tags Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </div>

              {/* Price Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter price"
                  />
                </div>
              </div>

              {/* Editor */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <div className="rounded-lg overflow-hidden border border-gray-300">
                  <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    onBlur={(newContent) => setContent(newContent)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  onClick={updatePost}
                  className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white rounded-lg hover:from-[#1E40AF] hover:to-[#2563EB] transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="w-5 h-5 mr-2" />
                  <span className="text-lg font-medium">Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateNewPost;