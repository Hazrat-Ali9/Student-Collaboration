"use client";

import "../../styles/adduser.css";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import Image from "next/image";
import addUserApi from "@/app/api/addUserApi";
import { clearEditData } from "@/redux/features/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";


export default function AddUsers() {
  // for handling image
  const [selectedImage, setSelectedImage] = useState(null);
  const editData = useSelector((state) => state.dashboard.edit);
  const router = useRouter();

  let user = JSON.parse(localStorage.getItem('user')|| '{}');

  const dispatch = useDispatch();
  console.log(editData, 'Edit data .................')

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleButtonClick = () => {
    document.getElementById("imageInput").click();
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      department: "",
      email: "",
      role: "",
      phone: "",
      cnic: "",
      address: "",
      dob: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    addUserApi(data, toast).then(()=>{
      router.push("/dashboard/user-details") 

    });
    dispatch(clearEditData());
    reset({
      name: "",
      department: "",
      email: "",
      role: "",
      phone: "",
      cnic: "",
      address: "",
      dob: "",
    });
  };

  useEffect(() => {
    console.log("editData:", editData); // Check what `editData` is
    if (editData && editData.length !== 0) {
      const formattedDOB = editData.dob
      ? new Date(editData.dob).toISOString().split("T")[0]
      : "";
      reset({ ...editData, dob: formattedDOB });
    } else {
      reset(); // Clear the form when not editing
    }
  }, [editData, reset]);

  return (
    <>
      <div className="main_con">
        <div className="info_div">
          <p className="info_text">General Info</p>
        </div>
        {/* form container */}
        <div className="form_con">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-flex-row">
              {/* form first haf */}
              <div className="flex-grow-1">
                <div className="form-group">
                  <label
                    htmlFor="name"
                    className={`form-label ${errors.name ? "error-label" : ""}`}
                  >
                    Name{" "}
                    {errors.name && <span className="error-asterisk">*</span>}
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    {...register("name", { required: "Name is required" })}
                    className="form-input"
                  />
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label
                    htmlFor="email"
                    className={`form-label ${errors.email ? "error-label" : ""
                      }`}
                  >
                    Email{" "}
                    {errors.email && <span className="error-asterisk">*</span>}
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
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
                <div className="form-group">
                  <label
                    htmlFor="dob"
                    className={`form-label ${errors.dob ? "error-label" : ""
                      }`}
                  >
                    DOB{" "}
                    {errors.dob && (
                      <span className="error-asterisk">*</span>
                    )}
                  </label>
                  <input
                    id="dob"
                    type="date"
                    placeholder="YY-MM-DD"
                    {...register("dob", {
                      required: "DOB is required",
                    })}
                    className="form-input"
                  />
                </div>

                {/* Role Select */}
                <div className="form-group">
                  <label
                    htmlFor="role"
                    className={`form-label ${errors.role ? "error-label" : ""}`}
                  >
                    Role{" "}
                    {errors.role && <span className="error-asterisk">*</span>}
                  </label>
                  <select
                    {...register("role", {
                      required: "Please select a role",
                    })}
                    disabled={user.role.match(/user/i)}
                    className="form-select"
                  >
                    <option value="">Select a role</option>
                    <option value="superadmin">Superadmin</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>

                {/* Department Select */}
                <div className="form-group">
                  <label
                    htmlFor="department"
                    className={`form-label ${errors.department ? "error-label" : ""
                      }`}
                  >
                    Department{" "}
                    {errors.department && (
                      <span className="error-asterisk">*</span>
                    )}
                  </label>
                  <select
                    {...register("department", {
                      required: "Please select a department",
                    })}
                    className="form-select"
                  >
                    <option value="">Select a department</option>
                    <option value="IT">IT</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Medical">Medical</option>
                    <option value="English">English</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Economics">Economics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* form second haf */}
              <div className="flex-grow-1">
                {/* image flex */}
              

                <div className="form-group">
                  <label
                    htmlFor="phone"
                    className={`form-label ${errors.phone ? "error-label" : ""
                      }`}
                  >
                    Phone{" "}
                    {errors.phone && <span className="error-asterisk">*</span>}
                  </label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="Enter your phone"
                    {...register("phone", { required: "Phone is required" })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="cnic"
                    className={`form-label ${errors.cnic ? "error-label" : ""}`}
                  >
                    Cnic{" "}
                    {errors.cnic && <span className="error-asterisk">*</span>}
                  </label>
                  <input
                    id="cnic"
                    type="text"
                    placeholder="Enter your cnic"
                    {...register("cnic", { required: "Cnic is required" })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="address"
                    className={`form-label ${errors.address ? "error-label" : ""
                      }`}
                  >
                    Address{" "}
                    {errors.address && (
                      <span className="error-asterisk">*</span>
                    )}
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="Enter your address"
                    {...register("address", {
                      required: "address is required",
                    })}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="create-button">
              {editData.length !== 0 ? "Update" : "Create"}
            </button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
