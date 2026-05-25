import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiOutlineX } from "react-icons/hi";
import { POST } from "../../../lib/request";
import { API } from "../../../lib/endpoint";

interface Props {
  getnumberOfSite: () => void;
}

interface FormData {
  siteName: string;
  siteId: string;
  location: string;
  pincode: string;
  state: string;
  country: string;
}

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const AddSiteModal = ({ getnumberOfSite }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // true = site already exists
  const [siteExists, setSiteExists] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // watch siteId field
  const siteId = watch("siteId");

  // ================= CHECK SITE ID =================

  useEffect(() => {
    const checkSiteID = async () => {
      if (!siteId) {
        setSiteExists(false);
        return;
      }

      try {
        const res = await POST(API.SITE.CHECK_UID, {
          siteId,
        });

        // if API returns data => site exists
        setSiteExists(res?.data ? true : false);
      } catch (error) {
        console.error(error);
      }
    };

    const delayDebounce = setTimeout(() => {
      checkSiteID();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [siteId]);

  // ================= CLOSE MODAL =================

  const handleClose = () => {
    setOpen(false);
    reset();
    setSiteExists(false);
  };

  // ================= SUBMIT =================

  const onSubmit = async (data: FormData) => {
    console.log("this is the test log ", data);

    if (siteExists) {
      toast.error("Site ID already exists");
      return;
    }

    try {
      setLoading(true);

      await POST(API.SITE.CREATE, {
        siteName: data.siteName,
        siteId: data.siteId,
        location: data.location,
        pincode: Number(data.pincode),
        country: data.country,
        state: data.state,
      });

      toast.success("Site created successfully");

      getnumberOfSite();

      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create site");
    } finally {
      setLoading(false);
    }
  };

  // ================= COMMON INPUT CLASS =================

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-black outline-none focus:border-cyan-500";

  return (
    <>
      {/* OPEN BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-400"
      >
        + Add Site
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">Add Site</h2>

              <button onClick={handleClose} className="text-slate-800 ">
                <HiOutlineX size={22} />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Site Name */}
                <div>
                  <label className="mb-2 block text-sm text-gray-900">
                    Site Name
                  </label>

                  <input
                    {...register("siteName", {
                      required: "Site name is required",
                    })}
                    placeholder="Delhi Command Center"
                    className={inputClass}
                  />

                  {errors.siteName && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.siteName.message}
                    </p>
                  )}
                </div>

                {/* Site ID */}
                <div>
                  <label className="mb-2 block text-sm text-gray-900">
                    Site ID
                  </label>

                  <input
                    {...register("siteId", {
                      required: "Site ID is required",
                    })}
                    placeholder="SITE-001"
                    className={inputClass}
                  />

                  {errors.siteId && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.siteId.message}
                    </p>
                  )}

                  {siteExists && (
                    <p className="mt-1 text-xs text-red-400">
                      Site ID already exists
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="mb-2 block text-sm text-gray-900">
                    Location
                  </label>

                  <input
                    {...register("location", {
                      required: "Location is required",
                    })}
                    placeholder="New Delhi"
                    className={inputClass}
                  />

                  {errors.location && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Pincode */}
                <div>
                  <label className="mb-2 block text-sm text-gray-900">
                    Pincode
                  </label>

                  <input
                    {...register("pincode", {
                      required: "Pincode is required",
                    })}
                    placeholder="110001"
                    className={inputClass}
                  />

                  {errors.pincode && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.pincode.message}
                    </p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    State
                  </label>

                  <select
                    {...register("state", {
                      required: "State is required",
                    })}
                    defaultValue=""
                    className=" w-full
      rounded-xl
      border
      border-gray-300
      bg-white
      px-4
      py-3
      text-gray-800
      outline-none
      shadow-sm
      transition
      focus:border-cyan-500
      focus:ring-2
      focus:ring-cyan-200
    "
                  >
                    <option value="" disabled>
                      Select State
                    </option>

                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>

                  {errors.state && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="mb-2 block text-sm text-gray-900">
                    Country
                  </label>

                  <input
                    {...register("country", {
                      required: "Country is required",
                    })}
                    placeholder="India"
                    className={inputClass}
                  />

                  {errors.country && (
                    <p className="mt-1 text-xs text-red-400">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border border-slate-600 px-5 py-2 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || siteExists}
                  className="rounded-xl bg-cyan-500 px-5 py-2 font-medium text-white hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Site"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddSiteModal;
