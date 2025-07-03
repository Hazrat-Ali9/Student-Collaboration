"use client";
// Forget Password page
import "../../auth.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import forgotApi from "@/app/api/forgotApi";


export default function Forgot() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    forgotApi(data,toast, router, setTimeout)

  };

  return (
    <div className="container">
      <div className="con_row">
        <div className="first_haf"></div>
        <div className="second_haf"></div>
      </div>

      {/* form container */}
      <div className="form_main_con">
        <p className="signup_text">FORGOT PASSWORD</p>
        <p className="fill_text mt">
          Please enter your valid email to process.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
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
              className="form-input mt"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button mt">
            GENERATE OTP
          </button>
          <p className="already_account mt">
          If you have already account please?{" "}
            <span>
              <Link href="/login" className="signin_link">
                Sign in
              </Link>
            </span>
          </p>
          <p className="creator_text">Createdby Name</p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
