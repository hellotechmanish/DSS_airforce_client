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
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    const payload = {
      fullName: data.fullName,
      uid: data.uid,
      password: data.password,
      type: "user",
    };

    try {
      setLoading(true);

      await POST(API.USERS.CREATE, payload);

      toast.success("User created successfully");

      getnumberOfUser();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("User creation failed");
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
            {...register("fullName", { required: "Required" })}
            className="border px-4 py-2 w-full"
          />
          {errors.fullName && <p>{errors.fullName.message}</p>}
        </div>

        <div>
          <label>UID</label>
          <input
            {...register("uid", { required: "Required" })}
            className="border px-4 py-2 w-full"
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="border px-4 py-2 w-full"
          />
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className="border px-4 py-2 w-full"
          />
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
