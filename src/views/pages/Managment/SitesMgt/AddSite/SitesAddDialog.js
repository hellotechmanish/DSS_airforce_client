import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { POST } from "../../../../../lib/request";
import { API } from "../../../../../lib/endpoint";
import toast from "react-hot-toast";

export default function AddSiteDialog({ getnumberOfSite, buttonClass = "" }) {
  const [open, setOpen] = useState(false);
  const [uidMatch, setUidMatch] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const uid = watch("uid");

  const handleClose = () => {
    setOpen(false);
    reset();
    setUidMatch(true);
  };

  const createSite = async (data) => {
    try {
      const res = await POST(API.SITE.CREATE, data);

      if (res) {
        toast.success("site created successfully");
        getnumberOfSite();
        handleClose();
      }
    } catch (error) {
      console.error(error, "Failed to create site");
      toast.error("Failed to create site");
    }
  };

  const checkUid = useCallback(async () => {
    if (!uid) return;

    try {
      const res = await POST(API.SITE.CHECK_UID, { uid });
      setUidMatch(res?.status ?? false);
    } catch {
      setUidMatch(false);
    }
  }, [uid]);

  useEffect(() => {
    checkUid();
  }, [checkUid]);

  return (
    <>
      {/* Add Site Button */}
      <button
        onClick={() => setOpen(true)}
        className={`
    px-5 py-2
    rounded-lg
    transition-all duration-200
    ${buttonClass}
  `}
      >
        + Add Site
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Add Site</h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-red-500 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(createSite)}>
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
                    placeholder="e.g. Delhi Command Center"
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
                  <label className="text-sm font-medium text-gray-700">
                    UID
                  </label>
                  <input
                    {...register("uid", { required: "UID is required" })}
                    placeholder="e.g. SITE-DEL-001"
                    className="w-full mt-2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                  {!uidMatch && (
                    <p className="text-red-500 text-xs mt-1">
                      UID already exists!
                    </p>
                  )}
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
                    placeholder="e.g. New Delhi"
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
                    placeholder="e.g. 110001"
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
                  <label className="text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    {...register("state", { required: "State is required" })}
                    placeholder="e.g. Delhi"
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
                    placeholder="e.g. India"
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
                  onClick={handleClose}
                  className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!uidMatch}
                  className="px-5 py-2 
             bg-transparent
             border border-blue-900
             text-blue-900 text-sm font-semibold
             rounded-lg
             transition-all duration-200
             hover:bg-blue-900 hover:text-white"
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
