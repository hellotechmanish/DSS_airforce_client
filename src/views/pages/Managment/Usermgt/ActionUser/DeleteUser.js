"use client";

import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";
import { POST } from "../../../../../lib/request";
import { API } from "../../../../../lib/endpoint";

export default function DeleteUserModal({ UserID, getnumberOfUser }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  console.log("DeleteUserModal rendered with UserID:", UserID);
  const DeleteUser = async () => {
    try {
      setLoading(true);

      const res = await POST(API.USERS.DELETE, {
        userId: UserID,
      });

      if (res) {
        toast.success(res?.msg || "User deleted successfully");
        getnumberOfUser?.();
        setOpen(false);
      } else {
        toast.error(res?.err || "Failed to delete user");
      }
    } catch (error) {
      console.error("DeleteUser error:", error);
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Delete Icon Button */}
      <button
        onClick={handleOpen}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        title="Delete"
      >
        <RiDeleteBin6Line size={20} />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Delete User
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete this user?
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                disabled={loading}
              >
                No
              </button>

              <button
                onClick={DeleteUser}
                disabled={loading}
                className="px-4 py-2 text-white rounded-lg bg-red-600 hover:bg-red-700 transition shadow"
              >
                {loading ? "Deleting..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
