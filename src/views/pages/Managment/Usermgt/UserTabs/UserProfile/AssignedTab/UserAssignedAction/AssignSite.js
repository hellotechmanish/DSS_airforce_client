"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { API } from "../../../../../../../../lib/endpoint";
import { GET, POST } from "../../../../../../../../lib/request";
import toast from "react-hot-toast";

export default function MaxWidthDialog({ getnumberOfAssignSite, UserId }) {
  const [open, setOpen] = useState(false);

  const [step, setStep] = useState(1);

  const [sites, setSites] = useState([]);
  const [devices, setDevices] = useState([]);

  const [selectedSites, setSelectedSites] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);

  // 🔥 PAGINATION STATES
  const [sitePage, setSitePage] = useState(1);
  const [siteTotalPages, setSiteTotalPages] = useState(1);

  const [devicePage, setDevicePage] = useState(1);
  const [deviceTotalPages, setDeviceTotalPages] = useState(1);

  // ================= CLOSE =================
  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setSelectedSites([]);
    setSelectedDevices([]);
    setDevices([]);
    setSitePage(1);
    setDevicePage(1);
  };

  // ================= GET SITES =================
  const getSites = useCallback(async () => {
    try {
      const res = await GET(`${API.SITE.COUNT}?page=${sitePage}&limit=6`);

      setSites(res?.msg || []);
      setSiteTotalPages(res?.pagination?.totalPages || 1);

      console.log("🔥 Sites API:", res);
    } catch (err) {
      console.error(err);
      setSites([]);
    }
  }, [sitePage]);

  // ================= GET DEVICES =================
  const getDevicesBySites = useCallback(async () => {
    try {
      if (!selectedSites.length) return;

      const res = await POST(
        `${API.DEVICE.LIST_BY_SITES}?page=${devicePage}&limit=6`,
        { siteIds: selectedSites },
      );

      setDevices(res?.msg || []);
      setDeviceTotalPages(res?.pagination?.totalPages || 1);

      console.log("🔥 Devices API:", res);
    } catch (err) {
      console.error(err);
      setDevices([]);
    }
  }, [selectedSites, devicePage]);

  // ================= SELECT HANDLERS =================
  const handleSiteSelect = (id) => {
    setSelectedSites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleDeviceSelect = (id) => {
    setSelectedDevices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    const payload = {
      userId: UserId,
      siteIds: selectedSites,
      deviceIds: selectedDevices,
    };

    console.log("🚀 FINAL PAYLOAD:", payload);

    try {
      const res = await POST(API.USERS.ASSIGN_SITE, payload);

      toast.success(res?.msg || "Assigned successfully");

      handleClose();
      getnumberOfAssignSite();
    } catch (error) {
      console.error("❌ ERROR:", error);
      toast.error("Assignment failed");
    }
  };

  // ================= EFFECTS =================
  useEffect(() => {
    if (open) getSites();
  }, [open, getSites]);

  useEffect(() => {
    if (step === 2) getDevicesBySites();
  }, [step, getDevicesBySites]);

  return (
    <>
      <Button
        className="skyblue-bg-button fs-16 width-150 hover"
        onClick={() => setOpen(true)}
      >
        Assign Site
      </Button>

      <Dialog open={open} fullWidth maxWidth="md">
        <DialogTitle className="flex justify-between items-center">
          Assign Site & Device
          <button onClick={handleClose}>
            <CloseIcon />
          </button>
        </DialogTitle>

        <DialogContent>
          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold mb-3">Select Sites</h2>

              <div className="grid grid-cols-2 gap-2">
                {sites.map((site) => (
                  <div
                    key={site._id}
                    onClick={() => handleSiteSelect(site._id)}
                    className="border rounded-md px-2 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50 text-sm"
                  >
                    <div>
                      <p className="font-medium text-sm">{site.siteName}</p>
                      <p className="text-[10px] text-gray-500">{site.uid}</p>
                    </div>

                    <Checkbox
                      size="small"
                      checked={selectedSites.includes(site._id)}
                    />
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center gap-3 mt-4 text-sm">
                <button
                  onClick={() => setSitePage(sitePage - 1)}
                  disabled={sitePage === 1}
                >
                  ‹
                </button>

                <span>
                  {sitePage} / {siteTotalPages}
                </span>

                <button
                  onClick={() => setSitePage(sitePage + 1)}
                  disabled={sitePage === siteTotalPages}
                >
                  ›
                </button>
              </div>
            </>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <>
              <h2 className="text-lg font-semibold mb-2">Select Devices</h2>

              <p className="text-xs mb-2 text-gray-500">
                Selected Sites: {selectedSites.length}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {devices.map((device) => (
                  <div
                    key={device._id}
                    onClick={() => handleDeviceSelect(device._id)}
                    className="border rounded-md px-2 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50 text-sm"
                  >
                    <div>
                      <p className="font-medium text-sm">{device.deviceName}</p>
                      <p className="text-[10px] text-gray-500">
                        {device.nodeUid}
                      </p>
                    </div>

                    <Checkbox
                      size="small"
                      checked={selectedDevices.includes(device._id)}
                    />
                  </div>
                ))}
              </div>

              {/* PAGINATION */}
              <div className="flex justify-center gap-3 mt-4 text-sm">
                <button
                  onClick={() => setDevicePage(devicePage - 1)}
                  disabled={devicePage === 1}
                >
                  ‹
                </button>

                <span>
                  {devicePage} / {deviceTotalPages}
                </span>

                <button
                  onClick={() => setDevicePage(devicePage + 1)}
                  disabled={devicePage === deviceTotalPages}
                >
                  ›
                </button>
              </div>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>

          {step === 1 && (
            <Button
              disabled={!selectedSites.length}
              onClick={() => {
                console.log("Selected Sites:", selectedSites);
                setStep(2);
              }}
              variant="contained"
            >
              Next
            </Button>
          )}

          {step === 2 && (
            <>
              <Button onClick={() => setStep(1)}>Back</Button>

              <Button
                disabled={!selectedDevices.length}
                onClick={handleSubmit}
                variant="contained"
              >
                Submit
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
