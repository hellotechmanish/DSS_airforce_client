"use client";

import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

import NodataFound from "../../../../../assets/img/nodatafound.png";

import EditTechnician from "../ActionTechnician/EditTechnician";
import DeleteDialog from "../ActionTechnician/DeleteTechnician";
import PasswordReset from "../ActionTechnician/PasswordReset";

export default function Sites({ technician = [], getnumberOftechnician }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ================= FILTER =================
  const filteredData = useMemo(() => {
    return technician.filter((row) =>
      `${row.uid} ${row.fullName}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [technician, search]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  //    Fix page overflow
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  //    limit visible page buttons
  const visiblePages = useMemo(() => {
    const max = 5;
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + max - 1, totalPages);

    if (end - start < max - 1) {
      start = Math.max(end - max + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  return (
    <div className="mt-10 mb-16 w-full">
      {/* 🔍 SEARCH */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Technicians</h2>

        <input
          type="text"
          placeholder="Search technician..."
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
                  <th className="px-6 py-4">Technician Name</th>
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
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      <Link to="/technician-profile" state={row}>
                        {row.uid}
                      </Link>
                    </td>

                    {/* NAME */}
                    <td className="px-6 py-4 font-medium">
                      <Link to="/technician-profile" state={row}>
                        {row.fullName}
                      </Link>
                    </td>

                    {/* PASSWORD */}
                    <td className="px-6 py-4 text-gray-500">*********</td>

                    {/* DATE */}
                    <td className="px-6 py-4">
                      {dayjs(row.createdAt).format("DD-MM-YYYY")}
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        <EditTechnician
                          techID={row._id}
                          row={row}
                          getnumberOftechnician={getnumberOftechnician}
                        />

                        <PasswordReset
                          techID={row._id}
                          getnumberOftechnician={getnumberOftechnician}
                        />

                        <DeleteDialog
                          techID={row._id}
                          getnumberOftechnician={getnumberOftechnician}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔢 PAGINATION */}
          <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
            {/* LEFT */}
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1} -
              {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
              {filteredData.length}
            </div>

            {/* CENTER */}
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

            {/* RIGHT */}
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
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center mt-16">
          <img
            alt="No data found"
            src={NodataFound}
            className="w-52 opacity-80"
          />
          <p className="mt-6 text-gray-700 font-semibold">No User Found!</p>
          <p className="mt-2 text-gray-500">Click Add Button</p>
        </div>
      )}
    </div>
  );
}
