"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";

import { API } from "../../../../../lib/endpoint";
import { POST } from "../../../../../lib/request";

export default function CreateTechnician({ getnumberOftechnician }) {
  const [open, setOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  // ===============================
  // Submit
  // ===============================
  const onSubmit = async (data) => {
    try {
      const res = await POST(API.USERS.CREATE, {
        fullName: data.fullName,
        username: data.uid,
        password: data.password,
        type: "technician",
      });

      toast.success(res?.msg || "Technician created successfully");

      setOpen(false);
      reset();
      getnumberOftechnician();
    } catch (err) {
      toast.error(err?.msg || "Failed to create technician");
    }
  };

  return (
    <>
      {/* Command Button */}
      <button
        onClick={() => setOpen(true)}
        className="bg-[#0f3057] text-white px-5 py-2 border border-[#4da8da] 
             hover:bg-[#163e6b] transition tracking-wide font-semibold 
             rounded-lg"
      >
        + ADD TECHNICIAN
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative">
            {/* Header */}
            <h2 className="text-xl font-semibold text-[#0f3057] mb-6">
              Add Technician
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter full name (e.g., Rahul Sharma)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                 focus:outline-none focus:ring-2 focus:ring-[#0f3057]
                 focus:border-[#0f3057]
                 placeholder:text-gray-400 transition"
                  {...register("fullName", {
                    required: "Full Name is required",
                  })}
                />

                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* UID */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  UID
                </label>

                <input
                  type="text"
                  placeholder="Enter unique ID (e.g., AF00123)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                 focus:outline-none focus:ring-2 focus:ring-[#0f3057]
                 focus:border-[#0f3057]
                 placeholder:text-gray-400 transition"
                  {...register("uid", {
                    required: "UID is required",
                  })}
                />

                {errors.uid && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.uid.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Password
                </label>

                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Create password (min 6 characters)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                 focus:outline-none focus:ring-2 focus:ring-[#0f3057]
                 focus:border-[#0f3057]
                 placeholder:text-gray-400 transition pr-12"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters required",
                    },
                  })}
                />

                <span
                  className="absolute right-4 top-[38px] cursor-pointer text-gray-500 hover:text-[#0f3057] transition"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <AiOutlineEye size={18} />
                  ) : (
                    <AiOutlineEyeInvisible size={18} />
                  )}
                </span>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password to confirm"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                 focus:outline-none focus:ring-2 focus:ring-[#0f3057]
                 focus:border-[#0f3057]
                 placeholder:text-gray-400 transition pr-12"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />

                <span
                  className="absolute right-4 top-[38px] cursor-pointer text-gray-500 hover:text-[#0f3057] transition"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <AiOutlineEye size={18} />
                  ) : (
                    <AiOutlineEyeInvisible size={18} />
                  )}
                </span>

                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    reset();
                  }}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg
                 hover:bg-gray-100 transition font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg text-white font-medium
                 bg-gradient-to-r from-[#0a192f] to-[#0f3057]
                 hover:opacity-90 transition shadow-md"
                >
                  {isSubmitting ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
