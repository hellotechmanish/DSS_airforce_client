"use client";
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AuthContext } from "../../../context/AuthContext";
import { POST } from "../../../lib/request";
import { API } from "../../../lib/endpoint";
import toast from "react-hot-toast";

export default function UserManagment() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      uid: user?.uid || "",
      fullName: user?.fullName || "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {

    try {
      // If password is provided, reset it

      await POST(API.USERS.RESET_PASSWORD, {
        userId: user?.userID,
        password: data.confirmPassword,
      });

      toast.success("Password updated successfully");
      setIsEditing(false);
      reset();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 p-6">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link to="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">User Management</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="bg-[#0f3057] rounded-xl p-5 mb-6 flex justify-between items-center shadow-lg">
        <h1 className="text-white text-xl font-semibold">USER PROFILE</h1>
        <span className="text-white text-bold text-md">
          Manage your account details
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Personal Information
          </h2>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-10 py-2 border border-blue-900 text-blue-900 rounded-md hover:bg-blue-50 transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* UID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UID
              </label>
              <input
                {...register("uid")}
                disabled={!isEditing || user?.role === "admin"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                {...register("fullName", { required: "Full name is required" })}
                disabled={!isEditing || user?.role === "admin"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Password (only in edit mode) */}
            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password", {
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                      pattern: {
                        value:
                          /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/,
                        message:
                          "Password must contain uppercase, lowercase, digit, and special character",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="text-gray-400" />
                    ) : (
                      <AiOutlineEye className="text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}

            {/* Confirm Password (only in edit mode and if password is entered) */}
            {isEditing && password && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  {...register("confirmPassword", {
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Update
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
