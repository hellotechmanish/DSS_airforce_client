// import React, { useState, useEffect, Suspense, memo } from "react";
// import { Outlet } from "react-router-dom";
// import "./App.css";
// import LoaderDialog from "./views/component/loader";
// import { AuthContext } from "./context/AuthContext";
// import { Toaster } from "react-hot-toast";

// function App() {
//   const [token, setToken] = useState(null);
//   const [role, setRole] = useState(null);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedData = JSON.parse(localStorage.getItem("userData") || "{}");
//     const savedToken = localStorage.getItem("token");

//     if (storedData?.user && savedToken) {
//       setToken(savedToken);
//       setUser(storedData.user);
//       setRole(storedData.user.role);
//     } else {
//       setToken(null);
//       setUser(null);
//       setRole(null);
//     }
//   }, []);

//   return (
//     <Suspense fallback={<LoaderDialog loading={true} />}>
//       <AuthContext.Provider value={{ token, setToken, user, role }}>
//         {/* <AdminContext.Provider value={{}}> */}
//         <Toaster position="bottom-right" />
//         <Outlet />
//         {/* </AdminContext.Provider> */}
//       </AuthContext.Provider>
//     </Suspense>
//   );
// }

// export default memo(App);

import React, { useEffect, Suspense, memo } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import LoaderDialog from "./views/component/loader";
// import { Toaster } from "react-hot-toast";

//   FIXED: Zustand Store aur Axios Helpers ko connect kiya
import { useAuth } from "./context/useAuth";
import { GET } from "./lib/request";
import { API } from "./lib/endpoint";

function App() {
  // Zustand ke actions ko call kiya
  const setSession = useAuth((state) => state.setSession);
  const setLoading = useAuth((state) => state.setLoading);
  const loading = useAuth((state) => state.loading);

  useEffect(() => {
    const initializeUserSessionMatrix = async () => {
      try {
        // 🔑 STEP A: Sabse pehle loading ko explicitly TRUE karein taaki routing safe ho jaye
        setLoading(true);

        const resp = await GET(API.AUTH.ME);

        if (resp && resp.success && resp.user) {
          setSession(resp.user);
        } else {
          setSession(null);
        }
      } catch (err) {
        console.error("Session automatic handshake failed:", err.message);
        setSession(null);
      } finally {
        // Har haal me loading false hoga taaki transition smooth ho
        setLoading(false);
      }
    };

    initializeUserSessionMatrix();
  }, [setSession, setLoading]);

  return (
    // Agar Zustand initialization phase me hai, toh standard loader screens mount rakhein
    <Suspense fallback={<LoaderDialog loading={true} />}>
      {loading ? (
        <LoaderDialog loading={true} />
      ) : (
        <>
          {/*   FIXED: Provider tags saaf kar diye, ab content direct Zustand se load hoga */}
          <Outlet />
        </>
      )}
    </Suspense>
  );
}

export default memo(App);
