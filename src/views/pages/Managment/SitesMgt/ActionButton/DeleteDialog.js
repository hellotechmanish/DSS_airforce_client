import React from "react";
import { POST } from "../../../../../lib/request";
import { API } from "../../../../../lib/endpoint";
import { toast } from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";

export default function DeleteDialog({ sitesID, getnumberOfSite, onClose }) {
  const deleteSite = async () => {
    try {
      const res = await POST(API.SITE.DELETE, {
        siteId: sitesID,
      });

      if (res) {
        toast.success("Site deleted successfully");
        getnumberOfSite();
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete site");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiTrash2 className="text-red-600" />
            Delete Site
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-gray-700">
          Are you sure you want to delete this site?
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={deleteSite}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
