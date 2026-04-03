import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { API } from "../../../../../lib/endpoint";
import { GET, POST } from "../../../../../lib/request";
import AddDevice from "../../../HomePageTab/AddDevice/AddDevice";
import toast from "react-hot-toast";
import { AuthContext } from "../../../../../context/AuthContext";

const DEVICES_PER_PAGE = 12;
const DEVICE_STORAGE_PREFIX = "site-profile-active-device";

const EMPTY_DEVICE_FORM = {
  deviceName: "",
  nodeUid: "",
  temp: "",
  humidity: "",
  resSensors: "",
  nerSensors: "",
  vmrSensors: "",
  spdSensors: "",
  resSensorsThreshold: "",
  nerSensorsThreshold: "",
  spdSensorsThreshold: "",
  vmrSensorsThreshold: {
    r: 0,
    y: 0,
    b: 0,
    ry: 0,
    yb: 0,
    rb: 0,
  },
};

const siteDevicesCache = new Map();
const pendingSiteDeviceRequests = new Map();

const getDeviceStorageKey = (siteId) =>
  `${DEVICE_STORAGE_PREFIX}:${siteId ?? "unknown"}`;

const getPageForIndex = (index) => Math.floor(index / DEVICES_PER_PAGE) + 1;

const normalizeDeviceFormValues = (device = {}) => ({
  deviceName: device.deviceName ?? "",
  nodeUid: device.nodeUid ?? "",
  temp: device.temp ?? "",
  humidity: device.humidity ?? "",
  resSensors: device.resSensors ?? "",
  nerSensors: device.nerSensors ?? "",
  vmrSensors: device.vmrSensors ?? "",
  spdSensors: device.spdSensors ?? "",
  resSensorsThreshold: device.resSensorsThreshold ?? "",
  nerSensorsThreshold: device.nerSensorsThreshold ?? "",
  spdSensorsThreshold: device.spdSensorsThreshold ?? "",
  vmrSensorsThreshold: {
    ...EMPTY_DEVICE_FORM.vmrSensorsThreshold,
    ...(device.vmrSensorsThreshold ?? {}),
  },
});

const hasDeviceDetails = (device) =>
  Boolean(
    device &&
      ("nodeUid" in device ||
        "temp" in device ||
        "humidity" in device ||
        "resSensors" in device ||
        "vmrSensorsThreshold" in device),
  );

const mergeDeviceData = (baseDevice = {}, nextDevice = {}) => ({
  ...baseDevice,
  ...nextDevice,
  vmrSensorsThreshold: {
    ...(baseDevice.vmrSensorsThreshold ?? {}),
    ...(nextDevice.vmrSensorsThreshold ?? {}),
  },
});

const mergeDeviceIntoList = (deviceList, deviceData) =>
  deviceList.map((device) =>
    device._id === deviceData._id ? mergeDeviceData(device, deviceData) : device,
  );

const fetchDevicesBySiteId = async (siteId, { force = false } = {}) => {
  if (!siteId) {
    return [];
  }

  if (!force && pendingSiteDeviceRequests.has(siteId)) {
    return pendingSiteDeviceRequests.get(siteId);
  }

  if (!force && siteDevicesCache.has(siteId)) {
    return siteDevicesCache.get(siteId);
  }

  const request = GET(API.DEVICE.LIST_BY_SITEID(siteId))
    .then((res) => {
      const nextDevices = Array.isArray(res?.msg) ? res.msg : [];
      siteDevicesCache.set(siteId, nextDevices);
      return nextDevices;
    })
    .finally(() => {
      pendingSiteDeviceRequests.delete(siteId);
    });

  pendingSiteDeviceRequests.set(siteId, request);
  return request;
};

const fetchDeviceDetails = async (deviceId) => {
  const res = await GET(API.DEVICE.GET_BY_ID(deviceId));
  return res?.msg ?? null;
};

export default function Sites() {
  const { state } = useLocation();
  const auth = useContext(AuthContext);
  const role = auth?.user?.role;
  const siteId = state?._id;
  const storageKey = getDeviceStorageKey(siteId);

  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeDeviceId, setActiveDeviceId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const detailRequestIdRef = useRef(0);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: EMPTY_DEVICE_FORM,
  });

  const setDeviceData = useCallback(
    (deviceData) => {
      if (!deviceData) {
        setSelectedDevice(null);
        setActiveDeviceId(null);
        reset(EMPTY_DEVICE_FORM);
        return;
      }

      setSelectedDevice(deviceData);
      setActiveDeviceId(deviceData._id ?? null);
      reset(normalizeDeviceFormValues(deviceData));
    },
    [reset],
  );

  const clearDeviceSelection = useCallback(() => {
    detailRequestIdRef.current += 1;
    localStorage.removeItem(storageKey);
    setDeviceData(null);
  }, [setDeviceData, storageKey]);

  const syncSelectedDevicePage = useCallback((deviceList, deviceId) => {
    const deviceIndex = deviceList.findIndex((device) => device._id === deviceId);

    if (deviceIndex >= 0) {
      setCurrentPage(getPageForIndex(deviceIndex));
    }
  }, []);

  const refreshDevices = useCallback(
    async ({ force = true, restoreSelection = true } = {}) => {
      if (!siteId) {
        setDevices([]);
        setCurrentPage(1);
        setDeviceData(null);
        return [];
      }

      const nextDevices = await fetchDevicesBySiteId(siteId, { force });
      setDevices(nextDevices);

      if (!restoreSelection) {
        return nextDevices;
      }

      const storedDeviceId = localStorage.getItem(storageKey);

      if (!storedDeviceId) {
        setDeviceData(null);
        setCurrentPage(1);
        return nextDevices;
      }

      const restoredDevice = nextDevices.find(
        (device) => device._id === storedDeviceId,
      );

      if (!restoredDevice) {
        clearDeviceSelection();
        setCurrentPage(1);
        return nextDevices;
      }

      syncSelectedDevicePage(nextDevices, restoredDevice._id);

      if (hasDeviceDetails(restoredDevice)) {
        setDeviceData(restoredDevice);
        return nextDevices;
      }

      setLoading(true);
      const requestId = ++detailRequestIdRef.current;

      try {
        const fullDeviceData = await fetchDeviceDetails(restoredDevice._id);

        if (requestId !== detailRequestIdRef.current) {
          return nextDevices;
        }

        if (fullDeviceData) {
          const mergedDevices = mergeDeviceIntoList(nextDevices, fullDeviceData);
          siteDevicesCache.set(siteId, mergedDevices);
          setDevices(mergedDevices);
          setDeviceData(fullDeviceData);
        } else {
          setDeviceData(restoredDevice);
        }
      } finally {
        setLoading(false);
      }

      return nextDevices;
    },
    [
      clearDeviceSelection,
      setDeviceData,
      siteId,
      storageKey,
      syncSelectedDevicePage,
    ],
  );

  useEffect(() => {
    let isMounted = true;

    const loadSiteDevices = async () => {
      if (!siteId) {
        setDevices([]);
        setCurrentPage(1);
        setDeviceData(null);
        return;
      }

      try {
        const nextDevices = await fetchDevicesBySiteId(siteId);

        if (!isMounted) {
          return;
        }

        setDevices(nextDevices);

        const storedDeviceId = localStorage.getItem(storageKey);

        if (!storedDeviceId) {
          setCurrentPage(1);
          setDeviceData(null);
          return;
        }

        const restoredDevice = nextDevices.find(
          (device) => device._id === storedDeviceId,
        );

        if (!restoredDevice) {
          localStorage.removeItem(storageKey);
          setCurrentPage(1);
          setDeviceData(null);
          return;
        }

        syncSelectedDevicePage(nextDevices, restoredDevice._id);

        if (hasDeviceDetails(restoredDevice)) {
          setDeviceData(restoredDevice);
          return;
        }

        setLoading(true);
        const requestId = ++detailRequestIdRef.current;

        try {
          const fullDeviceData = await fetchDeviceDetails(restoredDevice._id);

          if (!isMounted || requestId !== detailRequestIdRef.current) {
            return;
          }

          if (fullDeviceData) {
            const mergedDevices = mergeDeviceIntoList(nextDevices, fullDeviceData);
            siteDevicesCache.set(siteId, mergedDevices);
            setDevices(mergedDevices);
            setDeviceData(fullDeviceData);
          } else {
            setDeviceData(restoredDevice);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        console.error(err);
        setDevices([]);
        setCurrentPage(1);
        setDeviceData(null);
      }
    };

    loadSiteDevices();

    return () => {
      isMounted = false;
    };
  }, [setDeviceData, siteId, storageKey, syncSelectedDevicePage]);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  }, []);

  const totalPages = useMemo(
    () => Math.ceil(devices.length / DEVICES_PER_PAGE),
    [devices.length],
  );

  const currentDevices = useMemo(() => {
    const indexOfLastDevice = currentPage * DEVICES_PER_PAGE;
    const indexOfFirstDevice = indexOfLastDevice - DEVICES_PER_PAGE;
    return devices.slice(indexOfFirstDevice, indexOfLastDevice);
  }, [currentPage, devices]);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages || 1));
  }, [totalPages]);

  const handleDeviceClick = useCallback(
    async (device) => {
      if (!device?._id) {
        return;
      }

      localStorage.setItem(storageKey, device._id);
      syncSelectedDevicePage(devices, device._id);

      if (hasDeviceDetails(device)) {
        setLoading(false);
        setDeviceData(device);
        return;
      }

      setActiveDeviceId(device._id);
      setLoading(true);
      const requestId = ++detailRequestIdRef.current;

      try {
        const fullDeviceData = await fetchDeviceDetails(device._id);

        if (requestId !== detailRequestIdRef.current) {
          return;
        }

        if (!fullDeviceData) {
          setDeviceData(device);
          return;
        }

        setDevices((prevDevices) => {
          const mergedDevices = mergeDeviceIntoList(prevDevices, fullDeviceData);
          siteDevicesCache.set(siteId, mergedDevices);
          return mergedDevices;
        });

        setDeviceData(fullDeviceData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load device details");
      } finally {
        setLoading(false);
      }
    },
    [devices, setDeviceData, siteId, storageKey, syncSelectedDevicePage],
  );

  const onSubmit = useCallback(
    async (formData) => {
      if (!selectedDevice?._id) {
        return;
      }

      try {
        const updatedDevice = mergeDeviceData(selectedDevice, formData);

        const updateResponse = await POST(API.DEVICE.EDIT, {
          deviceID: selectedDevice._id,
          ...formData,
        });

        setDeviceData(updatedDevice);
        setDevices((prevDevices) => {
          const mergedDevices = mergeDeviceIntoList(prevDevices, updatedDevice);
          siteDevicesCache.set(siteId, mergedDevices);
          return mergedDevices;
        });

        toast.success("Device Updated");

        try {
          await refreshDevices({ force: true, restoreSelection: true });
        } catch (refreshError) {
          console.error(refreshError);
          toast.error("Device updated, but latest data could not be refreshed");
        }

        return updateResponse;
      } catch (err) {
        console.error(err);
        toast.error("Failed to update device");
      }
    },
    [refreshDevices, selectedDevice, setDeviceData, siteId],
  );

  if (!state) return <div className="p-6">No Site</div>;

  const indexOfLastDevice = currentPage * DEVICES_PER_PAGE;
  const indexOfFirstDevice = indexOfLastDevice - DEVICES_PER_PAGE;

  return (
    <div className="w-full px-4 md:px-6 py-4 space-y-6 bg-[#f3f4f6] min-h-screen">
      {/* Site header remains unchanged */}
      <div className="w-full bg-gradient-to-r from-[#0a192f] to-[#0f3057] text-white px-5 py-4 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border border-[#1f4068]">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-wide">
            {state.siteName}
          </h2>
          <p className="text-xs md:text-sm text-gray-300 mt-1">
            {state.location}
          </p>
        </div>

        <div className="text-left md:text-right text-xs md:text-sm text-gray-200">
          <p>
            {state.pincode}, {state.country}
          </p>
          <p className="mt-1 font-medium text-white">
            {new Date(state.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg md:text-xl font-bold text-[#0f3057]">
            Devices ({devices.length})
          </h2>

          {role === "admin" && (
            <AddDevice
              getdeviceListbysite={refreshDevices}
              state={state}
              sitezero={state}
              value={1}
            />
          )}
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3 pb-2">
          {currentDevices.map((device) => (
            <button
              key={device._id}
              onClick={() => handleDeviceClick(device)}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-sm ${
                activeDeviceId === device._id
                  ? "bg-[#0f3057] text-white ring-2 ring-[#0f3057] ring-offset-1 md:ring-offset-2"
                  : "bg-gray-50 text-[#0f3057] border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {device.deviceName}
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-4 mt-2 gap-3">
            <span className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-[#0f3057]">
                {indexOfFirstDevice + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-[#0f3057]">
                {Math.min(indexOfLastDevice, devices.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#0f3057]">
                {devices.length}
              </span>{" "}
              devices
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-[#0f3057] border-gray-300 hover:bg-gray-50"
                }`}
              >
                Prev
              </button>

              <div className="px-3 py-1.5 text-xs font-semibold text-[#0f3057] bg-gray-50 border border-gray-200 rounded-md">
                {currentPage} / {totalPages}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-[#0f3057] border-gray-300 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedDevice && (
        <div className="flex justify-center pb-10">
          <div className="w-full md:w-[85%] lg:w-[65%] xl:w-[55%] bg-white rounded-xl shadow-lg border border-[#1f4068] p-4 md:p-6 transition-all duration-300">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-lg md:text-xl font-bold text-[#0f3057]">
                Device Details
              </h2>

              <button
                onClick={clearDeviceSelection}
                className="text-gray-400 hover:text-[#0f3057] bg-gray-100 hover:bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center transition-colors text-xs"
                title="Close"
              >
                x
              </button>
            </div>

            {loading && (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin h-8 w-8 border-b-4 border-[#0f3057] rounded-full"></div>
              </div>
            )}

            {!loading && selectedDevice && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <h3 className="text-sm font-bold text-[#1f4068] bg-[#f8fafc] p-2.5 rounded-lg border border-gray-200">
                  {selectedDevice.deviceName}
                </h3>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                  <h4 className="font-semibold text-[#0f3057] text-sm border-b pb-1.5">
                    Basic Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        Device Name
                      </label>
                      <input
                        {...register("deviceName")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        Node UID
                      </label>
                      <input
                        {...register("nodeUid")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        Temperature
                      </label>
                      <input
                        {...register("temp")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        Humidity
                      </label>
                      <input
                        {...register("humidity")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                  <h4 className="font-semibold text-[#0f3057] text-sm border-b pb-1.5">
                    Sensor Configuration
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        RES Sensors
                      </label>
                      <input
                        {...register("resSensors")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        GN Sensors
                      </label>
                      <input
                        {...register("nerSensors")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        VMR Sensors
                      </label>
                      <input
                        {...register("vmrSensors")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        SPD Sensors
                      </label>
                      <input
                        {...register("spdSensors")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                  <h4 className="font-semibold text-[#0f3057] text-sm border-b pb-1.5">
                    Threshold Configuration
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        RES Threshold
                      </label>
                      <input
                        {...register("resSensorsThreshold")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        GN Threshold
                      </label>
                      <input
                        {...register("nerSensorsThreshold")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">
                        SPD Threshold
                      </label>
                      <input
                        {...register("spdSensorsThreshold")}
                        className="border border-gray-300 p-2 text-sm rounded-md outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                      Phase Threshold
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        {...register("vmrSensorsThreshold.r")}
                        placeholder="R"
                        className="border border-gray-300 p-2 text-sm rounded-md text-center outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white"
                      />
                      <input
                        {...register("vmrSensorsThreshold.y")}
                        placeholder="Y"
                        className="border border-gray-300 p-2 text-sm rounded-md text-center outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white"
                      />
                      <input
                        {...register("vmrSensorsThreshold.b")}
                        placeholder="B"
                        className="border border-gray-300 p-2 text-sm rounded-md text-center outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white"
                      />
                      <input
                        {...register("vmrSensorsThreshold.ry")}
                        placeholder="RY"
                        className="border border-gray-300 p-2 text-sm rounded-md text-center outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white"
                      />
                      <input
                        {...register("vmrSensorsThreshold.yb")}
                        placeholder="YB"
                        className="border border-gray-300 p-2 text-sm rounded-md text-center outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white"
                      />
                      <input
                        {...register("vmrSensorsThreshold.rb")}
                        placeholder="RB"
                        className="border border-gray-300 p-2 text-sm rounded-md text-center outline-none focus:ring-1 focus:ring-[#0f3057] bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {role === "admin" && (
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#0f3057] text-white text-sm font-medium rounded-lg hover:bg-[#1f4068] transition-all shadow-md active:scale-95"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
