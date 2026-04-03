"use client";

import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
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
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [editRow, setEditRow] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const auth = useContext(AuthContext);

  // ================= FETCH =================
  const getnumberOfSite = useCallback(async () => {
    try {
      const res = await GET(
        `${API.SITE.COUNT}?page=${currentPage}&limit=${pageSize}`,
      );

      setSites(res?.msg || []);
      setPagination(res?.pagination || {});
    } catch (error) {
      console.error(error);
      setSites([]);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    getnumberOfSite();
  }, [getnumberOfSite]);

  // ================= FILTER (ONLY CURRENT PAGE) =================
  const filteredSites = useMemo(() => {
    return sites.filter((site) =>
      `${site.uid} ${site.siteName} ${site.location}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [sites, search]);

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      {/* HEADER */}
      <div className="mb-4 text-sm">
        <Link to="/dashboard" className="text-sky-500 font-medium">
          Dashboard
        </Link>
        <span className="mx-2">›</span>
        <span className="text-[#0f3057] font-semibold">Site Management</span>
      </div>

      {/* TOP BAR */}
      <div className="bg-gradient-to-br from-[#0a192f] to-[#0f3057] rounded-xl p-5 mb-6 flex justify-between items-center shadow-lg">
        <h2 className="text-white text-xl font-semibold">
          SITE COMMAND CENTER
        </h2>

        <div className="flex gap-4 items-center">
          <span className="text-white font-medium">
            {pagination.total} Sites
          </span>

          {auth?.user?.role === "admin" && (
            <AddSiteDialog
              getnumberOfSite={getnumberOfSite}
              buttonClass="px-5 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-900"
            />
          )}
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[#0f3057]">Sites Overview</h3>

        <input
          type="text"
          placeholder="Search site..."
          className="border px-3 py-2 rounded-lg text-sm w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
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
            {filteredSites.map((site, index) => (
              <tr key={site._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  {(pagination.page - 1) * pagination.limit + index + 1}
                </td>

                <td className="px-4 py-3 text-blue-600">
                  <Link to="/sites-profile" state={site}>
                    {site.siteName}
                  </Link>
                </td>

                <td className="px-4 py-3">{site.uid}</td>
                <td className="px-4 py-3">{site.location}</td>
                <td className="px-4 py-3">{site.deviceCount}</td>
                <td className="px-4 py-3">
                  {dayjs(site.createdAt).format("DD MMM YYYY")}
                </td>

                {auth?.user?.role === "admin" && (
                  <td className="px-4 py-3 flex gap-3">
                    <button onClick={() => setEditRow(site)}>
                      <FiEdit2 />
                    </button>
                    <button onClick={() => setDeleteId(site._id)}>
                      <FiTrash2 />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
        <div className="text-sm text-gray-600">
          Page {pagination.page} of {pagination.totalPages}
        </div>

        <div className="flex gap-2">
          {/* Prev */}
          <button
            disabled={pagination.page === 1}
            onClick={() => setCurrentPage(pagination.page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            ‹
          </button>

          {/* Pages */}
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 border rounded ${
                  pagination.page === p
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ),
          )}

          {/* Next */}
          <button
            disabled={pagination.page === pagination.totalPages}
            onClick={() => setCurrentPage(pagination.page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            ›
          </button>
        </div>

        {/* PAGE SIZE */}
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

      {/* MODALS */}
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
