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

  const [passwordError, setPasswordErr] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // const [toast, setToast] = useState(null);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordInput({
      ...passwordInput,
      [name]: value.trim(),
    });
  };

  const handleValidation = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      const uppercase = /(?=.*?[A-Z])/;
      const lowercase = /(?=.*?[a-z])/;
      const digit = /(?=.*?[0-9])/;
      const special = /(?=.*?[#?!@$%^&*-])/;

      let msg = "";

      if (!value) msg = "Password cannot be empty";
      else if (!uppercase.test(value)) msg = "At least one uppercase letter";
      else if (!lowercase.test(value)) msg = "At least one lowercase letter";
      else if (!digit.test(value)) msg = "At least one number";
      else if (!special.test(value)) msg = "At least one special character";
      else if (value.length < 8) msg = "Minimum 8 characters required";

      setPasswordErr(msg);
    }

    if (
      name === "confirmPassword" ||
      (name === "password" && passwordInput.confirmPassword)
    ) {
      if (passwordInput.password !== passwordInput.confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const resetPassword = async () => {
    if (!passwordInput.password) {
      setPasswordErr("Password required");
      return;
    }

    if (passwordInput.password !== passwordInput.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    try {
      const res = await POST(API.USERS.RESET_PASSWORD, {
        userId: UserID,
        password: passwordInput.confirmPassword,
      });

      if (res) {
        toast.success("Password reset successfully");
        // setToast({
        //   type: "success",
        //   msg: res?.msg || "Password reset successfully",
        // });
        setOpen(false);
        getnumberOfUser();
      } else {
        toast.error("Failed to reset password");
        // setToast({ type: "error", msg: "Failed to reset password" });
      }
    } catch {
      toast.error("Something went wrong");
      // setToast({ type: "error", msg: "Something went wrong" });
    }
  };

  return (
    <>
      {/* Icon Button */}
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
                    onKeyUp={handleValidation}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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

                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
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
                    name="confirmPassword"
                    value={passwordInput.confirmPassword}
                    onChange={handlePasswordChange}
                    onKeyUp={handleValidation}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                className="px-4 py-2 text-white rounded-lg bg-gradient-to-br from-[#0a192f] to-[#0f3057] hover:opacity-90 transition shadow-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </>
  );
}
