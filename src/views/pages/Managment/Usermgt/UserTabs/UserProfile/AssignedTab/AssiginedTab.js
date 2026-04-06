import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Checkbox, Grid } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import AssignSite from "./UserAssignedAction/AssignSite";
import DeleteSite from "./UserAssignedAction/UserSiteDelete";
import { GET, POST } from "../../../../../../../lib/request";
import { API } from "../../../../../../../lib/endpoint";
import { FaEdit, FaEye } from "react-icons/fa";

export default function Sites({ state }) {
  const [useraSite, setuseraSite] = useState([]);
  const [siteId, setSiteId] = useState(null);
  const [selectSite, setSelectSiteName] = useState(null);
  const [selectUid, setSelectUid] = useState(null);
  const [device, setDevice] = useState([]);

  // MODAL STATE
  const [openModal, setOpenModal] = useState(false);

  // PAGINATION STATE
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [allDevices, setAllDevices] = useState([]);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState([]);
  const [editModalLoading, setEditModalLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // CLICK
  const DeviceDataView = (row) => {
    setSiteId(row._id);
    setSelectSiteName(row?.siteName);
    setSelectUid(row?.uid);
    setOpenModal(true);
  };

  // SITE API (BACKEND PAGINATION)
  const getnumberOfAssignSite = useCallback(async () => {
    try {
      const res = await GET(
        `${API.SITE.BY_USER(state?._id)}?page=${page}&limit=${limit}`,
      );

      setuseraSite(res?.msg || []);
      setTotal(res?.pagination?.total || 0);
      setTotalPages(res?.pagination?.totalPages || 1);
    } catch (err) {
      console.log(err);
    }
  }, [state?._id, page, limit]);

  // DEVICE API
  const getdevicebyuserId = useCallback(async () => {
    try {
      if (!siteId) return;

      const res = await POST(API.DEVICE.BY_SITE_AND_USER, {
        siteId,
        userId: state?._id,
      });

      setDevice(res?.msg || []);
    } catch (err) {
      console.log(err);
    }
  }, [siteId, state?._id]);

  useEffect(() => {
    getnumberOfAssignSite();
  }, [getnumberOfAssignSite]);

  useEffect(() => {
    if (openModal) {
      getdevicebyuserId();
    }
  }, [openModal, getdevicebyuserId]);

  useEffect(() => {
    const getEditModalData = async () => {
      if (!openEditModal || !selectedRow?._id || !state?._id) return;

      try {
        setEditModalLoading(true);

        const [allDevicesRes, assignedDevicesRes] = await Promise.all([
          GET(API.DEVICE.LIST_BY_SITEID(selectedRow._id)),
          POST(API.DEVICE.BY_SITE_AND_USER, {
            siteId: selectedRow._id,
            userId: state?._id,
          }),
        ]);

        setAllDevices(allDevicesRes?.msg || []);
        setSelectedDeviceIds(
          (assignedDevicesRes?.msg || []).map((item) => item._id),
        );
      } catch (error) {
        console.log(error);
        toast.error("Failed to load site devices");
        setAllDevices([]);
        setSelectedDeviceIds([]);
      } finally {
        setEditModalLoading(false);
      }
    };

    getEditModalData();
  }, [openEditModal, selectedRow?._id, state?._id]);

  const closeEditModal = useCallback(() => {
    setOpenEditModal(false);
    setSelectedRow(null);
    setAllDevices([]);
    setSelectedDeviceIds([]);
    setEditModalLoading(false);
    setSubmitLoading(false);
  }, []);

  const toggleDeviceSelection = useCallback((deviceId) => {
    setSelectedDeviceIds((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId],
    );
  }, []);

  const handleSelectAllDevices = useCallback(() => {
    setSelectedDeviceIds((prev) =>
      prev.length === allDevices.length
        ? []
        : allDevices.map((item) => item._id),
    );
  }, [allDevices]);

  const handleEditSubmit = useCallback(async () => {
    if (!selectedRow?._id || !state?._id) return;

    try {
      setSubmitLoading(true);

      const res = await POST(API.USERS.ASSIGN_SITE, {
        userId: state?._id,
        siteIds: [selectedRow._id],
        deviceIds: selectedDeviceIds,
      });

      toast.success(res?.msg || "Device assignment updated successfully");
      closeEditModal();
      getnumberOfAssignSite();
    } catch (error) {
      console.log(error);
      toast.error(error?.msg || "Failed to update device assignment");
    } finally {
      setSubmitLoading(false);
    }
  }, [
    closeEditModal,
    getnumberOfAssignSite,
    selectedDeviceIds,
    selectedRow?._id,
    state?._id,
  ]);

  // PAGINATION BUTTON LOGIC
  const getVisiblePages = () => {
    let start = Math.max(page - 2, 1);
    let end = start + 4;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - 4, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const allDevicesSelected =
    allDevices.length > 0 && selectedDeviceIds.length === allDevices.length;
  const someDevicesSelected =
    selectedDeviceIds.length > 0 &&
    selectedDeviceIds.length < allDevices.length;
  const selectedDeviceCount = useMemo(
    () => selectedDeviceIds.length,
    [selectedDeviceIds],
  );

  return (
    <Grid container className="mt-8 w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center w-full">
        <p className="text-gray-700 text-lg font-semibold">
          Total Assigned Sites: <span className="font-medium">{total}</span>
        </p>

        <AssignSite
          UserId={state?._id}
          getnumberOfAssignSite={getnumberOfAssignSite}
        />
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto mt-6 mb-10">
        <Table className="min-w-[800px]">
          <TableHead>
            <TableRow>
              <TableCell align="center">UID</TableCell>
              <TableCell align="center">Sites</TableCell>
              <TableCell align="center">Devices</TableCell>
              <TableCell align="center">User Assigned Devices</TableCell>
              <TableCell align="center">Added On</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {useraSite.map((row) => (
              <TableRow key={row._id}>
                <TableCell align="center" className="text-blue-500">
                  {row.uid}
                </TableCell>

                <TableCell align="center">{row.siteName}</TableCell>

                <TableCell align="center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-medium">{row.deviceCount}</span>
                    {/* <FaEye
                      onClick={(e) => {
                        e.stopPropagation();
                        DeviceDataView(row, "total");
                      }}
                    /> */}
                  </div>
                </TableCell>

                <TableCell align="center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-medium">{row.userDeviceCount}</span>
                    <FaEye
                      onClick={(e) => {
                        e.stopPropagation();
                        DeviceDataView(row, "user");
                      }}
                    />
                  </div>
                </TableCell>

                <TableCell align="center">
                  {dayjs(row?.createdAt).format("DD-MM-YYYY")}
                </TableCell>

                <TableCell align="center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedRow(row);
                        setOpenEditModal(true);
                      }}
                      className="text-gray-800 hover:text-blue-700 text-lg transition"
                    >
                      <FaEdit />
                    </button>

                    <DeleteSite
                      SiteID={row._id}
                      UserId={state?._id}
                      getnumberOfAssignSite={getnumberOfAssignSite}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-4 pb-6 w-full">
        <div className="text-sm text-gray-600 w-1/3">
          Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of{" "}
          {total}
        </div>

        <div className="flex justify-center items-center gap-1 w-1/3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-3 py-1 border rounded ${
              page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            Prev
          </button>

          {visiblePages.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 border rounded ${
                page === p ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            disabled={page >= totalPages || useraSite.length < limit}
            onClick={() => setPage(page + 1)}
            className={`px-3 py-1 border rounded ${
              page >= totalPages || useraSite.length < limit
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>

        <div className="flex justify-end w-1/3">
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border px-2 py-1 rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* CUSTOM MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-[95%] max-w-5xl max-h-[90vh] rounded-xl shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">Device Details</h2>
                <p className="text-sm text-gray-500">
                  {selectSite} ({selectUid})
                </p>
              </div>

              <button
                onClick={() => setOpenModal(false)}
                className="text-red-500 font-semibold text-lg"
              >
                x
              </button>
            </div>

            <div className="overflow-y-auto p-4 flex-1">
              {device?.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Device UID</TableCell>
                      <TableCell align="center">Device Name</TableCell>
                      <TableCell align="center">Added On</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {device.map((d) => (
                      <TableRow key={d._id}>
                        <TableCell align="center">{d.nodeUid}</TableCell>
                        <TableCell align="center">{d.deviceName}</TableCell>
                        <TableCell align="center">
                          {dayjs(d.createdAt).format("DD-MM-YYYY")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500">No devices found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {openEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-[92%] max-w-4xl max-h-[90vh] rounded-xl shadow-lg p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Edit Device Assignment
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedRow?.siteName} ({selectedRow?.uid})
                </p>
              </div>

              <button
                onClick={closeEditModal}
                className="text-red-500 text-lg font-bold"
              >
                x
              </button>
            </div>

            <div className="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Total Devices: {allDevices.length}
                </p>
                <p className="text-xs text-slate-500">
                  Selected Devices: {selectedDeviceCount}
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Checkbox
                  size="small"
                  checked={allDevicesSelected}
                  indeterminate={someDevicesSelected}
                  onChange={handleSelectAllDevices}
                />
                Select All Devices
              </label>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {editModalLoading ? (
                <div className="min-h-[260px] flex items-center justify-center text-sm text-slate-500">
                  Loading devices...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allDevices.map((item) => {
                    const isChecked = selectedDeviceIds.includes(item._id);

                    return (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => toggleDeviceSelection(item._id)}
                        className={`w-full rounded-lg border px-3 py-3 text-left transition flex items-start justify-between ${
                          isChecked
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {item.deviceName}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {item.nodeUid}
                          </p>
                        </div>

                        <Checkbox
                          size="small"
                          checked={isChecked}
                          tabIndex={-1}
                          disableRipple
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleEditSubmit}
                disabled={editModalLoading || submitLoading}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${
                  editModalLoading || submitLoading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {submitLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Grid>
  );
}
