import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { POST } from "../../../lib/request";
import { API } from "../../../lib/endpoint";

interface Props {
  onSiteAdded: () => void;
  getnumberOfSite: () => void;
}

const AddSiteModal = ({ onSiteAdded, getnumberOfSite }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    siteName: "",
    siteUid: "",
    location: "",
    pincode: "",
    state: "",
    country: "India",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.siteName.trim()) newErrors.siteName = "Site Name is required";
    if (!formData.siteUid.trim()) newErrors.siteUid = "Site ID is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Valid 6-digit pincode required";
    }
    if (!formData.state) newErrors.state = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const resp = await POST(API.SITE.CREATE, formData);
      if (resp) {
        setIsOpen(false);
        setFormData({
          siteName: "",
          siteUid: "",
          location: "",
          pincode: "",
          state: "",
          country: "India",
        });
        setErrors({});
      }
      onSiteAdded(); // Notify parent component
      getnumberOfSite(); // Refresh HomePage list
    } catch (error) {
      console.error("Create Site Error:", error);
      setErrors({ submit: "Failed to create site. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button - Military Style */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2.5 rounded-xl bg-linear-to-br from-blue-600 to-blue-700 px-5 py-2.5 text-xs font-black text-white transition-all hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl active:scale-95 uppercase tracking-widest border border-blue-700/50"
      >
        <Plus size={18} strokeWidth={3} />
        Add Site
      </button>

      {/* Modal Overlay - Military Grade */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300 rounded-3xl bg-linear-to-br from-white to-slate-50 shadow-2xl overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Military Style */}
            <div className="flex items-center justify-between border-b-2 border-blue-600 bg-linear-to-r from-slate-900 to-slate-800 px-8 py-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                  Create New Site
                </h2>
                <p className="text-xs text-blue-200 font-bold uppercase tracking-widest mt-2">
                  🛡️ Indian Air Force Infrastructure Setup
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-red-400 transition-colors hover:scale-110 duration-200 p-1"
              >
                <X size={26} strokeWidth={3} />
              </button>
            </div>

            {/* Modal Body (Form) - Professional Layout */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Error Message */}
              {errors.submit && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                  <p className="text-sm font-bold text-red-700">
                    {errors.submit}
                  </p>
                </div>
              )}

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Site Name - Left Column */}
                <div className="space-y-2.5">
                  <label
                    htmlFor="siteName"
                    className="text-xs font-black text-slate-700 uppercase tracking-widest block ml-1"
                  >
                    📍 Site Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="siteName"
                    required
                    type="text"
                    placeholder="e.g. Delhi Command Center"
                    className={`w-full rounded-xl border-2 px-4 py-3.5 text-sm font-medium transition-all ${
                      errors.siteName
                        ? "border-red-500 bg-red-50 focus:bg-white focus:border-red-600"
                        : "border-slate-300 bg-white hover:border-slate-400 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100"
                    } focus:outline-none`}
                    value={formData.siteName}
                    onChange={(e) => {
                      setFormData({ ...formData, siteName: e.target.value });
                      if (errors.siteName)
                        setErrors({ ...errors, siteName: "" });
                    }}
                  />
                  {errors.siteName && (
                    <p className="text-xs text-red-600 font-bold">
                      {errors.siteName}
                    </p>
                  )}
                </div>

                {/* Site ID - Right Column */}
                <div className="space-y-2.5">
                  <label
                    htmlFor="siteUid"
                    className="text-xs font-black text-slate-700 uppercase tracking-widest block ml-1"
                  >
                    🆔 Site ID / UID <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="siteUid"
                    required
                    type="text"
                    placeholder="e.g. SITE-001"
                    className={`w-full rounded-xl border-2 px-4 py-3.5 text-sm font-medium transition-all ${
                      errors.siteUid
                        ? "border-red-500 bg-red-50 focus:bg-white focus:border-red-600"
                        : "border-slate-300 bg-white hover:border-slate-400 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100"
                    } focus:outline-none`}
                    value={formData.siteUid}
                    onChange={(e) => {
                      setFormData({ ...formData, siteUid: e.target.value });
                      if (errors.siteUid) setErrors({ ...errors, siteUid: "" });
                    }}
                  />
                  {errors.siteUid && (
                    <p className="text-xs text-red-600 font-bold">
                      {errors.siteUid}
                    </p>
                  )}
                </div>

                {/* Location - Left Column */}
                <div className="space-y-2.5">
                  <label
                    htmlFor="location"
                    className="text-xs font-black text-slate-700 uppercase tracking-widest block ml-1"
                  >
                    🏙️ Location / City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="location"
                    required
                    type="text"
                    placeholder="Enter city name"
                    className={`w-full rounded-xl border-2 px-4 py-3.5 text-sm font-medium transition-all ${
                      errors.location
                        ? "border-red-500 bg-red-50 focus:bg-white focus:border-red-600"
                        : "border-slate-300 bg-white hover:border-slate-400 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100"
                    } focus:outline-none`}
                    value={formData.location}
                    onChange={(e) => {
                      setFormData({ ...formData, location: e.target.value });
                      if (errors.location)
                        setErrors({ ...errors, location: "" });
                    }}
                  />
                  {errors.location && (
                    <p className="text-xs text-red-600 font-bold">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Pincode - Right Column */}
                <div className="space-y-2.5">
                  <label
                    htmlFor="pincode"
                    className="text-xs font-black text-slate-700 uppercase tracking-widest block ml-1"
                  >
                    📮 Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="pincode"
                    required
                    type="text"
                    placeholder="6-digit postal code"
                    maxLength={6}
                    className={`w-full rounded-xl border-2 px-4 py-3.5 text-sm font-medium transition-all ${
                      errors.pincode
                        ? "border-red-500 bg-red-50 focus:bg-white focus:border-red-600"
                        : "border-slate-300 bg-white hover:border-slate-400 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100"
                    } focus:outline-none`}
                    value={formData.pincode}
                    onChange={(e) => {
                      setFormData({ ...formData, pincode: e.target.value });
                      if (errors.pincode) setErrors({ ...errors, pincode: "" });
                    }}
                  />
                  {errors.pincode && (
                    <p className="text-xs text-red-600 font-bold">
                      {errors.pincode}
                    </p>
                  )}
                </div>

                {/* State - Left Column */}
                <div className="space-y-2.5">
                  <label
                    htmlFor="state"
                    className="text-xs font-black text-slate-700 uppercase tracking-widest block ml-1"
                  >
                    🗺️ State <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="state"
                    required
                    className={`w-full rounded-xl border-2 px-4 py-3.5 text-sm font-medium transition-all appearance-none bg-white ${
                      errors.state
                        ? "border-red-500 bg-red-50 focus:border-red-600"
                        : "border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-100"
                    } focus:outline-none`}
                    value={formData.state}
                    onChange={(e) => {
                      setFormData({ ...formData, state: e.target.value });
                      if (errors.state) setErrors({ ...errors, state: "" });
                    }}
                  >
                    <option value="">-- Select State --</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Puducherry">Puducherry</option>
                  </select>
                  {errors.state && (
                    <p className="text-xs text-red-600 font-bold">
                      {errors.state}
                    </p>
                  )}
                </div>

                {/* Country - Right Column (Disabled) */}
                <div className="space-y-2.5">
                  <label
                    htmlFor="country"
                    className="text-xs font-black text-slate-700 uppercase tracking-widest block ml-1"
                  >
                    🇮🇳 Country
                  </label>
                  <input
                    id="country"
                    disabled
                    type="text"
                    className="w-full rounded-xl border-2 border-slate-300 bg-linear-to-r from-slate-100 to-slate-50 px-4 py-3.5 text-sm font-bold text-slate-600 cursor-not-allowed opacity-70"
                    value={formData.country}
                  />
                </div>
              </div>

              {/* Action Buttons - Military Style */}
              <div className="mt-8 flex items-center justify-end gap-4 border-t-2 border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setErrors({});
                  }}
                  className="px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all rounded-lg border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-8 py-3 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-300/50 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 border border-blue-700/50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>✓ Create Site</>
                  )}
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
