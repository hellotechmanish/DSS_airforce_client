"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import NodataFound from "../../../../../assets/img/nodatafound.png";

import EditTechnician from "../ActionUser/UserEdit";
import DeleteDialog from "../ActionUser/DeleteUser";
import PasswordReset from "../ActionUser/UserPasswordReset";

export default function Sites({ user, getnumberOfUser }) {
  useEffect(() => {
    getnumberOfUser();
  }, [getnumberOfUser]);

  return (
    <div className="mt-10 mb-16 w-full">
      {user?.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md border overflow-x-auto">
          <table className="min-w-full text-sm text-center">
            {/* ===== Table Head ===== */}
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">UID</th>
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Sites</th>
                <th className="px-6 py-4">Password</th>
                <th className="px-6 py-4">Added On</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            {/* ===== Table Body ===== */}
            <tbody>
              {user.map((row) => (
                <tr
                  key={row._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* UID */}
                  <td className="px-6 py-4 font-semibold text-blue-600">
                    <Link
                      to="/user-profile"
                      state={row}
                      className="hover:underline"
                    >
                      {row?.uid}
                    </Link>
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 font-medium text-gray-800">
                    <Link
                      to="/user-profile"
                      state={row}
                      className="hover:underline"
                    >
                      {row?.fullName}
                    </Link>
                  </td>

                  {/* Site Count */}
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {row?.siteCount}
                  </td>

                  {/* Password */}
                  <td className="px-6 py-4 text-gray-500">*********</td>

                  {/* Date */}
                  <td className="px-6 py-4 text-gray-700">
                    {dayjs(row?.createdAt).format("DD-MM-YYYY")}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4">
                      <EditTechnician
                        UserID={row._id}
                        row={row}
                        getnumberOfUser={getnumberOfUser}
                      />

                      <PasswordReset
                        UserID={row._id}
                        getnumberOfUser={getnumberOfUser}
                      />

                      <DeleteDialog
                        UserID={row._id}
                        getnumberOfUser={getnumberOfUser}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-16">
          <img
            src={NodataFound}
            alt="No User Found"
            className="w-52 opacity-80"
          />

          <p className="mt-6 text-gray-700 font-semibold">No User Found!</p>

          <p className="mt-2 text-gray-500">Click Add Button</p>
        </div>
      )}
    </div>
  );
}
