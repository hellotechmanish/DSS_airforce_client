import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth"; // Apne core paths check karein

const ProtectedRoute = ({ allowedRoles }) => {
  // Zustand unified data streams
  const user = useAuth((state) => state.user);
  const loading = useAuth((state) => state.loading);
  const isLoggedIn = useAuth((state) => state.isLoggedIn);

  // 🪵 LIVE COMPONENT INTERCEPTOR LOG:
  // Yeh useEffect tabhi chalega jab real me user state update hogi ya context badlega
  useEffect(() => {
    // console.log("🛡️ ProtectedRoute Security Check Matrix:", {
    //   isLoggedIn: isLoggedIn,
    //   loadingState: loading,
    //   userPayload: user,
    //   userRole: user?.role,
    //   allowedRolesForThisRoute: allowedRoles,
    // });
  }, [user, loading, isLoggedIn, allowedRoles]);

  // 1. ⏳ Handshake/Loading State Gate
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#001f3f] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-sm font-semibold tracking-wide">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  // 2.     Authentication Check Gate
  if (!isLoggedIn || !user) {
    console.warn(
      "Unauthorized checkpoint intercepted. Redirecting to login portal.",
    );
    return <Navigate to="/signIn" replace />;
  }

  // 3. 🛡️ Role-Based Authorization Gate
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.warn(
      `Role '${user?.role}' is not permitted for this dashboard node.`,
    );
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. 🔓 Clearance Allowed
  return <Outlet />;
};

export default ProtectedRoute;
