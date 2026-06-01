import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useState } from "react";
import type { SiteType } from "../../Types/type";
import AddSiteModal from "./modals/addSiteModal"; // Check path

interface Props {
  sites: SiteType[];
  selectedSiteId: string;
  setSelectedSiteId: (id: string) => void;
  onRefresh: () => void;
}

const SiteList = ({
  sites,
  selectedSiteId,
  setSelectedSiteId,
  onRefresh,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(sites.length / itemsPerPage);

  const paginatedSites = sites.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shrink-0">
      {/* ─── HEADER SECTION ─── */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">
            Infrastructure Management
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
            Command & Control Sites
          </p>
        </div>

        {/* Add Site Modal integrated here */}
        <AddSiteModal onSiteAdded={onRefresh} />
      </div>

      {/* ─── SITES SELECTOR BAR ─── */}
      <div className="flex items-center gap-2 w-full bg-slate-50 p-1.5 rounded-xl border border-slate-100">
        {/* Left Pagination */}
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-blue-50 disabled:opacity-20 shrink-0 transition-all"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Horizontal Scroll Container */}
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          {sites.length === 0 ? (
            <div className="flex-1 text-center text-slate-400 text-[10px] font-bold uppercase italic py-1">
              No Operational Sites Detected
            </div>
          ) : (
            paginatedSites.map((site) => {
              const isSelected = selectedSiteId === site._id;
              return (
                <button
                  key={site._id}
                  onClick={() => setSelectedSiteId(site._id)}
                  className={`
              relative flex flex-col justify-center
              min-w-[110px] max-w-[135px] h-[48px] px-2.5 py-1 rounded-lg border-2 transition-all duration-200
              ${
                isSelected
                  ? "bg-blue-600 border-blue-700 text-white shadow-md z-10 scale-[1.02]"
                  : "bg-white border-slate-100 text-slate-700 hover:border-blue-300"
              }
            `}
                >
                  {/* Top Row: Icon and Name */}
                  <div className="flex items-center gap-1.5 w-full overflow-hidden mb-0.5">
                    <MapPin
                      size={11}
                      className={isSelected ? "text-blue-200" : "text-blue-500"}
                    />
                    <span className="text-[10px] font-black truncate uppercase leading-tight tracking-tight">
                      {site.siteName}
                    </span>
                  </div>

                  {/* Bottom Row: Minimal ID & Count */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[7px] font-mono font-bold ${isSelected ? "text-blue-100" : "text-slate-400"}`}
                    >
                      #{site._id.slice(-4).toUpperCase()}
                    </span>
                    <span
                      className={`text-[8px] px-1.5 rounded font-black ${isSelected ? "bg-white text-blue-600" : "bg-blue-100 text-blue-700"}`}
                    >
                      {site.deviceCount}D
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Pagination */}
        <button
          disabled={currentPage >= totalPages - 1}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm hover:bg-blue-50 disabled:opacity-20 shrink-0 transition-all"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default SiteList;
