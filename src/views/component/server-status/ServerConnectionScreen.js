// import React from "react";
// import LoaderDialog from "../loader";

// const formatLastChecked = (lastCheckedAt) => {
//   if (!lastCheckedAt) {
//     return "Waiting for the first successful handshake.";
//   }

//   return `Last check: ${new Date(lastCheckedAt).toLocaleTimeString()}`;
// };

// function ServerConnectionScreen({ isRetrying, lastCheckedAt, onRetry }) {
//   return (
//     <section className="server-connection-screen">
//       <div className="server-connection-card">
//         <div className="server-connection-loader">
//           <LoaderDialog />
//         </div>

//         <h1>Connecting to server...</h1>
//         <p>
//           The frontend is ready and waiting for the backend. We will keep trying
//           automatically and restore the app as soon as the server responds.
//         </p>

//         <p className="server-connection-meta">
//           {isRetrying
//             ? "Retrying connection now."
//             : "Automatic retry is active every few seconds."}
//         </p>

//         <p className="server-connection-meta">
//           {formatLastChecked(lastCheckedAt)}
//         </p>

//         <div className="server-connection-actions">
//           <button
//             className="server-connection-button"
//             disabled={isRetrying}
//             onClick={onRetry}
//             type="button"
//           >
//             {isRetrying ? "Retrying..." : "Retry now"}
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default ServerConnectionScreen;

import React from "react";
import LoaderDialog from "../loader";

const formatLastChecked = (lastCheckedAt) => {
  if (!lastCheckedAt) {
    return "Waiting for the first successful handshake.";
  }
  return `Last check: ${new Date(lastCheckedAt).toLocaleTimeString()}`;
};

function ServerConnectionScreen({ isRetrying, lastCheckedAt, onRetry }) {
  return (
    <section className="server-connection-screen">
      <div className="server-connection-card">
        <div className="server-connection-loader">
          <LoaderDialog />
        </div>

        <h2>Waiting for Server...</h2>
        <p>Client is ready, but the server is not responding.</p>

        {/* Yahan par humne function use kiya hai */}
        <p
          className="server-connection-meta"
          style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}
        >
          {formatLastChecked(lastCheckedAt)}
        </p>

        <div className="server-connection-actions">
          <button
            className="server-connection-button"
            disabled={isRetrying}
            onClick={onRetry}
            type="button"
          >
            {isRetrying ? "Retrying..." : "Retry Now"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ServerConnectionScreen;
