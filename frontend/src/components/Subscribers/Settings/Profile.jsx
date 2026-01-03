import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";

import AlertMessage from "../../Alert/AlertMessage";
import { uploadProfilePicAPI, updateEmailAPI } from "../../../APIServices/users/usersAPI";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  // State for file upload
  const [imageError, setImageErr] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const navigate =useNavigate();
  // Profile image upload mutation
  const imageMutation = useMutation({ mutationFn: uploadProfilePicAPI });

  // Email update mutation
  const emailMutation = useMutation({ mutationFn: updateEmailAPI });

  // Formik setup for profile picture
  const imageFormik = useFormik({
    initialValues: {
      image: "",
    },
    validationSchema: Yup.object({
      image: Yup.string().required("Image is required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("image", values.image);
      imageMutation.mutate(formData);
    },
  });

  // Formik setup for email update
  const emailFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Enter a valid email").required("Email is required"),
    }),
    onSubmit: (values) => {
      emailMutation.mutate(values.email);
    },
  });

  // Formik setup for mobile number update
  const mobileFormik = useFormik({
    initialValues: {
      mobile: "",
    },
    validationSchema: Yup.object({
      mobile: Yup.string().matches(/^\d{10}$/, "Enter a valid 10-digit mobile number").required("Mobile number is required"),
    }),
    onSubmit: (values) => {
      console.log("Mobile number submitted:", values.mobile);
    },
  });

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file.size > 1048576) {
      setImageErr("File size exceeds 1MB");
      return;
    }
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setImageErr("Invalid file type");
      return;
    }
    imageFormik.setFieldValue("image", file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex items-center justify-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Profile Settings
        </h2>

        {/* Profile Picture Upload */}
        <form onSubmit={imageFormik.handleSubmit} className="space-y-4">
          <label className="block text-gray-700">Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded-md" />
          {imageError && <p className="text-sm text-red-600">{imageError}</p>}
          {imagePreview && <img src={imagePreview} alt="Preview" className="h-24 w-24 rounded-full" />}
          <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md">Upload Image</button>
          {imageMutation.isPending && <AlertMessage type="loading" message="Uploading..." />}
          {imageMutation.isSuccess && <AlertMessage type="success" message="Profile updated successfully" />}
          {imageMutation.isError && <AlertMessage type="error" message="Upload failed" />}
        </form>

        {/* Email Update */}
        <form onSubmit={emailFormik.handleSubmit} className="mt-6">
          <label className="block text-gray-700">Email:</label>
          <input type="email" {...emailFormik.getFieldProps("email")} className="w-full p-2 border rounded-md" />
          {emailFormik.touched.email && emailFormik.errors.email && (
            <p className="text-sm text-red-600">{emailFormik.errors.email}</p>
          )}
          <button type="submit" className="w-full px-4 py-2 mt-2 bg-blue-600 text-white rounded-md">Update Email</button>
          {emailMutation.isPending && <AlertMessage type="loading" message="Updating email..." />}
          {emailMutation.isSuccess && <AlertMessage type="success" message="Email updated successfully" /> && navigate("/subscribers/profile")}
          {emailMutation.isError && <AlertMessage type="error" message="Update failed" />}
        </form>

        {/* Mobile Number Update */}
        <form onSubmit={mobileFormik.handleSubmit} className="mt-6">
          <label className="block text-gray-700">Mobile Number:</label>
          <div className="flex items-center space-x-2">
            <input type="text" {...mobileFormik.getFieldProps("mobile")} className="w-full p-2 border rounded-md" />
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Add</button>
          </div>
          {mobileFormik.touched.mobile && mobileFormik.errors.mobile && (
            <p className="text-sm text-red-600">{mobileFormik.errors.mobile}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;