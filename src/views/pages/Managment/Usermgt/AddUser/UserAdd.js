"use client";

import React, { useState } from "react";
import SimpleUser from "./AddUserStepper";

export default function AddUserDialog({ getnumberOfUser }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="bg-[#0f3057] text-white px-5 py-2 border border-[#4da8da] 
                   hover:bg-[#163e6b] transition tracking-wide font-semibold 
                   rounded-lg"
      >
        + ADD USER
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-[#0f3057] font-semibold text-lg">Add User</h2>

              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 bg-gray-50 rounded-b-xl">
              <SimpleUser
                handleClose={() => setOpen(false)}
                open={open}
                setOpen={setOpen}
                getnumberOfUser={getnumberOfUser}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
