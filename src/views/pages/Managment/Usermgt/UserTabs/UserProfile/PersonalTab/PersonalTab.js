import { useLocation } from "react-router-dom";

export default function UserManagment() {
  const { state } = useLocation();

  return (
    <div className="mt-6">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Full Name */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Full Name</p>
          <p className="text-gray-800 font-medium">{state?.fullName}</p>
        </div>

        {/* UID */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">UID</p>
          <p className="text-gray-800 font-medium">{state?.uid}</p>
        </div>

        {/* Password */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Password</p>
          <p className="text-gray-800 font-medium">********</p>
        </div>
      </div>
    </div>
  );
}
