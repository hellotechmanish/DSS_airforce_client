import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  HiOutlineChip,
  HiOutlineX,
} from "react-icons/hi";

interface Props {
  siteUid: string;
  siteName: string;
  onDeviceAdded?: () => void;
}

interface FormData {
  deviceName: string;
  nodeUid: string;

  vmrSensors: number;
  resSensors: number;
  spdSensors: number;
  nerSensors: number;

  vmrThresholds: number[];
  resThresholds: number[];
  spdThresholds: number[];
  nerThresholds: number[];
}

const AddDeviceModal = ({
  siteUid,
  siteName,
  onDeviceAdded,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // UID VALIDATION

  const [uidMatch, setUidMatch] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    reset,
  } = useForm<FormData>();

  const nodeUid = watch("nodeUid");

  // ================= CHECK UID =================

  useEffect(() => {
    const checkUID = async () => {
      if (!nodeUid) {
        setUidMatch(true);
        return;
      }

      try {
        // API CALL HERE

        // Example:
        // const resp = await POST(API.DEVICE.CHECK_UID, { nodeUid });

        setUidMatch(true);
      } catch (error) {
        console.error(error);
      }
    };

    const timer = setTimeout(() => {
      checkUID();
    }, 500);

    return () => clearTimeout(timer);
  }, [nodeUid]);

  // ================= CLOSE =================

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  // ================= SUBMIT =================

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);

      const payload = {
        ...data,
        siteUid,
      };

      console.log(payload);

      // API CALL

      // await POST(API.DEVICE.CREATE, payload);

      toast.success("Device created successfully");

      onDeviceAdded?.();

      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create device");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ================= OPEN BUTTON ================= */}

      <button
        onClick={() => setOpen(true)}
        className="
          rounded-xl
          bg-cyan-500
          px-5
          py-2.5
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-cyan-600
        "
      >
        + Add Device
      </button>

      {/* ================= MODAL ================= */}

      {/* ================= MODAL ================= */}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            className="
        w-full
        max-w-5xl
        rounded-2xl
        bg-white
        shadow-2xl
        max-h-[90vh]
        overflow-hidden
      "
          >
            {/* ================= HEADER ================= */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-cyan-100 p-2">
                  <HiOutlineChip className="text-2xl text-cyan-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Add Device
                  </h2>

                  <p className="text-sm text-slate-500">
                    Configure a new device
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="
            rounded-lg
            p-2
            text-slate-500
            transition
            hover:bg-slate-100
            hover:text-black
          "
              >
                <HiOutlineX size={24} />
              </button>
            </div>

            {/* ================= FORM ================= */}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex h-[80vh] flex-col"
            >
              {/* ================= BODY ================= */}

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* ================= BASIC DETAILS ================= */}

                <div className="mb-8">
                  <h3 className="mb-5 text-xl font-semibold text-slate-800">
                    Device Profile
                  </h3>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* ================= LEFT ================= */}

                    <div className="space-y-5">
                      {/* SITE NAME */}

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Site Name
                        </label>

                        <input
                          value={siteName}
                          readOnly
                          className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-gray-100
                      px-4
                      py-3
                      text-black
                      outline-none
                    "
                        />
                      </div>

                      {/* DEVICE NAME */}

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Device Name
                        </label>

                        <input
                          {...register("deviceName", {
                            required: "Device name is required",
                          })}
                          placeholder="Enter device name"
                          className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-white
                      px-4
                      py-3
                      text-black
                      outline-none
                      transition
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-200
                    "
                        />
                      </div>

                      {/* VMR */}

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Phase Sensors
                        </label>

                        <input
                          type="number"
                          min={0}
                          placeholder="Enter VMR sensors count"
                          {...register("vmrSensors")}
                          className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-white
                      px-4
                      py-3
                      text-black
                      outline-none
                      transition
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-200
                    "
                        />
                      </div>

                      {/* SPD */}

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          SPD Sensors
                        </label>

                        <input
                          type="number"
                          min={0}
                          placeholder="Enter SPD sensors count"
                          {...register("spdSensors")}
                          className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-white
                      px-4
                      py-3
                      text-black
                      outline-none
                      transition
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-200
                    "
                        />
                      </div>

                      {/* RES */}

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          RES Sensors
                        </label>

                        <input
                          type="number"
                          min={0}
                          placeholder="Enter RES sensors count"
                          {...register("resSensors")}
                          className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-white
                      px-4
                      py-3
                      text-black
                      outline-none
                      transition
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-200
                    "
                        />
                      </div>

                      {/* GN */}

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          GN Sensors
                        </label>

                        <input
                          type="number"
                          min={0}
                          placeholder="Enter NER sensors count"
                          {...register("nerSensors")}
                          className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-white
                      px-4
                      py-3
                      text-black
                      outline-none
                      transition
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-200
                    "
                        />
                      </div>
                    </div>

                    {/* ================= RIGHT ================= */}

                    <div className="space-y-5">
                      {/* SITE UID */}

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Site UID
                        </label>

                        <input
                          value={siteUid}
                          readOnly
                          className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-gray-100
                      px-4
                      py-3
                      text-black
                      outline-none
                    "
                        />
                      </div>

                      {/* NODE UID */}

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          Node UID
                        </label>

                        <input
                          {...register("nodeUid", {
                            required: "Node UID is required",
                          })}
                          placeholder="Enter node UID"
                          className={`
                      w-full
                      rounded-xl
                      border
                      px-4
                      py-3
                      text-black
                      outline-none
                      transition
                      focus:ring-2

                      ${uidMatch
                              ? "border-gray-300 focus:border-cyan-500 focus:ring-cyan-200"
                              : "border-red-500 focus:border-red-500 focus:ring-red-200"
                            }
                    `}
                        />

                        {!uidMatch && (
                          <p className="mt-1 text-xs text-red-500">
                            Node UID already exists
                          </p>
                        )}
                      </div>

                      {/* ================= PHASE THRESHOLD ================= */}

                      <div>
                        <label className="mb-3 block text-sm font-semibold text-gray-700">
                          Phase Sensor Threshold
                        </label>

                        <div className="grid grid-cols-6 gap-2">
                          {[
                            { name: "r", label: "R" },
                            { name: "y", label: "Y" },
                            { name: "b", label: "B" },
                            { name: "ry", label: "RY" },
                            { name: "yb", label: "YB" },
                            { name: "rb", label: "RB" },
                          ].map((item) => (
                            <div key={item.name}>
                              <label className="mb-1 block text-xs font-medium text-gray-600">
                                {item.label}
                              </label>

                              <input
                                type="number"
                                {...register(item.name as keyof FormData)}
                                className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            px-3
                            py-2
                            text-black
                            outline-none
                            transition
                            focus:border-cyan-500
                            focus:ring-2
                            focus:ring-cyan-200
                          "
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SPD THRESHOLD */}

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          SPD Sensor Threshold
                        </label>

                        <input
                          type="number"
                          placeholder="Enter SPD sensor threshold"
                          {...register("spdThresholds.0")}
                          className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-white
                      px-4
                      py-3
                      text-black
                      outline-none
                      transition
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-200
                    "
                        />
                      </div>

                      {/* RES THRESHOLD */}

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          RES Sensor Threshold
                        </label>

                        <input
                          type="number"
                          placeholder="Enter RES sensor threshold"
                          {...register("resThresholds.0")}
                          className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-white
                      px-4
                      py-3
                      text-black
                      outline-none
                      transition
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-200
                    "
                        />
                      </div>

                      {/* GN THRESHOLD */}

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          GN Sensor Threshold
                        </label>

                        <input
                          type="number"
                          placeholder="Enter NER sensor threshold"
                          {...register("nerThresholds.0")}
                          className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      bg-white
                      px-4
                      py-3
                      text-black
                      outline-none
                      transition
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-200
                    "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= FOOTER ================= */}

              <div className="flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="
              rounded-xl
              border
              border-gray-300
              px-5
              py-2.5
              font-medium
              text-gray-700
              transition
              hover:bg-gray-100
            "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || !uidMatch}
                  className="
              rounded-xl
              bg-cyan-500
              px-6
              py-2.5
              font-medium
              text-white
              transition
              hover:bg-cyan-600
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
                >
                  {submitting
                    ? "Creating..."
                    : "Create Device"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddDeviceModal;