import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { loginAPI } from '../../APIServices/users/usersAPI';
import AlertMessage from '../Alert/AlertMessage';
import Oauth from '../Authgoogle';

const Login = () => {
  const navigate = useNavigate();

  // Login mutation
  const userMutation = useMutation({
    mutationKey: ['user-login'],
    mutationFn: loginAPI,
  });

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        await userMutation.mutateAsync(values);
        navigate('/');
      } catch (err) {
        console.error('Login Error:', err.response?.data || err.message);
      }
    },
  });

  return (
    <div className="flex flex-wrap pb-24">
      <div className="w-full p-4">
        <div className="flex flex-col justify-center py-24 max-w-md mx-auto h-full">
          <form onSubmit={formik.handleSubmit}>
            <Link to="/register" className="inline-block text-gray-500 hover:text-gray-700 transition duration-200 mb-8">
              <span>Don't have an account?</span> <span className="font-bold font-heading">Register</span>
            </Link>

            {/* Status messages */}
            {userMutation.isPending && <AlertMessage type="loading" message="Loading please wait..." />}
            {userMutation.isSuccess && <AlertMessage type="success" message="Login successful" />}
            {userMutation.isError && (
              <AlertMessage
                type="error"
                message={userMutation.error?.response?.data?.message || "An error occurred. Please try again."}
              />
            )}

            {/* Username field */}
            <label className="block text-sm font-medium mb-2" htmlFor="username">Username</label>
            <input
              id="username"
              className={`w-full rounded-full p-4 outline-none border ${
                formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-gray-100'
              } shadow placeholder-gray-500 focus:ring focus:ring-orange-200 transition duration-200 mb-4`}
              type="text"
              placeholder="Enter username"
              {...formik.getFieldProps('username')}
            />

            {/* Password field */}
            <label className="block text-sm font-medium mb-2" htmlFor="password">Password</label>
            <div className={`flex items-center gap-1 w-full rounded-full p-4 border ${
                formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-100'
              } shadow mb-8`}>
              <input
                className="outline-none flex-1 placeholder-gray-500"
                id="password"
                type="password"
                placeholder="Enter password"
                {...formik.getFieldProps('password')}
              />
            </div>

            {/* Submit Button */}
            <button
              className="h-14 inline-flex items-center justify-center py-4 px-6 text-white font-bold font-heading rounded-full bg-orange-500 w-full text-center border border-orange-600 shadow hover:bg-orange-600 focus:ring focus:ring-orange-200 transition duration-200 mb-8"
              type="submit"
            >
              Login
            </button>

            {/* Login with Google */}
            <p
              className="h-14 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-white w-full text-center border border-gray-100 shadow hover:bg-gray-50 focus:ring focus:ring-orange-200 transition duration-200"
            >
              <Oauth />
            </p>

            {/* Forgot Password */}
            <Link className="mt-10 inline-block text-indigo-500" to="/forgot-password">
              Forgot Password?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;