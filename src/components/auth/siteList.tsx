import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Site = {
  _id: string;
  siteUid: string;
  siteName: string;
  deviceCount: number;
};

interface Props {
  sites: Site[];
  selectedSiteId: string;
  setSelectedSiteId: (id: string) => void;
}

const SiteList = ({ sites, selectedSiteId, setSelectedSiteId }: Props) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Isko 8 ya 10 karein taaki screen bhari hui dikhe
  const itemsPerPage = 8;

  const totalPages = Math.ceil(sites.length / itemsPerPage);
  const paginatedSites = sites.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  );

  // console.log("isSelected", selectedSiteId);

  if (!sites.length)
    return (
      <div className="py-4 text-center text-slate-400 text-xs">
        No Sites Found
      </div>
    );

  return (
    <div className="flex items-center gap-4 w-full">
      {/* Left Arrow */}
      <button
        disabled={currentPage === 0}
        onClick={() => setCurrentPage((p) => p - 1)}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 disabled:opacity-20 transition-all shrink-0"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Responsive Grid - Ab ye 4 se lekar 8 boxes tak dikhayega space ke hisab se */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 flex-1">
        {paginatedSites.map((site) => {
          const isSelected = selectedSiteId === site._id;
          return (
            <button
              key={site._id}
              onClick={() => setSelectedSiteId(site._id)}
              className={`
                relative flex flex-col justify-between
                min-w-0 h-[52px] p-2.5 rounded-xl border
                transition-all duration-200
                ${
                  isSelected
                    ? "bg-blue-600 border-blue-600 text-white shadow-md transform scale-[1.02]"
                    : "bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:shadow-sm"
                }
              `}
            >
              <span className="text-[11px] font-bold truncate w-full text-left leading-tight">
                {site.siteName}
              </span>

              <div className="flex items-center justify-between w-full mt-1">
                <span className={`text-[9px] font-medium opacity-60`}>
                  #{site.siteUid.slice(-4).toUpperCase()}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold leading-none ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {site.deviceCount}D
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right Arrow */}
      <button
        disabled={currentPage >= totalPages - 1}
        onClick={() => setCurrentPage((p) => p + 1)}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 disabled:opacity-20 transition-all shrink-0"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default SiteList;
