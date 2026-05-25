import { useState } from "react";

import { HiMenu } from "react-icons/hi";

import Logo from "../assets/img/Left-logo.png";

import Sidebar from "./sidebar";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  // APP TITLE VARIABLE
  const appName = "INDAIN AIRFOCE";
  const description = "Real-Time Monitoring Dashboard";

  return (
    <>
      {/* TOP NAVBAR */}
      <header
        className="
    fixed top-0 left-0 z-50

    flex h-[70px] w-full items-center
    justify-between

    border-b border-slate-700

    bg-gradient-to-r
    from-[#0f172a]
    via-[#111827]
    to-[#020617]

    px-5

    shadow-lg
  "
      >
        {/* LEFT LOGO */}
        <div className="flex items-center">
          <div
            className="
        flex h-16 w-16
        items-center justify-center

        rounded-xl
      "
          >
            <img src={Logo} alt="logo" className="h-9 w-9 object-contain" />
          </div>
        </div>

        {/* CENTER APP NAME */}
        <div
          className="
      absolute left-1/2
      -translate-x-1/2

      flex flex-col
      items-center justify-center
    "
        >
          <h1
            className="
        text-xl font-bold
        tracking-[3px]
        text-white
      "
          >
            {appName}
          </h1>

          <p
            className="
        text-xs tracking-wide
        text-slate-400
      "
          >
            {description}
          </p>
        </div>

        {/* RIGHT MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="
      rounded-xl

      border border-slate-700

      bg-slate-800/60

      p-3

      text-slate-300

      transition-all duration-200

      hover:bg-slate-700
      hover:text-white
    "
        >
          <HiMenu size={24} />
        </button>
      </header>

      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />
    </>
  );
};

export default Navbar;
