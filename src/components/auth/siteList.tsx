type Site = {
  _id: string;
  siteUid: string;
  siteName: string;
  deviceCount: number;
};

interface Props {
  sites: Site[];
  selectedSiteUid: string;
  setSelectedSiteUid: (uid: string) => void;
}

const SiteList = ({
  sites,
  selectedSiteUid,
  setSelectedSiteUid,
}: Props) => {
  if (sites.length === 0) {
    return (
      <div className="py-10 text-center text-slate-500">
        No Sites Found
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {sites.map((site) => (
        <button
          key={site._id}
          onClick={() => setSelectedSiteUid(site.siteUid)}
          className={`
            min-w-[180px]
            rounded-xl
            border
            p-4
            text-left
            transition-all
            shadow-sm

            ${selectedSiteUid === site.siteUid
              ? "border-cyan-500 bg-cyan-50"
              : "border-slate-200 bg-white hover:border-cyan-300 hover:shadow-md"
            }
          `}
        >
          <h3 className="text-lg font-semibold text-slate-800">
            {site.siteName}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {site.deviceCount} Devices
          </p>
        </button>
      ))}
    </div>
  );
};

export default SiteList;
