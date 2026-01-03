import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerAPI } from "../../APIServices/users/usersAPI";
import AlertMessage from "../Alert/AlertMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const userMutation = useMutation({
    mutationKey: ["user-registration"],
    mutationFn: registerAPI,
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      email: Yup.string()
        .email("Enter valid email")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),

    onSubmit: (values) => {
      console.log(values);
      userMutation
        .mutateAsync(values)
        .then(() => {
          navigate("/login");
        })
        .catch((err) => console.log(err));
    },
  });
  console.log(userMutation);

  const passwordStrengthRegex = {
    weak: /^.{1,7}$/,
    medium: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/,
    strong:
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,15}$/,
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (passwordStrengthRegex.strong.test(value)) {
      setPasswordStrength("Strong");
    } else if (passwordStrengthRegex.medium.test(value)) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">

        
        <h1>Registration Form</h1>
        <br />
        <form onSubmit={formik.handleSubmit}>
          <Link to="/login" className="register-link">
            <span>Already have an account? </span>
            <span className="font-bold font-heading">Login</span>
          </Link>

          {userMutation.isPending && (
            <AlertMessage type="loading" message="Loading... Please wait!" />
          )}

          {userMutation.isSuccess && (
            <AlertMessage
              type="success"
              message="Registration successful! Redirecting..."
            />
          )}

          {userMutation.isError && (
            <AlertMessage
              type="error"
              message={
                userMutation.error?.response?.data?.message ||
                "Something went wrong"
              }
            />
          )}

          <label className="register-label">Username</label>
          <input
            className="register-input"
            type="text"
            autoComplete="off"
            placeholder="Enter Username"
            {...formik.getFieldProps("username")}
          />
          {formik.touched.username && formik.errors.username && (
            <div className="error-message">{formik.errors.username}</div>
          )}

          <label className="register-label">Email</label>
          <input
            className="register-input"
            type="text"
            placeholder="Enter Email"
            autoComplete="off"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="error-message">{formik.errors.email}</div>
          )}

          <label className="register-label">Password</label>
          <div className="password-container">
            <input
              className="login-input"
              placeholder="Enter Password"
              autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              {...formik.getFieldProps("password")}
              onChange={(e) => {
                formik.handleChange(e);
                handlePasswordChange(e);
              }}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          {formik.touched.password && formik.errors.password && (
            <div className="error-message">{formik.errors.password}</div>
          )}

          {passwordStrength && (
            <div
              className={`password-strength ${passwordStrength.toLowerCase()}`}
              style={{
                color:
                  passwordStrength === "Weak"
                    ? "red"
                    : passwordStrength === "Medium"
                    ? "yellow"
                    : "green",
                fontWeight: "bold",
              }}
            >
              {passwordStrength} Password
            </div>
          )}

          <button className="register-btn" type="submit">
            Sign Up
          </button>

          <a
            href="http://localhost:5000/api/v1/users/auth/google"
            className="google-signin-btn"
          >
            <span>Sign in with Google</span>
          </a>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              navigate("/")
            }}
            style={{
              color: "#4a90e2",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
  
            }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Back to Dashboard
          </a>
        </div>

          
        </form>
      </div>
    </div>
  );
};

export default Register;

// npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core    dependency for the eye icon
