import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-quill/dist/quill.snow.css";
import { FaTimesCircle, FaUserCircle } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import AlertMessage from "../Alert/AlertMessage";
import { uploadProfilePicAPI } from "../../APIServices/users/usersAPI";

const UploadProfilePic = () => {
  //File upload state
  const [imageError, setImageErr] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // post mutation
  const mutation = useMutation({
    mutationKey: ["upload-profile-pic"],
    mutationFn: uploadProfilePicAPI,
  });

  const formik = useFormik({
    // initial data
    initialValues: {
      image: "",
    },
    // validation
    validationSchema: Yup.object({
      image: Yup.string().required("Image is required"),
    }),
    // submit
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("image", values.image);
      mutation.mutate(formData);
    },
  });

  //!===== File upload logics====
  //! Handle fileChange
  const handleFileChange = (event) => {
    //get the file selected
    const file = event.currentTarget.files[0];
    //Limit file size
    if (file.size > 1048576) {
      setImageErr("File size exceed 1MB");
      return;
    }
    // limit the file types
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setImageErr("Invalid file type");
      return;
    }
    //set the image preview
    formik.setFieldValue("image", file);
    setImagePreview(URL.createObjectURL(file));
    // Clear any previous errors
    setImageErr("");
  };

  //!remove image
  const removeImage = () => {
    formik.setFieldValue("image", null);
    setImagePreview(null);
  };

  //get loading state
  const isLoading = mutation.isPending;
  //isErr
  const isError = mutation.isError;
  //success
  const isSuccess = mutation.isSuccess;
  //Error
  const errorMsg = mutation?.error?.response?.data?.message;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-500 p-6">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-white/20 p-3 rounded-full">
              <FaUserCircle className="text-white text-xl" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-white">
            Upload Profile Picture
          </h2>
        </div>

        {/* Content */}
        <div className="bg-white p-6">
          {/* show alert */}
          {isLoading && (
            <AlertMessage type="loading" message="Uploading, please wait..." />
          )}
          {isSuccess && (
            <AlertMessage
              type="success"
              message="Profile image has been updated successfully"
            />
          )}
          {isError && <AlertMessage type="error" message={errorMsg} />}

          <form onSubmit={formik.handleSubmit} className="space-y-6 mt-4">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border border-gray-200">
              {/* Preview image */}
              <div className="mb-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-full border-4 border-blue-500 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
                    >
                      <FaTimesCircle className="text-red-500 text-lg" />
                    </button>
                  </div>
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-500 shadow-md">
                    <FaUserCircle className="text-gray-400 text-5xl" />
                  </div>
                )}
              </div>

              <div className="w-full">
                <div className="flex justify-center items-center">
                  <input
                    id="images"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="images"
                    className="cursor-pointer bg-gradient-to-r from-blue-900 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:from-blue-800 hover:to-blue-600 transition-all duration-200 font-medium text-center"
                  >
                    Choose a file
                  </label>
                </div>

                {/* Display error message */}
                {(formik.touched.image && formik.errors.image) || imageError ? (
                  <p className="text-sm text-red-600 text-center mt-2">
                    {formik.errors.image || imageError}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    JPEG, JPG or PNG, maximum 1MB
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !imagePreview}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-900 to-blue-500 text-white rounded-lg font-medium hover:from-blue-800 hover:to-blue-600 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Uploading..." : "Upload Profile Picture"}
            </button>

            {/* Back button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link to="/admin/settings">
                <button
                  type="button"
                  className="w-full py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Back to Settings
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadProfilePic;