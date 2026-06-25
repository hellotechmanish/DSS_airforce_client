"use client";

import { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { POST } from "../../../../../lib/request";
import { API } from "../../../../../lib/endpoint";

export default function EditTechnicianModal({
  techID,
  row,
  getnumberOftechnician,
}) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const EditTechnician = async (data) => {
    try {
      const res = await POST(API.USERS.EDIT, {
        fullName: data.fullName,
        uid: data.uid,
        userRole: 1,
        userId: techID,
      });

      if (res) {
        toast.success(res?.msg || "Technician updated successfully");
        getnumberOftechnician();
        setOpen(false);
      } else {
        toast.error(res?.err || "Failed to update technician");
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
        title="Edit"
      >
        <CiEdit size={20} />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Edit Technician
              </h2>

              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(EditTechnician)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="text-sm text-gray-600">Full Name</label>

                  <input
                    {...register("fullName", {
                      required: "Full Name is required",
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
                  <label className="text-sm text-gray-600">UID</label>

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
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
