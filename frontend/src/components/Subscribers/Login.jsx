"use client"

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { loginAPI } from "../../APIServices/users/usersAPI"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import "./Login.css"

const Login = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)

  const userMutation = useMutation({
    mutationKey: ["user-login"],
    mutationFn: loginAPI,
  })

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await userMutation.mutateAsync(values)

        if (!response) {
          console.log("Login failed: No response from server")
          return
        }

        const userRole = response?.role

        // Invalidate old authentication data
        await queryClient.invalidateQueries(["user-auth"])

        // Redirect based on role
        switch (userRole) {
          case "admin":
            navigate("/admin")
            break
          case "curator":
            navigate("/curator")
            break
          case "subscriber":
            navigate("/subscriber")
            break
          default:
            navigate("/unauthorized")
        }
      } catch (error) {
        console.error("Login error:", error)
      }
    },
  })

  return (
    <div className="login-container">
      <div className="login-wrapper">

        <h1>Login</h1>
        <br />
        <form onSubmit={formik.handleSubmit}>
          <Link to="/register" className="login-link">
            <span>Don`t have an account? </span>
            <span className="font-bold font-heading">Register</span>
          </Link>

          <label className="login-label">Username</label>
          <input className="login-input" type="text" {...formik.getFieldProps("username")} />
          {formik.touched.username && formik.errors.username && (
            <div className="error-message">{formik.errors.username}</div>
          )}

          <label className="login-label">Password</label>
          <div className="password-container">
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              {...formik.getFieldProps("password")}
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

          <button className="login-btn" type="submit">
            Login
          </button>

          <a href="http://localhost:5000/api/v1/users/auth/google" className="google-signin-btn">
            <span>Sign in with Google</span>
          </a>

          <Link className="forgot-password" to="/forgot-password">
            Forgot Password?
          </Link>

          <div style={{ textAlign: "center", marginTop: "10px" }}>
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
  )
}

export default Login

// npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core    dependency for the eye icon

