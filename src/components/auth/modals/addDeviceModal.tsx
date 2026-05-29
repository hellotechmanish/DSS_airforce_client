import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiOutlineChip, HiOutlineX } from "react-icons/hi";
import { POST } from "../../../lib/request";
import { API } from "../../../lib/endpoint";

interface Props {
  siteUid: string;
  site_id: string;
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
  vmrSensorsThreshold: {
    r: number;
    y: number;
    b: number;
    ry: number;
    yb: number;
    rb: number;
  };
  resSensorsThreshold: number;
  spdSensorsThreshold: number;
  nerSensorsThreshold: number;
  threshold: number;
  isActive: boolean;
}

const PHASE_FIELDS = [
  { name: "r", label: "R" },
  { name: "y", label: "Y" },
  { name: "b", label: "B" },
  { name: "ry", label: "RY" },
  { name: "yb", label: "YB" },
  { name: "rb", label: "RB" },
] as const;

// ── Shared class strings ──
const inputCls = `w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200`;
const readOnlyCls = `w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none cursor-not-allowed`;
const labelCls = `mb-1.5 block text-sm font-semibold text-gray-700`;
const subLabelCls = `mb-1.5 block text-xs font-medium text-gray-500`;
const cardCls = `rounded-xl border border-gray-200 bg-gray-50 p-4`;

interface SensorRowProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
}

const SensorRow = ({ title, badge, children }: SensorRowProps) => (
  <div className={cardCls}>
    <div className="mb-3 flex items-center gap-2">
      <span className="text-sm font-semibold text-slate-700">{title}</span>
      {badge && (
        <span className="rounded-md bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-700">
          {badge}
        </span>
      )}
    </div>
    {children}
  </div>
);

const AddDeviceModal = ({
  siteUid,
  site_id,
  siteName,
  onDeviceAdded,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormData>();

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  // console.log("site_id in modal", site_id);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const body = {
        siteUid,
        site_id,
        deviceName: data.deviceName.trim(),
        nodeUid: data.nodeUid.trim(),
        vmrSensors: Number(data.vmrSensors || 0),
        resSensors: Number(data.resSensors || 0),
        spdSensors: Number(data.spdSensors || 0),
        nerSensors: Number(data.nerSensors || 0),
        vmrSensorsThreshold: {
          r: Number(data.vmrSensorsThreshold?.r || 0),
          y: Number(data.vmrSensorsThreshold?.y || 0),
          b: Number(data.vmrSensorsThreshold?.b || 0),
          ry: Number(data.vmrSensorsThreshold?.ry || 0),
          yb: Number(data.vmrSensorsThreshold?.yb || 0),
          rb: Number(data.vmrSensorsThreshold?.rb || 0),
        },
        resSensorsThreshold: Number(data.resSensorsThreshold || 0),
        spdSensorsThreshold: Number(data.spdSensorsThreshold || 0),
        nerSensorsThreshold: Number(data.nerSensorsThreshold || 0),
        threshold: Number(data.threshold || 0),
        isActive: data.isActive ?? true,
      };

      const response = await POST(API.DEVICE.CREATE, body);
      if (response) setOpen(false);
      onDeviceAdded?.();
      reset();
      toast.success("Device created successfully");
    } catch (error) {
      console.error("Create device error:", error);
      toast.error("Failed to create device");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
      >
        + Add Device
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl max-h-[92vh]">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-cyan-100 p-2">
                  <HiOutlineChip className="text-2xl text-cyan-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Add Device
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure a new monitoring device
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-black"
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
                {/* ── IDENTITY ── */}
                <section>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Device Identity
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Site Name</label>
                      <input
                        value={siteName}
                        readOnly
                        className={readOnlyCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Site UID</label>
                      <input value={siteUid} readOnly className={readOnlyCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Device Name</label>
                      <input
                        placeholder="Enter device name"
                        {...register("deviceName", { required: true })}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Node UID</label>
                      <input
                        placeholder="Enter node UID"
                        {...register("nodeUid", { required: true })}
                        className={inputCls}
                      />
                    </div>
                  </div>
                </section>

                {/* ── SENSORS & THRESHOLDS ── */}
                <section>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sensors &amp; Thresholds
                  </h3>
                  <div className="space-y-4">
                    <SensorRow title="RES Sensors">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={subLabelCls}>Sensor Count</label>
                          <input
                            type="number"
                            min={0}
                            placeholder="0"
                            {...register("resSensors")}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={subLabelCls}>Threshold</label>
                          <input
                            type="number"
                            placeholder="Enter threshold"
                            {...register("resSensorsThreshold")}
                            className={inputCls}
                          />
                        </div>
                      </div>
                    </SensorRow>

                    <SensorRow title="GN Sensors">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={subLabelCls}>Sensor Count</label>
                          <input
                            type="number"
                            min={0}
                            placeholder="0"
                            {...register("nerSensors")}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={subLabelCls}>Threshold</label>
                          <input
                            type="number"
                            placeholder="Enter threshold"
                            {...register("nerSensorsThreshold")}
                            className={inputCls}
                          />
                        </div>
                      </div>
                    </SensorRow>

                    <SensorRow title="SPD Sensors">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={subLabelCls}>Sensor Count</label>
                          <input
                            type="number"
                            min={0}
                            placeholder="0"
                            {...register("spdSensors")}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={subLabelCls}>Threshold</label>
                          <input
                            type="number"
                            placeholder="Enter threshold"
                            {...register("spdSensorsThreshold")}
                            className={inputCls}
                          />
                        </div>
                      </div>
                    </SensorRow>

                    <SensorRow title="Phase Sensors" badge="VMR">
                      <div className="grid grid-cols-[1fr_2fr] gap-3">
                        <div>
                          <label className={subLabelCls}>Sensor Count</label>
                          <input
                            type="number"
                            min={0}
                            placeholder="0"
                            {...register("vmrSensors")}
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className={subLabelCls}>Thresholds</label>
                          <div className="grid grid-cols-6 gap-2">
                            {PHASE_FIELDS.map((item) => (
                              <div key={item.name}>
                                <label className="mb-1 block text-center text-xs font-medium text-gray-400">
                                  {item.label}
                                </label>
                                <input
                                  type="number"
                                  {...register(
                                    `vmrSensorsThreshold.${item.name}`,
                                  )}
                                  className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2.5 text-center text-sm text-black outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </SensorRow>
                  </div>
                </section>
              </div>

              {/* FOOTER */}
              <div className="flex flex-shrink-0 justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Device"}
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
