import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { addCategoryAPI } from "../../APIServices/category/categoryAPI";
import AlertMessage from "../Alert/AlertMessage";

const AddCategory = () => {
  // category mutation
  const categoryMutation = useMutation({
    mutationKey: ["create-post"],
    mutationFn: addCategoryAPI,
  });

  const formik = useFormik({
    // initial data
    initialValues: {
      categoryName: "",
    },
    // validation
    validationSchema: Yup.object({
      categoryName: Yup.string().required("categoryName is required"),
    }),
    // submit
    onSubmit: (values) => {
      categoryMutation.mutate(values);
    },
  });

  return (
    <div className="flex flex-wrap">
      <div className="w-full p-4">
        <div className="flex flex-col justify-center max-w-md mx-auto h-full py-12">
          <form onSubmit={formik.handleSubmit}>
            <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] mb-6">
              Add Category
            </h1>

            {/* show loading */}
            {categoryMutation.isPending && (
              <AlertMessage type="loading" message="Loading please wait" />
            )}
            {categoryMutation.isSuccess && (
              <AlertMessage
                type="success"
                message="Category created successfully"
              />
            )}
            {categoryMutation.isError && (
              <AlertMessage
                type="error"
                message={categoryMutation?.error?.response?.data?.message}
              />
            )}

            {/* Category Name */}
            <input
              type="text"
              {...formik.getFieldProps("categoryName")}
              className="w-full rounded-full p-4 outline-none border border-gray-100 shadow placeholder-gray-500 focus:ring focus:ring-orange-200 transition duration-200 mb-4"
              placeholder="Category Name"
            />
            {formik.touched.categoryName && formik.errors.categoryName && (
              <div className="text-red-500 mb-4 mt-1">
                {formik.errors.categoryName}
              </div>
            )}
<button
  className="h-14 inline-flex items-center justify-center py-4 px-6 text-white font-bold font-heading rounded-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] p-2 hover:bg-gradient-to-r hover:from-[#1E40AF] hover:to-[#2563EB] hover:text-black w-full text-center border border-orange-600 shadow focus:ring focus:ring-orange-200 transition duration-200 mb-8"
  type="submit"
>
  Add Category
</button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;