import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

import AlertMessage from "../Alert/AlertMessage";
import { updateEmailAPI } from "../../APIServices/users/usersAPI";

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

const AddEmailComponent = () => {
  //---mutation
  const mutation = useMutation({ mutationFn: updateEmailAPI });

  // Formik setup for form handling
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values.email);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-500 p-6">
          <div className="flex items-center justify-center mb-2">
            <div className="bg-white/20 p-3 rounded-full">
              <FaEnvelope className="text-white text-xl" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-white">
            Update Email Address
          </h2>
        </div>

        {/* Content */}
        <div className="bg-white p-6">
          {/* Show messages */}
          {/* success */}
          {mutation.isSuccess && (
            <AlertMessage type="success" message="Email updated successfully" />
          )}
          {/* error */}
          {mutation.isError && (
            <AlertMessage type="error" message={mutation.error.message} />
          )}
          {/* isPending */}
          {mutation.isPending && (
            <AlertMessage type="loading" message="Updating email..." />
          )}

          {/* form */}
          <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                Email Address:
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                {...formik.getFieldProps("email")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-900 to-blue-500 text-white rounded-lg font-medium hover:from-blue-800 hover:to-blue-600 transition-all duration-200 shadow-md"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Updating..." : "Update Email"}
            </button>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link to="/admin/settings">
                <button className="w-full py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors">
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

export default AddEmailComponent;