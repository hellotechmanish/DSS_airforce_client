"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";

import { POST } from "../../../../../lib/request";
import { API } from "../../../../../lib/endpoint";

export default function ResetTechnicianPassword({
  techID,
  getnumberOftechnician,
}) {
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const res = await POST(API.USERS.RESET_PASSWORD, {
        userId: techID,
        password: data.confirmPassword,
      });

      if (res) {
        toast.success(res?.msg || "Password reset successfully");
        setOpen(false);
        reset();
        getnumberOftechnician();
      } else {
        toast.error(res?.err || "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setShow(false);
    setShowConfirm(false);
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="Reset Password"
      >
        <RiLockPasswordLine size={20} />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Reset Technician Password
              </h2>

              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div>
                  <label className="text-sm text-gray-600">New Password</label>

                  <div className="relative mt-2">
                    <input
                      type={show ? "text" : "password"}
                      placeholder="Enter strong password"
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Minimum 8 characters required",
                        },
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-])/,
                          message:
                            "Must include uppercase, lowercase, number & special char",
                        },
                      })}
                    />

                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-2 text-gray-500"
                    >
                      {show ? (
                        <AiOutlineEye size={20} />
                      ) : (
                        <AiOutlineEyeInvisible size={20} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-sm text-gray-600">
                    Confirm Password
                  </label>

                  <div className="relative mt-2">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                      {...register("confirmPassword", {
                        required: "Confirm password is required",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-2 text-gray-500"
                    >
                      {showConfirm ? (
                        <AiOutlineEye size={20} />
                      ) : (
                        <AiOutlineEyeInvisible size={20} />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 text-white rounded-lg bg-gradient-to-br from-[#0a192f] to-[#0f3057] hover:opacity-90 transition shadow-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
