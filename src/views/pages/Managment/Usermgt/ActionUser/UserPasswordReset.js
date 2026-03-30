"use client";

import { useState } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { POST } from "../../../../../lib/request";
import { API } from "../../../../../lib/endpoint";
import toast from "react-hot-toast";

export default function ResetPasswordModal({ UserID, getnumberOfUser }) {
  const [open, setOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordInput, setPasswordInput] = useState({
    password: "",
    confirmPassword: "",
  });

  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const password = passwordInput.password;

  // 🔥 Live validations
  const validations = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[#?!@$%^&*-]/.test(password),
  };

  const isPasswordValid =
    validations.length &&
    validations.upper &&
    validations.lower &&
    validations.number &&
    validations.special;

  // 🔄 Handle input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    const updated = {
      ...passwordInput,
      [name]: value,
    };

    setPasswordInput(updated);

    // 🔁 Confirm password live check
    if (
      updated.confirmPassword &&
      updated.password !== updated.confirmPassword
    ) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const resetPassword = async () => {
    if (!isPasswordValid) {
      toast.error("Please enter a strong password");
      return;
    }

    if (passwordInput.password !== passwordInput.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    try {
      const res = await POST(API.USERS.RESET_PASSWORD, {
        userId: UserID,
        password: passwordInput.password,
      });

      if (res) {
        toast.success("Password reset successfully");
        setOpen(false);
        setPasswordInput({ password: "", confirmPassword: "" });
        getnumberOfUser();
      } else {
        toast.error("Failed to reset password");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition"
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
                Reset User Password
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label className="text-sm text-gray-600">New Password</label>

                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={passwordInput.password}
                    onChange={handlePasswordChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-gray-500"
                  >
                    {showPassword ? (
                      <AiOutlineEye size={20} />
                    ) : (
                      <AiOutlineEyeInvisible size={20} />
                    )}
                  </button>
                </div>

                {/* 🔥 Live checklist */}
                <div className="mt-2 space-y-1 text-xs">
                  <p
                    className={
                      validations.length ? "text-green-600" : "text-gray-400"
                    }
                  >
                    {validations.length ? "✔" : "✖"} At least 8 characters
                  </p>
                  <p
                    className={
                      validations.upper ? "text-green-600" : "text-gray-400"
                    }
                  >
                    {validations.upper ? "✔" : "✖"} One uppercase letter
                  </p>
                  <p
                    className={
                      validations.lower ? "text-green-600" : "text-gray-400"
                    }
                  >
                    {validations.lower ? "✔" : "✖"} One lowercase letter
                  </p>
                  <p
                    className={
                      validations.number ? "text-green-600" : "text-gray-400"
                    }
                  >
                    {validations.number ? "✔" : "✖"} One number
                  </p>
                  <p
                    className={
                      validations.special ? "text-green-600" : "text-gray-400"
                    }
                  >
                    {validations.special ? "✔" : "✖"} One special character
                  </p>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm text-gray-600">
                  Confirm Password
                </label>

                <div className="relative mt-2">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordInput.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
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

                {confirmPasswordError && (
                  <p className="text-red-500 text-xs mt-1">
                    {confirmPasswordError}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={resetPassword}
                disabled={!isPasswordValid}
                className={`px-4 py-2 text-white rounded-lg transition shadow-md ${
                  isPasswordValid
                    ? "bg-gradient-to-br from-[#0a192f] to-[#0f3057] hover:opacity-90"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
