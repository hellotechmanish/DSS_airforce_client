// import { useEffect, useState, useContext } from "react";

// import toast from "react-hot-toast";

// import { HiOutlineDownload } from "react-icons/hi";

// import { FiBell, FiCheckCircle } from "react-icons/fi";

// import NodataFound from "../../../assets/img/nodatafound.png";

// import { GET } from "../../lib/request";
// import { API } from "../../lib/endpoint";
// import { AuthContext } from "../../context/AuthContext";

// interface ResistanceType {
//   siteUid?: string;

//   siteName?: string;

//   nodeUid?: string;

//   deviceName?: string;

//   resistanceNumber?: string;

//   resistanceValue?: number;

//   resSensorsThreshold?: number;
// }

// const Resistance = () => {
//   const [resistance, setResistance] = useState<ResistanceType[]>([]);

//   const [search, setSearch] = useState<string>("");

//   const [page, setPage] = useState<number>(1);

//   const [limit, setLimit] = useState<number>(10);

//   const [totalPages, setTotalPages] = useState<number>(1);

//   const [total, setTotal] = useState<number>(0);

//   const auth = useContext(AuthContext);

//   // ================= FETCH =================

//   const getAllSiteResistance = async () => {
//     try {
//       const res = await GET(
//         `${API.SITE.ALL_RESISTANCE}?page=${page}&limit=${limit}&search=${search}`,
//       );

//       setResistance(res?.data || []);

//       setTotalPages(res?.data?.pagination?.totalPages || 1);

//       setTotal(res?.data?.pagination?.total || 0);
//     } catch (err) {
//       console.error(err);

//       setResistance([]);
//     }
//   };

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       void getAllSiteResistance();
//     }, 0);

//     const interval = setInterval(() => {
//       void getAllSiteResistance();
//     }, 20000);

//     return () => {
//       clearTimeout(timeout);
//       clearInterval(interval);
//     };
//   }, [page, limit, search]);

//   // ================= DOWNLOAD =================

//   const downloadCSV = () => {
//     if (!resistance.length) {
//       toast.error("No data to download");

//       return;
//     }

//     const headers = [
//       "siteUid",
//       "siteName",
//       "nodeUid",
//       "deviceName",
//       "resistanceNumber",
//       "resistanceValue",
//     ];

//     const rows = resistance.map((item) =>
//       [
//         item.siteUid,

//         item.siteName,

//         item.nodeUid,

//         item.deviceName,

//         item.resistanceNumber,

//         item.resistanceValue,
//       ].join(","),
//     );

//     const csvContent = [headers.join(","), ...rows].join("\n");

//     const blob = new Blob([csvContent], {
//       type: "text/csv",
//     });

//     const url = window.URL.createObjectURL(blob);

//     const link = document.createElement("a");

//     link.href = url;

//     link.setAttribute("download", "resistance_report.csv");

//     document.body.appendChild(link);

//     link.click();

//     link.remove();

//     toast.success("Downloaded");
//   };

//   // ================= PAGINATION =================

//   const visiblePages = Array.from(
//     {
//       length: Math.min(5, totalPages),
//     },

//     (_, i) => i + Math.max(page - 2, 1),
//   ).filter((p) => p <= totalPages);

//   const start = (page - 1) * limit + 1;

//   const end = Math.min(page * limit, total);

//   return (
//     <div className="min-h-screen bg-slate-100 p-6">
//       {/* HEADER */}

//       <div
//         className="mb-5 flex items-center justify-between
//         rounded-xl bg-gradient-to-br
//         from-[#0a192f] to-[#0f3057] p-5"
//       >
//         <h2 className="text-xl font-semibold text-white">
//           RESISTANCE MONITORING
//         </h2>

//         <span className="font-medium text-white">{total} Sensors</span>
//       </div>

//       {/* SEARCH */}

//       <div className="mb-4 flex items-center justify-between">
//         <input
//           type="text"
//           placeholder="Search..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);

//             setPage(1);
//           }}
//           className="w-64 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         <button
//           onClick={downloadCSV}
//           className="flex items-center gap-2 rounded bg-[#0f3057]
//           px-4 py-2 text-white transition hover:bg-[#173b68]"
//         >
//           <HiOutlineDownload />
//           Download
//         </button>
//       </div>

//       {/* TABLE */}

//       <div
//         className="overflow-x-auto rounded-xl border
//         bg-white shadow"
//       >
//         <table className="w-full text-sm">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-3">#</th>

//               <th className="px-4 py-3">Site Name</th>

//               {auth?.user?.role !== "user" && (
//                 <th className="px-4 py-3">Site UID</th>
//               )}

//               <th className="px-4 py-3">Device UID</th>

//               <th className="px-4 py-3">Device Name</th>

//               <th className="px-4 py-3">Resistance UID</th>

//               <th className="px-4 py-3">Value</th>

//               <th className="px-4 py-3">Alert</th>
//             </tr>
//           </thead>

//           <tbody>
//             {resistance.map((row, index) => {
//               const value = row?.resistanceValue || 0;

//               const threshold = row?.resSensorsThreshold || 0;

//               return (
//                 <tr key={index} className="border-t">
//                   <td className="px-4 py-3 text-center">
//                     {(page - 1) * limit + index + 1}
//                   </td>

//                   <td className="px-4 py-3 text-center">{row?.siteName}</td>

//                   {auth?.user?.role !== "user" && (
//                     <td className="px-4 py-3 text-center">{row?.siteUid}</td>
//                   )}

//                   <td className="px-4 py-3 text-center">{row?.nodeUid}</td>

//                   <td className="px-4 py-3 text-center">{row?.deviceName}</td>

//                   <td className="px-4 py-3 text-center">
//                     {row?.resistanceNumber}
//                   </td>

//                   <td
//                     className={`px-4 py-3 text-center ${
//                       value > threshold ? "bg-red-200 text-red-700" : ""
//                     }`}
//                   >
//                     {value}
//                   </td>

//                   <td className="px-4 py-3">
//                     <div className="flex justify-center">
//                       {value > threshold ? (
//                         <FiBell
//                           className="animate-pulse text-red-500"
//                           size={18}
//                         />
//                       ) : (
//                         <FiCheckCircle className="text-green-500" size={18} />
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* NO DATA */}

//         {resistance.length === 0 && (
//           <div className="flex h-[50vh] flex-col items-center justify-center">
//             <img src={NodataFound} alt="nodata" className="w-40" />

//             <p>No Device Found</p>
//           </div>
//         )}

//         {/* PAGINATION */}

//         <div className="flex items-center justify-between border-t p-4">
//           <div>
//             Showing {start} -{end} of {total}
//           </div>

//           <div className="flex gap-1">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage(page - 1)}
//               className="rounded border px-3 py-1 disabled:opacity-40"
//             >
//               Prev
//             </button>

//             {visiblePages.map((p) => (
//               <button
//                 key={p}
//                 onClick={() => setPage(p)}
//                 className={`rounded border px-3 py-1 ${
//                   page === p ? "bg-blue-600 text-white" : ""
//                 }`}
//               >
//                 {p}
//               </button>
//             ))}

//             <button
//               disabled={page === totalPages}
//               onClick={() => setPage(page + 1)}
//               className="rounded border px-3 py-1 disabled:opacity-40"
//             >
//               Next
//             </button>
//           </div>

//           <select
//             value={limit}
//             onChange={(e) => {
//               setLimit(Number(e.target.value));

//               setPage(1);
//             }}
//             className="rounded border px-2 py-1"
//           >
//             <option value={5}>5</option>

//             <option value={10}>10</option>

//             <option value={20}>20</option>

//             <option value={50}>50</option>

//             <option value={100}>100</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Resistance;
