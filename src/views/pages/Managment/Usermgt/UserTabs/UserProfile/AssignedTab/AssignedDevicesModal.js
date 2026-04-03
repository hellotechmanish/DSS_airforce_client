import React from "react";
import dayjs from "dayjs";

function AssignedDevicesTable({ devices = [] }) {
  if (!devices.length) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
        No devices found
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="max-h-[420px] overflow-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="sticky top-0 bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Device UID</th>
              <th className="px-4 py-3 text-left font-semibold">Device Name</th>
              <th className="px-4 py-3 text-left font-semibold">
                Created Date
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {devices.map((device) => (
              <tr key={device._id || device.nodeUid}>
                <td className="px-4 py-3 font-medium text-slate-700">
                  {device.nodeUid || "-"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {device.deviceName || "-"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {device.createdAt
                    ? dayjs(device.createdAt).format("DD-MM-YYYY")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AssignedDevicesModal({
  isOpen,
  title,
  siteName,
  siteUid,
  devices,
  isLoading,
  onClose,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {siteName} {siteUid ? `(${siteUid})` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-xl font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close device details modal"
          >
            x
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-5">
          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-500">
              Loading devices...
            </div>
          ) : (
            <AssignedDevicesTable devices={devices} />
          )}
        </div>
      </div>
    </div>
  );
}
