"use client";
// sign up page
import "../../auth.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import signUpApi from "@/app/api/signupApi";

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    signUpApi(data, router, toast, setTimeout);
    // reset();
  };

  return (
    <div className="container">
      <div className="con_row">
        <div className="first_haf"></div>
        <div className="second_haf"></div>
      </div>

      {/* form container */}
      <div className="form_main_con">
        <p className="signup_text">SIGN UP</p>
        <p className="fill_text">
          Please fill your detail to create your account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label
              htmlFor="name"
              className={`form-label ${errors.name ? "error-label" : ""}`}
            >
              Name {errors.name && <span className="error-asterisk">*</span>}
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
              className="form-input"
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label
              htmlFor="email"
              className={`form-label ${errors.email ? "error-label" : ""}`}
            >
              Email {errors.email && <span className="error-asterisk">*</span>}
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format",
                },
              })}
              className="form-input"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <div style={{ display: "flex", gap: "10px" }}>
              <label
                style={{ width: "100%" }}
                htmlFor="password"
                className={`form-label ${errors.password ? "error-label" : ""}`}
              >
                Password{" "}
                {errors.password && <span className="error-asterisk">*</span>}
              </label>
              <div
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </div>
            </div>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="form-input"
              />
           
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <div style={{ display: "flex", gap: "10px" }}>
              <label
                htmlFor="confirmPassword"
                className={`form-label ${
                  errors.confirmPassword ? "error-label" : ""
                }`}
              >
                Confirm Password{" "}
                {errors.confirmPassword && (
                  <span className="error-asterisk">*</span>
                )}
              </label>
              <div
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </div>
            </div>
           
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className="form-input"
              />
           
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Signup
          </button>
          <p className="already_account">
            If you already have an account, please?{" "}
            <span>
              <Link href="/login" className="signin_link">
                Sign In
              </Link>
            </span>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
