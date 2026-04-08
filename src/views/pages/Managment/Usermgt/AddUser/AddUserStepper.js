"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { POST } from "../../../../../lib/request";
import { API } from "../../../../../lib/endpoint";
import toast from "react-hot-toast";

export default function SimpleUser({ setOpen, getnumberOfUser }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    const payload = {
      fullName: data.fullName?.trim(),
      username: data.uid?.trim().toUpperCase(),
      password: data.password,
      type: "user",
    };

    try {
      setLoading(true);

      const res = await POST(API.USERS.CREATE, payload);

      const message =
        res?.data?.message || res?.message || "User created successfully";

      toast.success(message);

      reset();
      getnumberOfUser();
      setOpen(false);
    } catch (err) {
      console.error("User create error:", err);

      const message =
        err?.response?.data?.message || err?.message || "User creation failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-6"
      >
        <div>
          <label>Full Name</label>
          <input
            placeholder="Enter full name"
            {...register("fullName", {
              required: "Full name is required",
              minLength: {
                value: 3,
                message: "Minimum 3 characters required",
              },
            })}
            className="border px-4 py-2 w-full"
          />
          {errors.fullName && <p>{errors.fullName.message}</p>}
        </div>

        <div>
          <label>UID</label>
          <input
            placeholder="Enter unique user ID"
            {...register("uid", {
              required: "UID is required",
              minLength: {
                value: 3,
                message: "UID must be at least 3 characters",
              },
            })}
            className="border px-4 py-2 w-full"
          />
          {errors.uid && <p>{errors.uid.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters required",
              },
            })}
            className="border px-4 py-2 w-full"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter password"
            {...register("confirmPassword", {
              required: "Confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className="border px-4 py-2 w-full"
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>

        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
