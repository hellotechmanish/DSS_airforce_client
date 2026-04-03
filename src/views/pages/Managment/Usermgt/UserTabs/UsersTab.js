"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import NodataFound from "../../../../../assets/img/nodatafound.png";

import EditTechnician from "../ActionUser/UserEdit";
import DeleteDialog from "../ActionUser/DeleteUser";
import PasswordReset from "../ActionUser/UserPasswordReset";
import { FaEye } from "react-icons/fa";

export default function Sites({ user = [], getnumberOfUser }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //  MODAL STATE (NEW)
  const [openModal, setOpenModal] = useState(false);
  const [selectedSites, setSelectedSites] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getnumberOfUser();
  }, [getnumberOfUser]);

  // ================= FILTER =================
  const filteredData = useMemo(() => {
    return user.filter((row) =>
      `${row.uid} ${row.fullName}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [user, search]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const visiblePages = useMemo(() => {
    const max = 5;
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + max - 1, totalPages);

    if (end - start < max - 1) {
      start = Math.max(end - max + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  // ✅ OPEN MODAL FUNCTION (NEW)
  const handleOpenSites = (row) => {
    setSelectedSites(row?.sites || []);
    setSelectedUser(row);
    setOpenModal(true);
  };

  return (
    <div className="mt-10 mb-16 w-full">
      {/* SEARCH */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Users</h2>

        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded-lg text-sm"
        />
      </div>

      {filteredData.length > 0 ? (
        <>
          <div className="bg-white rounded-xl shadow-md border overflow-x-auto">
            <table className="min-w-full text-sm text-center">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">UID</th>
                  <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Sites</th>
                  <th className="px-6 py-4">Password</th>
                  <th className="px-6 py-4">Added On</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((row, index) => (
                  <tr key={row._id} className="border-b hover:bg-gray-50">
                    {/* SERIAL */}
                    <td className="px-6 py-4">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>

                    {/* UID */}
                    <td className="px-6 py-4 text-blue-600 font-semibold">
                      <Link to="/user-profile" state={row}>
                        {row?.uid}
                      </Link>
                    </td>

                    {/* NAME */}
                    <td className="px-6 py-4 font-medium">
                      {/* <Link to="/user-profile" state={row}> */}
                      {row?.fullName}
                      {/* </Link> */}
                    </td>

                    {/* ✅ SITE COUNT + EYE (UPDATED ONLY THIS) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs font-semibold">
                          {row?.siteCount}
                        </span>

                        <FaEye
                          className="text-blue-600 cursor-pointer text-lg hover:scale-110 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSites(row);
                          }}
                        />
                      </div>
                    </td>

                    {/* PASSWORD */}
                    <td className="px-6 py-4 text-gray-500">*********</td>

                    {/* DATE */}
                    <td className="px-6 py-4">
                      {dayjs(row?.createdAt).format("DD-MM-YYYY")}
                    </td>

                    {/* ACTION */}
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

          {/* PAGINATION (UNCHANGED) */}
          <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1} -
              {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
              {filteredData.length}
            </div>

            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Prev
              </button>

              {visiblePages.map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === p
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span>Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center mt-16">
          <img
            alt="No Data Found"
            src={NodataFound}
            className="w-52 opacity-80"
          />
          <p className="mt-6 text-gray-700 font-semibold">No User Found!</p>
          <p className="mt-2 text-gray-500">Click Add Button</p>
        </div>
      )}

      {/* 🔥 MODAL (NEW ONLY) */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-[95%] max-w-4xl max-h-[85vh] rounded-xl shadow-lg flex flex-col">
            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">Assigned Sites</h2>
                <p className="text-sm text-gray-500">
                  {selectedUser?.fullName}
                </p>
              </div>

              <button
                onClick={() => setOpenModal(false)}
                className="text-red-500 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="overflow-y-auto p-4 flex-1">
              {selectedSites.length > 0 ? (
                <table className="w-full text-sm text-center border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Site Name</th>
                      <th className="p-2">UID</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedSites.map((site, index) => (
                      <tr key={site._id} className="border-t">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{site.siteName}</td>
                        <td className="p-2">{site.uid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500">No sites assigned</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
