import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import axios from "axios";
import { FiUpload } from "react-icons/fi";

import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  TextField,
  Divider,
  Stack,
} from "@mui/material";

const CreatePost = () => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState(""); 
  const [tags, setTags] = useState(""); 
  const [price, setPrice] = useState(""); 
  const [thumbnail, setThumbnail] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;

  const savePost = async (postStatus) => {
    if (title.trim().length === 0 || content.trim().length === 0) {
      alert("Title and content cannot be empty!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", postStatus);
    formData.append("tags", tags.split(",").map((tag) => tag.trim()));
    formData.append("price", price);
    
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);  // FIX: Ensure key matches backend
    }

    try {
      const response = await axios.post(
        `${BackendServername}/article/addarticle`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Success");
        alert("Article saved successfully");
        setContent("");
        setTitle("");
        setTags("");
        setPrice("");
        setThumbnail(null);
      } else {
        alert("Something went wrong! Please try again.");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Failed to save content. Please check your connection and try again.");
    }
  };

  const config = {
    readonly: false,
    toolbarAdaptive: false,
    height: 500,
    width: "100%",
    askBeforePasteHTML: false,
    pastePlainText: true,
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file); // Set file in state
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Show preview
      };
      reader.readAsDataURL(file);
    }
  };
  

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            <b>Add Your Article</b>
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Write, format, and publish your content here.
          </Typography>
          <Divider sx={{ mt: 2 }} />
        </Box>

        {/* Title Input */}
        <TextField
          label="Post Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          label="Tags (separate with commas)"
          variant="outlined"
          fullWidth
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Thumbnail Upload */}
        {/* <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          style={{ marginBottom: "20px" }}
        /> */}

        <div className="text-center border mb-4">
          {previewImage ? (
            <img src={previewImage} alt="ID Preview" className="mx-auto h-32 w-auto object-cover rounded" />
          ) : (
            <>
              <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
              <label className="cursor-pointer text-blue-600 hover:text-blue-500">
                <span>Upload Thumbnail Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
            </>
          )}
        </div>

        <TextField
          label="Add Price"
          variant="outlined"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Editor */}
        <Box sx={{ mb: 4 }}>
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={(newContent) => setContent(newContent)}
            className="w-full"
          />
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "end", gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            color="secondary"
            sx={{
              padding: "12px 0",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              width: "200px",
              gap: 1,
              borderColor: "secondary.main",
              boxShadow: 2,
              "&:hover": { borderColor: " #1E3A8A" },
              color: "black"
            }}
            onClick={() => savePost("draft")}
          >
            Save as Draft
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              background: "linear-gradient(to right, #1E3A8A, #3B82F6)",
              color: "white",
              padding: "12px 0",
              fontSize: "16px",
              width: "200px",
              display: "flex",
              alignItems: "center",
              gap: 1,
              boxShadow: 2,
              "&:hover": {
                background: "linear-gradient(to right, #1E40AF, #2563EB)",
                color: "black"
              },
            }}
            onClick={() => savePost("pending")}
          >
            Send to Review
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePost;
