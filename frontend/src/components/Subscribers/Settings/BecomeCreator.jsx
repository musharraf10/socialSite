import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FiUpload, FiUser, FiPhone } from 'react-icons/fi';

const validationSchema = Yup.object({
  phone: Yup.string()
    .matches(/^[0-9+\-() ]+$/, 'Invalid phone number')
    .required('Phone number is required'),
  channelName: Yup.string()
    .min(3, 'Channel name must be at least 3 characters')
    .required('Channel name is required'),
  govIDType: Yup.string().required('Government ID type is required'),
  govID: Yup.mixed().required('Government ID is required'),
});

export default function BecomeCreator() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;

  const formik = useFormik({
    initialValues: {
      phone: '',
      channelName: '',
      govIDType: '',
      govID: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const formData = new FormData();
      
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });
      
      try {
        const response = await axios.post(`${BackendServername}/users/become-creator`, formData,{
          withCredentials:true
        } ,{
          headers: { 'Content-Type': 'multipart/form-data' },
          
        });
        alert('Application submitted successfully!');

        
        resetForm();
        setPreviewImage(null);
      } catch (error) {
        console.error('Error submitting form:', error.message);
        alert('Submission failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue('govID', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Become a Creator</h1>
        </div>

        <form onSubmit={formik.handleSubmit} className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="tel"
                  {...formik.getFieldProps('phone')}
                  className="pl-10 w-full rounded-lg border-gray-300 focus:ring-blue-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-sm text-red-500">{formik.errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Channel Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  {...formik.getFieldProps('channelName')}
                  className="pl-10 w-full rounded-lg border-gray-300 focus:ring-blue-500"
                  placeholder="Your Channel Name"
                />
              </div>
              {formik.touched.channelName && formik.errors.channelName && (
                <p className="text-sm text-red-500">{formik.errors.channelName}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Government ID Type</label>
            <select
              {...formik.getFieldProps('govIDType')}
              className="w-full border-gray-300 rounded-lg focus:ring-blue-500"
            >
              <option value="">Select ID Type</option>
              <option value="Aadhar">Aadhar Card</option>
              <option value="Passport">Passport</option>
              <option value="Driving License">Driving License</option>
              <option value="Voter ID">Voter ID</option>
            </select>
            {formik.touched.govIDType && formik.errors.govIDType && (
              <p className="text-sm text-red-500">{formik.errors.govIDType}</p>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Government ID</label>
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="text-center">
                {previewImage ? (
                  <img src={previewImage} alt="ID Preview" className="mx-auto h-32 w-auto object-cover rounded" />
                ) : (
                  <>
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <label className="cursor-pointer text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
            {formik.touched.govID && formik.errors.govID && (
              <p className="text-sm text-red-500">{formik.errors.govID}</p>
            )}
          </div>

          <div className="mt-8">
            <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 bg-blue-600 text-white rounded-md">
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
