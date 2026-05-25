import { useEffect, useState, useMemo, useContext, useCallback } from "react";

import { Link } from "react-router-dom";

import { API } from "../../../lib/endpoints";

import { GET } from "../../../lib/request";

import NodataFound from "../../../assets/img/nodatafound.png";

import { AuthContext } from "../../../context/AuthContext";

interface TemperatureRow {
  siteUid: string;

  siteName: string;

  deviceUid: string;

  deviceName: string;

  temperature: number | string;

  humidity: number | string;
}

interface ApiRow {
  nodeUid?: string;

  deviceName?: string;

  tempValue?: number;

  humValue?: number;

  siteId?: {
    uid?: string;

    siteName?: string;
  }[];
}

const TemperatureTable = () => {
  const [data, setData] = useState<TemperatureRow[]>([]);

  const [search, setSearch] = useState<string>("");

  // PAGINATION

  const [page, setPage] = useState<number>(1);

  const [limit, setLimit] = useState<number>(10);

  const [totalPages, setTotalPages] = useState<number>(1);

  const [total, setTotal] = useState<number>(0);

  const auth = useContext(AuthContext);

  const role = auth?.user?.role;

  // ================= FETCH =================

  const getAllSiteTemperature = useCallback(async () => {
    try {
      const res = await GET(
        `${API.SITE.GET_ALL_SITE_TEMP}?page=${page}&limit=${limit}`,
      );

      const formattedData = (res?.data?.msg || []).map((row: ApiRow) => {
        const site = row?.siteId?.[0] || {};

        return {
          siteUid: site?.uid || "-",

          siteName: site?.siteName || "-",

          deviceUid: row?.nodeUid || "-",

          deviceName: row?.deviceName || "-",

          temperature: row?.tempValue ?? "-",

          humidity: row?.humValue ?? "-",
        };
      });

      setData(formattedData);

      setTotalPages(res?.data?.pagination?.totalPages || 1);

      setTotal(res?.data?.pagination?.total || 0);
    } catch (error) {
      console.error(error);

      setData([]);
    }
  }, [page, limit]);

  useEffect(() => {
    getAllSiteTemperature();

    const interval = setInterval(() => {
      getAllSiteTemperature();
    }, 20000);

    return () => clearInterval(interval);
  }, [page, limit, search]);
  // ================= FILTER =================

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      `${row.deviceName} ${row.deviceUid}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [data, search]);

  // ================= PAGINATION =================

  const start = (page - 1) * limit + 1;

  const end = Math.min(page * limit, total);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* BREADCRUMB */}

      <nav className="mb-4 text-sm">
        <Link to="/dashboard" className="font-medium text-sky-500 no-underline">
          Dashboard
        </Link>

        <span className="mx-2">›</span>

        <span className="font-semibold text-[#0f3057]">
          Temperature Monitoring
        </span>
      </nav>

      {/* HEADER */}

      <div
        className="mb-5 flex items-center justify-between
        rounded-xl bg-gradient-to-br
        from-[#0a192f] to-[#0f3057]
        p-5 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-white">
          TEMPERATURE & HUMIDITY MONITORING
        </h2>

        <span className="font-medium text-white">{total} Devices</span>
      </div>

      {/* SEARCH */}

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#0f3057]">
          Active Device Data
        </h3>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* TABLE */}

      <div
        className="overflow-x-auto rounded-xl border
        border-gray-200 bg-white shadow"
      >
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">#</th>

              {(role === "admin" || role === "technician") && (
                <th className="px-4 py-3 text-left">Site UID</th>
              )}

              <th className="px-4 py-3 text-left">Site Name</th>

              <th className="px-4 py-3 text-left">Device UID</th>

              <th className="px-4 py-3 text-left">Device Name</th>

              <th className="px-4 py-3 text-left">Temperature (°C)</th>

              <th className="px-4 py-3 text-left">Humidity (%)</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{(page - 1) * limit + index + 1}</td>

                {(role === "admin" || role === "technician") && (
                  <td className="px-4 py-3 font-medium text-blue-600">
                    #{row.siteUid}
                  </td>
                )}

                <td className="px-4 py-3 font-medium text-blue-600">
                  {row.siteName}
                </td>

                <td className="px-4 py-3">#{row.deviceUid}</td>

                <td className="px-4 py-3">{row.deviceName}</td>

                <td className="px-4 py-3 font-semibold text-red-600">
                  {row.temperature}
                </td>

                <td className="px-4 py-3 font-semibold text-blue-600">
                  {row.humidity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* NO DATA */}

        {filteredData.length === 0 && (
          <div className="flex h-[60vh] flex-col items-center justify-center">
            <img src={NodataFound} alt="nodata" className="w-40 opacity-80" />

            <p className="mt-4 font-medium text-blue-500">No Device Found</p>
          </div>
        )}

        {/* PAGINATION */}

        <div className="flex items-center justify-between border-t p-4 text-sm">
          {/* LEFT */}

          <div>
            Showing {start} -{end} of {total}
          </div>

          {/* CENTER */}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="rounded border px-2 py-1 disabled:opacity-50"
            >
              Prev
            </button>

            <button className="rounded bg-blue-600 px-3 py-1 text-white">
              {page}
            </button>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded border px-2 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2">
            <span>Rows:</span>

            <select
              value={limit}
              onChange={(e) => {
                setPage(1);

                setLimit(Number(e.target.value));
              }}
              className="rounded border px-2 py-1"
            >
              <option value={5}>5</option>

              <option value={10}>10</option>

              <option value={20}>20</option>

              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureTable;
