import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { POST } from "../../../../../lib/request";
import { API } from "../../../../../lib/endpoint";
import { toast } from "react-hot-toast";

export default function EditDialog({ row, getnumberOfSite, sitesID, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  /* ---------- Populate Form ---------- */
  useEffect(() => {
    if (row) {
      reset({
        siteName: row.siteName || "",
        uid: row.uid || "",
        location: row.location || "",
        pincode: row.pincode || "",
        state: row.state || "",
        country: row.country || "",
      });
    }
  }, [row, reset]);

  /* ---------- Update Site ---------- */
  const updateSite = async (data) => {
    try {
      const res = await POST(API.SITE.EDIT, {
        siteId: sitesID,
        ...data,
      });

      if (res) {
        toast.success("Site updated successfully");
        getnumberOfSite();
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update site");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Edit Site</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(updateSite)}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Site Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Site Name
              </label>
              <input
                {...register("siteName", {
                  required: "Site Name is required",
                })}
                placeholder="Enter site name"
                className="w-full mt-2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              {errors.siteName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.siteName.message}
                </p>
              )}
            </div>

            {/* UID */}
            <div>
              <label className="text-sm font-medium text-gray-700">UID</label>
              <input
                {...register("uid", {
                  required: "UID is required",
                })}
                placeholder="Enter UID"
                className="w-full mt-2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              {errors.uid && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.uid.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                {...register("location", {
                  required: "Location is required",
                })}
                placeholder="Enter location"
                className="w-full mt-2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Pincode
              </label>
              <input
                type="number"
                {...register("pincode", {
                  required: "Pincode is required",
                })}
                placeholder="Enter pincode"
                className="w-full mt-2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              {errors.pincode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.pincode.message}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="text-sm font-medium text-gray-700">State</label>
              <input
                {...register("state", {
                  required: "State is required",
                })}
                placeholder="Enter state"
                className="w-full mt-2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                {...register("country", {
                  required: "Country is required",
                })}
                placeholder="Enter country"
                className="w-full mt-2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
