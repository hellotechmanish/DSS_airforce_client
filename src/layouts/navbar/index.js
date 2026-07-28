"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { VscUnmute, VscMute } from "react-icons/vsc";
import routes from "../../routes/AdminRoutes";

import { useAuth } from "../../context/useAuth";
import { GET, POST } from "../../lib/request";
import { API } from "../../lib/endpoint";

import LeftLogo from "../../assets/img/Left-logo.png";
import alertSoundFile from "../../assets/sounds/alertsound.mp3"; // Audio file imported

import RebootDialog from "./RebootDialog";
import LogoutDialog from "./LogoutDialog";
import ShutDonwDialog from "./ShutDonwDialog";

export default function Navbar() {
  const user = useAuth((state) => state.user);
  const clearSessionMemory = useAuth((state) => state.logout);

  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alarmStatus, setAlarmStatus] = useState(null);
  const [, setNotificationCount] = useState(0);

  // Audio Object Ref for handling HTML5 Audio Playback
  const audioRef = useRef(null);
  // Prevent an older poll response from overwriting a newer mute/unmute action.
  const alarmStatusRequestRef = useRef(0);

  const loadSavedData = () => {
    const savedData = localStorage.getItem("inputValues");
    return savedData ? JSON.parse(savedData) : { word1: "INDIAN AIRFORCE" };
  };

  const [inputValues] = useState(loadSavedData());

  // Initialize Audio instance once
  useEffect(() => {
    audioRef.current = new Audio(alertSoundFile);
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Keep playback tied to the server-calculated threshold state. This ensures a
  // muted alarm is silent immediately and an alarm stops as soon as all values
  // return below their thresholds.
  useEffect(() => {
    if (!audioRef.current) return;

    // Check if alarm status is Active, not muted and `sound` is truthy
    const isAlarmActive = Boolean(
      alarmStatus?.status &&
      !alarmStatus?.muted &&
      (alarmStatus?.sound ?? false),
    );

    if (isAlarmActive) {
      audioRef.current.play().catch((err) => {
        // Handle modern browser autoplay block policy gracefully
        console.warn("Autoplay prevented by browser interaction policy:", err);
      });
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [alarmStatus]);

  // ================= FIXED LOGOUT PIPELINE =================
  const logout = async () => {
    try {
      await POST(API.AUTH.LOGOUT);
    } catch (err) {
      console.error("Backend token invalidation failed:", err.message);
    } finally {
      clearSessionMemory();
      setDrawerOpen(false);
      navigate("/signIn", { replace: true });
    }
  };

  // ================= ALARM =================
  const getGlobalAlarmStatus = async () => {
    const requestId = ++alarmStatusRequestRef.current;

    try {
      const res = await GET(API.ALARM.STATUS);
      if (requestId === alarmStatusRequestRef.current) {
        setAlarmStatus(res?.data ?? res);
      }
    } catch (err) {
      console.error("Error fetching alarm status", err);
    }
  };

  const toggleAlarmMuted = async (muted) => {
    // Preserve the latest `sound` value so the sync effect can immediately
    // start/stop playback. The next status request confirms the current
    // threshold state from the server.
    // Invalidate any in-flight poll before applying the user's newer choice.
    ++alarmStatusRequestRef.current;
    setAlarmStatus((prev) => ({ ...prev, muted }));

    try {
      // This navbar now exposes mute/unmute (not a separate system on/off
      // control), so unmuting must also re-enable alarms if an older status
      // record was previously disabled.
      await POST(
        API.ALARM.UPDATE_STATUS,
        muted ? { muted } : { muted, status: true },
      );
      getGlobalAlarmStatus();
    } catch (err) {
      console.error("Error updating alarm mute", err);
      getGlobalAlarmStatus();
    }
  };

  const getNotificationCount = async () => {
    try {
      const resp = await GET(API.ALARM.GET_NOTIFICATION_COUNT);
      setNotificationCount(resp?.count || 0);
    } catch (err) {
      console.error("Error fetching notification count", err);
    }
  };

  useEffect(() => {
    getGlobalAlarmStatus();
    getNotificationCount();

    const interval = setInterval(() => {
      getGlobalAlarmStatus();
      getNotificationCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ================= REBOOT =================
  const handleReboot = async () => {
    try {
      const res = await POST(API.DEVICE.REBOOT);
      console.log("Reboot triggered:", res);
    } catch (error) {
      console.error("Reboot failed", error);
    }
  };

  // ================= SHUTDOWN =================
  const handleShutdown = async () => {
    try {
      await POST(API.DEVICE.SHUTDOWN);
    } catch (error) {
      console.error("Shutdown failed", error);
    }
  };

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}
      <div
        className="fixed top-0 left-0 w-full z-40
  bg-gradient-to-b from-[#0a192f] to-[#0f3057] 
  border-b-2 border-[#4da8da] 
  shadow-md py-2"
      >
        <div className="w-full px-6 flex items-center justify-between">
          {/* LEFT LOGO */}
          <div className="w-1/4">
            <img src={LeftLogo} alt="logo" className="h-12 ml-2" />
          </div>

          {/* CENTER TITLE */}
          <div className="w-1/2 text-center">
            <h1 className="text-white font-bold text-xl tracking-widest">
              {inputValues.word1}
            </h1>
            <p className="text-white text-xs tracking-wide">
              ONLINE RESISTANCE MONITORING SYSTEM
            </p>
          </div>

          {/* RIGHT CONTROLS */}
          <div className="w-1/4 flex justify-end items-center gap-4">
            {/* USER ROLE */}
            <span className="bg-[#4da8da] text-[#0a192f] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              {user?.role}
            </span>

            {/* Alarm Mute/Unmute Button (toggles muted flag) */}
            {alarmStatus?.muted ? (
              <button
                onClick={() => toggleAlarmMuted(false)}
                className="text-red-500 hover:scale-110 transition"
                title="Alarm muted — click to unmute"
                aria-label="Alarm muted — click to unmute"
              >
                <VscMute size={22} />
              </button>
            ) : (
              <button
                onClick={() => toggleAlarmMuted(true)}
                className="text-white hover:scale-110 transition"
                title="Alarm audible — click to mute"
                aria-label="Alarm audible — click to mute"
              >
                <VscUnmute size={22} />
              </button>
            )}

            {/* Menu */}
            <button onClick={() => setDrawerOpen(true)} className="text-white">
              <FiMenu size={25} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed inset-0 z-50 ${
          drawerOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm
      transition-opacity duration-300
      ${drawerOpen ? "opacity-100" : "opacity-0"}`}
        />

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-72
      bg-gradient-to-b from-[#0a192f] to-[#0f3057]
      text-white shadow-2xl
      flex flex-col justify-between
      transform transition-transform duration-300 ease-in-out
      ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ willChange: "transform" }}
        >
          {/* TOP SECTION */}
          <div>
            {/* USER PROFILE */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-700">
              <div className="w-10 h-10 rounded-full bg-[#4da8da] flex items-center justify-center font-bold">
                {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div>
                <p className="font-semibold">{user?.fullName || "Admin"}</p>
                <p className="text-xs text-gray-300">#{user?.uid || "admin"}</p>
              </div>
            </div>

            {/* ROUTES */}
            <div className="mt-2 space-y-1">
              {routes
                .filter((r) => {
                  if (r.invisible) return false;

                  if (r.id === "user-management" && user?.role === "user") {
                    return false;
                  }

                  return r.name;
                })
                .map((route, i) => (
                  <Link
                    key={i}
                    to={route.link}
                    onClick={() => setDrawerOpen(false)}
                    className="block px-4 py-2 hover:bg-[#1f4068] transition"
                  >
                    {route.name}
                  </Link>
                ))}
            </div>

            {/* REBOOT / SHUTDOWN */}
            <div className="mt-4 border-t border-gray-700 pt-2 space-y-1 px-4">
              {(user?.role === "admin" ||
                user?.role === "technician" ||
                user?.role === "user") && (
                <div className="hover:bg-[#1f4068] p-2 rounded cursor-pointer">
                  <RebootDialog getRebootStatus={handleReboot} />
                </div>
              )}
              {(user?.role === "admin" || user?.role === "technician") && (
                <div className="hover:bg-[#1f4068] p-2 rounded cursor-pointer">
                  <ShutDonwDialog getShutdownStatus={handleShutdown} />
                </div>
              )}
            </div>
          </div>

          {/* LOGOUT */}
          <div className="p-4 border-t border-gray-700">
            <LogoutDialog logout={logout} />
          </div>
        </div>
      </div>
    </>
  );
}
