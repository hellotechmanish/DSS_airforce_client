import type { Dispatch, SetStateAction } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiHome,
  HiUsers,
  HiCog,
  HiX,
  HiChartBar,
  HiChevronDown,
} from "react-icons/hi";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const menuItems: NavItem[] = [
  { name: "Dashboard", icon: <HiHome size={20} />, path: "/dashboard" },
  { name: "Users", icon: <HiUsers size={20} />, path: "/users" },
  {
    name: "Monitoring",
    icon: <HiChartBar size={20} />,
    subItems: [
      { name: "Resistance", path: "/monitoring/resistance" },
      { name: "Temperature", path: "/monitoring/temperature" },
      { name: "Humidity", path: "/monitoring/humidity" },
    ],
  },
  { name: "Settings", icon: <HiCog size={20} />, path: "/settings" },
];

interface SidebarProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const { pathname } = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  // Auto-open submenu if current path matches a subitem
  useEffect(() => {
    let matched = false;
    menuItems.forEach((item, index) => {
      if (item.subItems?.some((sub) => isActive(sub.path))) {
        setOpenSubmenu(index);
        matched = true;
      }
    });
    if (!matched) setOpenSubmenu(null);
  }, [pathname, isActive]);

  // Calculate submenu height for smooth animation
  useEffect(() => {
    if (openSubmenu !== null && subMenuRefs.current[openSubmenu]) {
      setSubMenuHeight((prev) => ({
        ...prev,
        [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight ?? 0,
      }));
    }
  }, [openSubmenu]);

  const handleToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev === index ? null : index));
  };

  return (
    <>
      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 right-0 z-50
          h-screen w-[300px]
          bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#020617]
          text-white shadow-2xl
          transition-transform duration-300
          border-l border-slate-700
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
          <div>
            <h2 className="text-xl font-bold tracking-wide text-slate-100">
              Control Panel
            </h2>
            <p className="text-xs text-slate-400 mt-1">Monitoring System</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-white"
          >
            <HiX size={22} />
          </button>
        </div>

        {/* MENU */}
        <nav className="p-4">
          <ul className="flex flex-col gap-2">
            {menuItems.map((item, index) => (
              <li key={item.name}>
                {/* HAS SUBITEMS → toggle button */}
                {item.subItems ? (
                  <button
                    onClick={() => handleToggle(index)}
                    className={`
                      group flex w-full items-center justify-between
                      rounded-xl px-4 py-3
                      transition-all duration-200
                      ${
                        openSubmenu === index
                          ? "bg-slate-700 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={
                          openSubmenu === index
                            ? "text-cyan-400"
                            : "text-slate-400 group-hover:text-cyan-400"
                        }
                      >
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <HiChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        openSubmenu === index ? "rotate-180 text-cyan-400" : ""
                      }`}
                    />
                  </button>
                ) : (
                  /* NO SUBITEMS → React Router Link */
                  <Link
                    to={item.path!}
                    onClick={() => setOpen(false)}
                    className={`
                      group flex w-full items-center gap-4
                      rounded-xl px-4 py-3
                      transition-all duration-200
                      ${
                        isActive(item.path!)
                          ? "bg-slate-700 text-white"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }
                    `}
                  >
                    <span
                      className={
                        isActive(item.path!)
                          ? "text-cyan-400"
                          : "text-slate-400 group-hover:text-cyan-400"
                      }
                    >
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )}

                {/* SUBMENU */}
                {item.subItems && (
                  <div
                    ref={(el) => {
                      subMenuRefs.current[index] = el;
                    }}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      height:
                        openSubmenu === index
                          ? `${subMenuHeight[index] ?? 0}px`
                          : "0px",
                    }}
                  >
                    <ul className="mt-2 space-y-1 ml-5 border-l border-slate-700 pl-4">
                      {item.subItems.map((sub) => (
                        <li key={sub.name}>
                          <Link
                            to={sub.path}
                            onClick={() => setOpen(false)}
                            className={`
                              block rounded-lg px-3 py-2 text-sm
                              transition-all duration-200
                              ${
                                isActive(sub.path)
                                  ? "bg-slate-700 text-cyan-400"
                                  : "text-slate-400 hover:bg-slate-800 hover:text-cyan-400"
                              }
                            `}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
