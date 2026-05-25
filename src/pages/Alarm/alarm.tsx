// import { useState, useEffect, useMemo, useCallback } from "react";

// import dayjs from "dayjs";

// import { AiOutlineSearch } from "react-icons/ai";

// import { IoClose } from "react-icons/io5";

// import DeleteDialog from "./DeleteAlarm";

// import NodataFound from "../../../assets/img/nodatafound.png";

// import { API } from "../../../lib/endpoints";

// import {GET} from "../../../lib/request";

// interface AlarmType {
//   _id: string;

//   SensorName?: string;

//   alarmValue?: number;

//   thresholdValue?: number;

//   createdAt?: string;

//   deviceId?: {
//     nodeUid?: string;

//     deviceName?: string;

//     siteId?: {
//       uid?: string;

//       siteName?: string;
//     };
//   };
// }

// const Alarm = () => {
//   const [alarm, setAlarm] = useState<AlarmType[]>([]);

//   const [total, setTotal] = useState<number>(0);

//   const [searchTerm, setSearchTerm] = useState<string>("");

//   // ================= FETCH =================

//   const getAllAlarm = useCallback(async () => {
//     try {
//       const response = await GET(API.ALARM.DATA, {
//         search: searchTerm || null,

//         startDate: dayjs("2023-01-01").format("YYYY-MM-DD"),

//         endDate: dayjs("2030-01-01").format("YYYY-MM-DD"),

//         page: 1,

//         limit: 1000,

//         sortBy: "createdAt",

//         sortType: -1,
//       });

//       setAlarm(response?.data?.data || []);

//       setTotal(response?.data?.lengthData || 0);
//     } catch (error) {
//       console.error(error);
//     }
//   }, [searchTerm]);

//   useEffect(() => {
//     getAllAlarm();
//   }, [getAllAlarm]);

//   useEffect(() => {
//     const interval = setInterval(getAllAlarm, 10000);

//     return () => clearInterval(interval);
//   }, [getAllAlarm]);

//   // ================= FILTER =================

//   const filteredData = useMemo(() => {
//     return alarm;
//   }, [alarm]);

//   return (
//     <div className="min-h-screen w-full bg-slate-100 p-4 md:p-6">
//       {/* HEADER */}

//       <div
//         className="mb-6 flex items-center justify-between rounded-xl
//         bg-gradient-to-br from-[#0a192f] to-[#0f3057]
//         p-5 shadow-lg"
//       >
//         <h2 className="text-xl font-semibold text-white">ALARM MONITORING</h2>

//         <span className="font-medium text-white">{total} Alarms</span>
//       </div>

//       {/* PANEL */}

//       <div className="rounded-xl border border-gray-200 bg-white shadow">
//         {/* SEARCH */}

//         <div className="flex items-center justify-between p-4">
//           <h3 className="text-lg font-semibold text-[#0f3057]">
//             Active Alarm List
//           </h3>

//           <div className="relative w-72">
//             <AiOutlineSearch
//               className="absolute left-3 top-2.5 text-gray-500"
//               size={18}
//             />

//             <input
//               type="text"
//               placeholder="Search UID / Name"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full rounded-lg border py-2 pl-9 pr-8 outline-none focus:ring-2 focus:ring-blue-500"
//             />

//             {searchTerm && (
//               <IoClose
//                 size={18}
//                 className="absolute right-2 top-2.5 cursor-pointer"
//                 onClick={() => setSearchTerm("")}
//               />
//             )}
//           </div>
//         </div>

//         {/* TABLE */}

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-gray-600">
//               <tr>
//                 <th className="px-4 py-3 text-left">#</th>

//                 <th className="px-4 py-3 text-left">Site UID</th>

//                 <th className="px-4 py-3 text-left">Site Name</th>

//                 <th className="px-4 py-3 text-left">Device UID</th>

//                 <th className="px-4 py-3 text-left">Device Name</th>

//                 <th className="px-4 py-3 text-left">Sensor</th>

//                 <th className="px-4 py-3 text-left">Threshold</th>

//                 <th className="px-4 py-3 text-left">Alarm Value</th>

//                 <th className="px-4 py-3 text-left">Time</th>

//                 <th className="px-4 py-3 text-left">Date</th>

//                 <th className="px-4 py-3 text-left">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredData.map((row, index) => {
//                 const value = Number(row?.alarmValue) || 0;

//                 const threshold = Number(row?.thresholdValue) || 0;

//                 return (
//                   <tr key={row._id} className="border-t hover:bg-gray-50">
//                     <td className="px-4 py-3">{index + 1}</td>

//                     <td className="px-4 py-3">
//                       {row?.deviceId?.siteId?.uid || "-"}
//                     </td>

//                     <td className="px-4 py-3">
//                       {row?.deviceId?.siteId?.siteName || "-"}
//                     </td>

//                     <td className="px-4 py-3">{row?.deviceId?.nodeUid}</td>

//                     <td className="px-4 py-3">{row?.deviceId?.deviceName}</td>

//                     <td className="px-4 py-3">{row.SensorName}</td>

//                     <td className="px-4 py-3">{threshold}</td>

//                     <td
//                       className={`px-4 py-3 ${
//                         value > threshold
//                           ? "bg-red-200 font-semibold text-red-700"
//                           : ""
//                       }`}
//                     >
//                       {value}
//                     </td>

//                     <td className="px-4 py-3">
//                       {dayjs(row.createdAt).format("h:mm A")}
//                     </td>

//                     <td className="px-4 py-3">
//                       {dayjs(row.createdAt).format("DD-MM-YYYY")}
//                     </td>

//                     <td className="px-4 py-3">
//                       <DeleteDialog
//                         alarmID={row._id}
//                         getnumberOfAlarm={getAllAlarm}
//                       />
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* NO DATA */}

//         {filteredData.length === 0 && (
//           <div className="flex h-[60vh] flex-col items-center justify-center">
//             <img src={NodataFound} alt="nodata" className="w-40 opacity-80" />

//             <p className="mt-4 font-medium text-blue-500">No Alarm Found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Alarm;
