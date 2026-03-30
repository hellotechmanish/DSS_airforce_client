"use client";

import React, { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import dayjs from "dayjs";

import AddSiteDialog from "./AddSite/SitesAddDialog";
import DeleteDialog from "./ActionButton/DeleteDialog";
import EditDialog from "./ActionButton/EditDialog";

import { AuthContext } from "../../../../context/AuthContext";
import { API } from "../../../../lib/endpoint";
import { GET } from "../../../../lib/request";

export default function Sites() {
  const [sites, setSites] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const auth = useContext(AuthContext);

  const getnumberOfSite = async () => {
    try {
      const res = await GET(API.SITE.COUNT);
      console.log("res> user", res);

      setSites(res?.msg || []);
    } catch (error) {
      console.error(error);
      setSites([]);
    }
  };

  useEffect(() => {
    getnumberOfSite();
  }, []);

  //  Filter
  const filteredSites = useMemo(() => {
    return sites.filter((site) =>
      `${site.uid} ${site.siteName} ${site.location}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [sites, search]);

  //  Pagination
  const totalPages = Math.ceil(filteredSites.length / pageSize);

  const paginatedSites = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSites.slice(start, start + pageSize);
  }, [filteredSites, currentPage, pageSize]);

  console.log("paginatedSites", paginatedSites);

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <div className="mb-4 text-sm">
        <Link to="/dashboard" className="text-sky-500 font-medium no-underline">
          Dashboard
        </Link>

        <span className="mx-2">›</span>

        <span className="text-[#0f3057] font-semibold">Site Management</span>
      </div>
      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#0a192f] to-[#0f3057] rounded-xl p-5 mb-6 flex justify-between items-center shadow-lg">
        <h2 className="text-white text-xl font-semibold">
          SITE COMMAND CENTER
        </h2>

        <div className="flex gap-4 items-center">
          <span className="text-white font-medium">
            {filteredSites.length} Sites
          </span>

          {auth?.user?.role === "admin" && (
            <AddSiteDialog
              getnumberOfSite={getnumberOfSite}
              buttonClass="px-5 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-900"
            />
          )}
        </div>
      </div>
      {/* TITLE + SEARCH */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[#0f3057]">Sites Overview</h3>

        <input
          type="text"
          placeholder="Search site..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      {/* PAGE SIZE */}
      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Site Name</th>
              <th className="px-4 py-3 text-left">UID</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Devices</th>
              <th className="px-4 py-3 text-left">Added On</th>

              {auth?.user?.role === "admin" && (
                <th className="px-4 py-3 text-left">Action</th>
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedSites.map((site, index) => (
              <tr key={site._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>

                <td className="px-4 py-3 text-blue-600 font-medium">
                  <Link to="/sites-profile" state={site}>
                    {site.siteName}
                  </Link>
                </td>

                <td className="px-4 py-3 text-black font-medium">
                  {/* <Link to="/sites-profile" state={site}> */}
                  {site.uid}
                  {/* </Link> */}
                </td>

                <td className="px-4 py-3">{site.location}</td>

                <td className="px-4 py-3">{site.deviceCount}</td>

                <td className="px-4 py-3">
                  {dayjs(site.createdAt).format("DD MMM YYYY")}
                </td>

                {auth?.user?.role === "admin" && (
                  <td className="px-4 py-3 flex gap-3">
                    <button
                      onClick={() => setEditRow(site)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      onClick={() => setDeleteId(site._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
        {/* LEFT : Showing */}
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * pageSize + 1} -
          {Math.min(currentPage * pageSize, filteredSites.length)} of{" "}
          {filteredSites.length}
        </div>

        {/* CENTER : Page Numbers */}
        <div className="flex gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-40"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded text-sm ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-40"
          >
            Next
          </button>
        </div>

        {/* RIGHT : Page Size */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Rows:</span>

          <select
            className="border border-gray-300 rounded-md px-2 py-1"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      {editRow && (
        <EditDialog
          row={editRow}
          sitesID={editRow._id}
          getnumberOfSite={getnumberOfSite}
          onClose={() => setEditRow(null)}
        />
      )}
      {deleteId && (
        <DeleteDialog
          sitesID={deleteId}
          getnumberOfSite={getnumberOfSite}
          onClose={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
