// // Import Server Component
// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { Tabs, Tab, Typography, Grid } from "@mui/material";
// import { Container } from "@mui/system";

// // AG Charts import
// import { AgCharts } from "ag-charts-react";
// import { AllCommunityModule, ModuleRegistry } from "ag-charts-community";

// // Import Custom Component
// import DeviceTab from "../pages/HomePageTab/Devicetab/Device";
// import NodataFound from "../../assets/img/nodatafound.png";
// import AddDevice from "../pages/HomePageTab/AddDevice/AddDevice";
// import AddSiteDialog from "../pages/Managment/SitesMgt/AddSite/SitesAddDialog";

// import { GET } from "../../lib/request";
// import { API } from "../../lib/endpoint";

// // register AG Charts modules
// ModuleRegistry.registerModules([AllCommunityModule]);

// // Tab Panel Component
// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div hidden={value !== index} {...other}>
//       {value === index && <>{children}</>}
//     </div>
//   );
// }

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `tab-${index}`,
//   };
// }

// // MAIN COMPONENT
// export default function TestHomepage() {
//   const [loading, setLoading] = useState(false);
//   const [value1, setValue1] = useState(0);
//   const [value, setValue] = useState(0);

//   const [sites, setSites] = useState([]);
//   const [sitesID, setSetID] = useState(null);
//   const [selectSiteData, setSelectSiteData] = useState(null);
//   const [sitezero, setSiteZero] = useState(null);

//   const [deviceID, setDevice] = useState([]);

//   // CHART STATE
//   const [chartOptions, setChartOptions] = useState({
//     title: {
//       text: "Device Line Chart",
//     },
//     data: [],
//     series: [
//       {
//         type: "line",
//         xKey: "time",
//         yKey: "value",
//         yName: "Device Value",
//       },
//     ],
//   });

//   // GET SITE COUNT
//   const getnumberOfSite = async () => {
//     try {
//       setLoading(true);

//       const resp = await GET(API.SITE.COUNT);

//       if (Array.isArray(resp?.msg) && resp.msg.length > 0) {
//         setSites(resp.msg);

//         setSetID(resp.msg[0]._id);

//         setSiteZero(resp.msg[0]);

//         setSelectSiteData(resp.msg[0]);
//       }
//     } catch (err) {
//       console.error("Site Count Error =>", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // GET DEVICE LIST
//   const getdeviceListbysite = async (siteID) => {
//     if (!siteID) return;

//     try {
//       setLoading(true);

//       const resp = await GET(API.DEVICE.LIST_BY_SITE(siteID));

//       console.log("Device List =>", resp);

//       if (Array.isArray(resp?.msg)) {
//         setDevice(resp.msg);
//       }
//     } catch (err) {
//       console.error("Device List Error =>", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // LOAD SITE FIRST TIME
//   useEffect(() => {
//     getnumberOfSite();
//   }, []);

//   // LOAD DEVICE WHEN SITE CHANGE
//   useEffect(() => {
//     if (sitesID) {
//       getdeviceListbysite(sitesID);
//     }
//   }, [sitesID]);

//   // UPDATE CHART WHEN DEVICE DATA CHANGE
//   useEffect(() => {
//     if (deviceID && deviceID.length > 0) {
//       const chartData = deviceID.map((item, index) => ({
//         time: item.createdAt || item.time || `Device ${index + 1}`,

//         value: item.value || item.temperature || item.count || index + 10,
//       }));

//       setChartOptions({
//         title: {
//           text: "Device Line Chart",
//         },
//         data: chartData,
//         series: [
//           {
//             type: "line",
//             xKey: "time",
//             yKey: "value",
//             yName: "Device Value",
//           },
//         ],
//       });
//     }
//   }, [deviceID]);

//   // TAB CHANGE
//   const TabChange = (event, newValue) => {
//     setValue(newValue);

//     const selectedSite = sites[newValue];

//     setSelectSiteData(selectedSite);

//     setSetID(selectedSite._id);
//   };

//   // RESET INNER TAB
//   useEffect(() => {
//     setValue1(0);
//   }, [value]);

//   return (
//     <>
//       {sites.length > 0 ? (
//         <Container maxWidth="xl">
//           {/* SITE TABS */}
//           <Grid container>
//             <Tabs value={value} onChange={TabChange} variant="scrollable">
//               {sites.map((data, index) => (
//                 <Tab
//                   key={data._id}
//                   {...a11yProps(index)}
//                   label={
//                     <Typography>
//                       {data.siteName} ({data.deviceCount})
//                     </Typography>
//                   }
//                 />
//               ))}
//             </Tabs>
//           </Grid>

//           {/* DEVICE + CHART */}
//           {deviceID.length > 0 ? (
//             <TabPanel value={value} index={value}>
//               {/* DEVICE LIST */}
//               <DeviceTab
//                 deviceID={deviceID}
//                 value1={value1}
//                 setValue1={setValue1}
//               />

//               {/* LINE CHART */}
//               <div
//                 style={{
//                   height: "400px",
//                   marginTop: "30px",
//                   background: "#fff",
//                   padding: "10px",
//                   borderRadius: "8px",
//                 }}
//               >
//                 <AgCharts options={chartOptions} />
//               </div>
//             </TabPanel>
//           ) : (
//             <Grid container justifyContent="center">
//               <Grid item>
//                 <img src={NodataFound} alt="nodata" />

//                 <Typography align="center">No Device found!</Typography>

//                 <AddDevice
//                   getnumberOfSite={getnumberOfSite}
//                   getdeviceListbysite={getdeviceListbysite}
//                   state={selectSiteData}
//                   sitezero={sitezero}
//                   value={value}
//                 />
//               </Grid>
//             </Grid>
//           )}
//         </Container>
//       ) : (
//         <Grid container justifyContent="center">
//           <Grid item>
//             <img src={NodataFound} alt="nodata" />

//             <Typography>No Site found!</Typography>

//             <AddSiteDialog getnumberOfSite={getnumberOfSite} />
//           </Grid>
//         </Grid>
//       )}
//     </>
//   );
// }
