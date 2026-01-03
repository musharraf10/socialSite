import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import { useNavigate } from "react-router-dom";
import { createPlanAPI } from "../../APIServices/plans/plans";
import AlertMessage from "../Alert/AlertMessage";
import { CreditCard, Package, Percent } from "lucide-react";

const CreatePlan = () => {
  const navigate = useNavigate();

  const planMutation = useMutation({
    mutationKey: ["create-plan"],
    mutationFn: createPlanAPI,
  });
  

  const formik = useFormik({
    initialValues: {
      planName: "",
      features: "",
      price: "",
      billingCycle: "monthly",
      discountPercentage: 0,
    },
    validationSchema: Yup.object({
      planName: Yup.string().required("Plan Name is required"),
      features: Yup.string().required("Features are required"),
      price: Yup.number()
        .required("Price is required")
        .positive("Price must be a positive number"),
      billingCycle: Yup.string()
        .oneOf(["monthly", "yearly"], "Invalid billing cycle")
        .required("Billing cycle is required"),
      discountPercentage: Yup.number()
        .min(0, "Discount must be at least 0")
        .max(100, "Discount cannot exceed 100"),
    }),
    onSubmit: async (values) => {
      const planData = {
        planName: values.planName,
        features: values.features.split(",").map((feature) => feature.trim()),
        price: Number(values.price),
        billingCycle: values.billingCycle,
        discountPercentage: Number(values.discountPercentage),
      };

      planMutation
        .mutateAsync(planData)
        .then(() => navigate("/admin/dashboard"))
        .catch((err) => console.log(err));
    },
  });

  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="px-8 py-6 bg-blue-900 text-white">
          <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2 text-white">
  <Package className="w-6 h-6" /> Create Subscription Plan
</h2>

          </div>
          <form onSubmit={formik.handleSubmit} className="px-8 py-6 space-y-6">
            {planMutation.isPending && <AlertMessage type="loading" message="Loading, please wait..." />}
            {planMutation.isSuccess && <AlertMessage type="success" message="Plan created successfully" />}
            {planMutation.isError && (
              <AlertMessage type="error" message={planMutation.error.response?.data?.message || "An error occurred"} />
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
              <select id="planName" {...formik.getFieldProps("planName")} className="block w-full px-4 py-3 rounded-lg border">
                <option value="">Select Plan</option>
                <option value="Free">Free</option>
                <option value="basic">Basic</option>
                <option value="Premium">Premium</option>
              </select>
              {formik.touched.planName && formik.errors.planName && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.planName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma separated)</label>
              <input type="text" id="features" {...formik.getFieldProps("features")} className="block w-full px-4 py-3 rounded-lg border" placeholder="e.g., Feature 1, Feature 2, Feature 3" />
              {formik.touched.features && formik.errors.features && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.features}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Price
                </label>
                <input type="number" id="price" {...formik.getFieldProps("price")} className="block w-full pl-8 pr-4 py-3 rounded-lg border" placeholder="0.00" />
                {formik.touched.price && formik.errors.price && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.price}</p>
                )}
              </div>

              <div className="w-full">
  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Billing Cycle</label>
  <select
    id="billingCycle"
    {...formik.getFieldProps("billingCycle")}
    className="block w-full px-4 py-3 rounded-lg border text-left"
  >
    <option value="monthly">Monthly</option>
    <option value="yearly">Yearly</option>
  </select>
  {formik.touched.billingCycle && formik.errors.billingCycle && (
    <p className="mt-1 text-sm text-red-600">{formik.errors.billingCycle}</p>
  )}
</div>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Percent className="w-4 h-4" /> Discount Percentage
              </label>
              <input type="number" id="discountPercentage" {...formik.getFieldProps("discountPercentage")} className="block w-full pr-12 px-4 py-3 rounded-lg border" placeholder="0" />
              {formik.touched.discountPercentage && formik.errors.discountPercentage && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.discountPercentage}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white p-2 rounded-md 
                        hover:bg-gradient-to-r hover:from-[#1E40AF] hover:to-[#2563EB] hover:text-black"
              disabled={planMutation.isPending}
            >
              {planMutation.isPending ? "Creating Plan..." : "Create Plan"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePlan;