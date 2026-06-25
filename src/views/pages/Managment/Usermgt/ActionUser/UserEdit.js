"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CiEdit } from "react-icons/ci";
import { API } from "../../../../../lib/endpoint";
import { POST } from "../../../../../lib/request";
import toast from "react-hot-toast";

export default function EditUserModal({ getnumberOfUser, row, UserID }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const EditUser = async (data) => {
    try {
      const res = await POST(API.USERS.EDIT, {
        userRole: 2,
        fullName: data.fullName,
        uid: data.uid,
        userId: UserID,
      });

      if (res) {
        toast.success(res?.msg || "User updated successfully");
        getnumberOfUser();
        setOpen(false);
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (row) {
      setValue("fullName", row.fullName);
      setValue("uid", row.uid);
    }
  }, [row, setValue]);

  return (
    <>
      {/* Edit Button */}
      <button
        onClick={handleOpen}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
      >
        <CiEdit size={20} />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-xl p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Edit User</h2>

              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(EditUser)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="text-sm text-gray-900">Full Name</label>

                  <input
                    {...register("fullName", {
                      required: "Full name is required",
                    })}
                    className="w-full mt-2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />

                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* UID */}
                <div>
                  <label className="text-sm text-gray-900">UID</label>

                  <input
                    {...register("uid", {
                      required: "UID is required",
                    })}
                    className="w-full mt-2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />

                  {errors.uid && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.uid.message}
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
