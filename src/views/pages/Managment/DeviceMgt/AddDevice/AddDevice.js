// import React, { useCallback, useEffect, useState } from "react";
// import {
//   Grid,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Button,
//   IconButton,
//   Typography,
//   Snackbar,
//   Input,
//   TextField,
// } from "@mui/material";
// import MuiAlert from "@mui/material/Alert";

// import PropTypes from "prop-types";
// import { useForm } from "react-hook-form";
// import { ErrorMessage } from "@hookform/error-message";
// import { styled } from "@mui/material/styles";
// import CloseIcon from "@mui/icons-material/Close";
// //React Icons
// import { POST } from "../../../../../lib/request";
// import { API } from "../../../../../lib/endpoint";

// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialogContent-root": {
//     padding: theme.spacing(2),
//   },
//   "& .MuiDialogActions-root": {
//     padding: theme.spacing(),
//   },
// }));

// const BootstrapDialogTitle = (props) => {
//   const { children, onClose, ...other } = props;

//   return (
//     <DialogTitle className="dialog-title-add" sx={{ m: 0, p: 1.2 }} {...other}>
//       {children}
//       <Typography className="white-typo">Add Device</Typography>{" "}
//       {onClose ? (
//         <IconButton
//           aria-label="close"
//           onClick={onClose}
//           className="dialogcrossicon-white"
//         >
//           <CloseIcon />
//         </IconButton>
//       ) : null}
//     </DialogTitle>
//   );
// };

// BootstrapDialogTitle.propTypes = {
//   children: PropTypes.node,
//   onClose: PropTypes.func.isRequired,
// };
// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });
// export default function MaxWidthDialog({
//   getnumberOfSite,
//   state,
//   getdeviceListbysite,
// }) {
//   const [open, setOpen] = React.useState(false);
//   const [fullWidth] = React.useState(true);
//   const [maxWidth] = React.useState("lg");
//   const handleClickOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };
//   const {
//     register,
//     formState: { errors },
//     handleSubmit,
//   } = useForm();
//   const [deviceName, setDeviceName] = useState("");
//   const [nodeUid, setNodeUid] = useState(null);
//   const [vmrSensors, setVmrSensors] = useState(null);
//   const [resSensors, setResSensors] = useState(null);
//   const [spdSensors, setSpdSensors] = useState(null);
//   const [nerSensors, setNerSensors] = useState(null);
//   const [resSensorsThreshold, setResSensorsThreshold] = useState(null);
//   const [spdSensorsThreshold, setSpdSensorsThreshold] = useState(null);
//   const [nerSensorsThreshold, setNerSensorsThreshold] = useState(null);

//   //Phase Sensir Thershold

//   const [vmrSensorsThreshold, setVmrSensorsThreshold] = useState({
//     r: +"",
//     y: +"",
//     b: +"",
//     ry: +"",
//     yb: +"",
//     rb: +"",
//   });

//   const handleChangesetR = (event) => {
//     setVmrSensorsThreshold((data) => ({
//       ...data,
//       [event.target.name]: event.target.value,
//     }));
//   };

//   const clearData = () => {
//     setDeviceName("");
//     setNodeUid("");
//     setVmrSensors("");
//     setResSensors("");
//     setSpdSensors("");
//     setNerSensors("");
//     setResSensorsThreshold("");
//     setSpdSensorsThreshold("");
//     setNerSensorsThreshold("");
//   };
//   // SnackBar
//   const [snackopen, setSnackOpen] = useState(false);
//   const [snackmsg, setSnackMsg] = useState("");
//   const [snackErrMsg, setSnackErrMsg] = useState();
//   const [snackerropen, setSnackerropen] = useState(false);

//   const SnanbarClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setSnackOpen(false);
//     setSnackMsg("");
//   };

//   const SnackbarErrorClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setSnackerropen(false);
//     setSnackErrMsg("");
//   };

//   const CreateDevice = async () => {
//     if (!state?._id) {
//       console.warn("Site ID missing");
//       return;
//     }

//     if (!uidMatch) {
//       setSnackErrMsg("Node UID already exists");
//       setSnackerropen(true);
//       return;
//     }

//     try {
//       const resp = await POST(API.DEVICE.CREATE, {
//         siteId: state._id,
//         deviceName,
//         nodeUid,
//         vmrSensors: +vmrSensors,
//         resSensors: +resSensors,
//         spdSensors: +spdSensors,
//         nerSensors: +nerSensors,
//         vmrSensorsThreshold: +vmrSensorsThreshold,
//         resSensorsThreshold: +resSensorsThreshold,
//         spdSensorsThreshold: +spdSensorsThreshold,
//         nerSensorsThreshold: +nerSensorsThreshold,
//       });

//       console.log("Create Device Resp =>", resp);

//       clearData();
//       setSnackOpen(true);
//       setSnackMsg(resp?.msg || "Device Created Successfully");
//       setOpen(false);

//       getdeviceListbysite();
//       getnumberOfSite();
//     } catch (error) {
//       console.error("Create Device Error =>", error);

//       setSnackerropen(true);
//       setSnackErrMsg(error?.msg || "Something went wrong");
//     }
//   };

//   const [uidMatch, setUidMatch] = useState(true);

//   const CheckDeviceUid = useCallback(async () => {
//     if (!nodeUid) return; //  null guard

//     try {
//       const resp = await POST(API.DEVICE.CHECK_UID, {
//         uid: nodeUid,
//       });

//       console.log("Check UID Resp =>", resp);

//       setUidMatch(resp?.status);
//     } catch (error) {
//       console.error("Check UID Error =>", error);
//     }
//   }, [nodeUid]);

//   useEffect(() => {
//     if (open && nodeUid) {
//       CheckDeviceUid();
//     }
//   }, [nodeUid, open, CheckDeviceUid]);

//   return (
//     <React.Fragment>
//       <Snackbar open={snackopen} autoHideDuration={3000} onClose={SnanbarClose}>
//         <Alert onClose={SnanbarClose} severity={"success"}>
//           {snackmsg}
//         </Alert>
//       </Snackbar>
//       <Snackbar
//         open={snackerropen}
//         autoHideDuration={8000}
//         onClose={SnackbarErrorClose}
//       >
//         <Alert onClose={SnackbarErrorClose} severity={"error"}>
//           {snackErrMsg}
//         </Alert>
//       </Snackbar>
//       <Button
//         variant="outlined"
//         sx={{
//           // width: "150px",
//           color: "#1e4976",
//           borderColor: "#1e4976",
//           borderRadius: "6px",
//           fontSize: "16px",
//           fontWeight: 500,
//           textTransform: "none",

//           "&:hover": {
//             // backgroundColor: "#1e4976",
//             // color: "#fff",
//             borderColor: "#1e4976",
//           },
//         }}
//         onClick={handleClickOpen}
//       >
//         Add Device
//       </Button>
//       <BootstrapDialog
//         fullWidth={fullWidth}
//         maxWidth={maxWidth}
//         open={open}
//         // onClose={(_, reason) => {
//         //   if (reason !== "backdropClick") {
//         //     handleClose();
//         //   }
//         // }}
//         onClose={handleClose}
//         PaperProps={{
//           className: "SmallDialog",
//         }}
//       >
//         <BootstrapDialogTitle
//           id="customized-dialog-title"
//           onClose={handleClose}
//         ></BootstrapDialogTitle>
//         <div>
//           <form onSubmit={handleSubmit(CreateDevice)}>
//             <DialogContent>
//               <Grid container justifyContent="space-between">
//                 <Grid item md={5.8}>
//                   <Typography className="heading-black mt-16">
//                     Site Name
//                   </Typography>
//                   <Input
//                     className=" input-style-1c mt-12 width100"
//                     disableUnderline
//                     value={state?.siteName}
//                     disabled
//                   />
//                 </Grid>
//                 <Grid item md={5.8}>
//                   <Typography className="heading-black mt-16">
//                     Site UID
//                   </Typography>
//                   <Input
//                     className="input-style-1c mt-12 width100"
//                     disableUnderline
//                     value={state?.site_uid}
//                     disabled
//                   />
//                 </Grid>
//                 <Grid item md={5.8}>
//                   <Typography className="heading-black mt-12">
//                     Device Name
//                   </Typography>
//                   <Input
//                     className=" input-style-1c mt-12 width100"
//                     disableUnderline
//                     value={deviceName}
//                     {...register("Device-Name-ErrorInput", {
//                       required: "Device Name is required.",
//                       onChange: (e) => {
//                         setDeviceName(e.target.value);
//                       },
//                     })}
//                   />
//                   <ErrorMessage
//                     errors={errors}
//                     name="Device-Name-ErrorInput"
//                     render={({ message }) => (
//                       <Typography className="red-typo">{message}</Typography>
//                     )}
//                   />
//                 </Grid>
//                 <Grid item md={5.8}>
//                   <Typography className="heading-black mt-12">
//                     Node UID
//                   </Typography>
//                   <Input
//                     className="input-style-1c mt-12 width100"
//                     disableUnderline
//                     value={nodeUid}
//                     {...register("Node-Uid-ErrorInput", {
//                       required: "Node UID is required.",
//                       onChange: (e) => {
//                         setNodeUid(e.target.value);
//                       },
//                     })}
//                   />
//                   {uidMatch === false ? (
//                     <Typography className="red-typo">
//                       Node UID Already Exist !
//                     </Typography>
//                   ) : null}
//                   <ErrorMessage
//                     errors={errors}
//                     name="Node-Uid-ErrorInput"
//                     render={({ message }) => (
//                       <Typography className="red-typo">{message}</Typography>
//                     )}
//                   />
//                 </Grid>
//                 <Grid item md={5.8}>
//                   <Typography className="heading-black mt-12">
//                     Phase Sensors
//                   </Typography>
//                   <Input
//                     className="input-style-1c mt-12 width100"
//                     disableUnderline
//                     value={vmrSensors}
//                     {...register("Phase-Sensors-ErrorInput", {
//                       required: "Phase Sensors is required.",
//                       onChange: (e) => {
//                         setVmrSensors(e.target.value);
//                       },
//                     })}
//                   />
//                   <ErrorMessage
//                     errors={errors}
//                     name="Phase-Sensors-ErrorInput"
//                     render={({ message }) => (
//                       <Typography className="red-typo">{message}</Typography>
//                     )}
//                   />
//                 </Grid>
//                 <Grid item md={5.8}>
//                   <Typography className="heading-black mt-12">
//                     Phase Sensor Threshold{" "}
//                   </Typography>
//                   <Grid container justifyContent="space-between">
//                     <Grid item md={1.8}>
//                       <TextField
//                         className=" mt-4 width100 text-field-style"
//                         id="outlined-basic"
//                         label="R"
//                         name="r" // required={true}
//                         value={vmrSensorsThreshold.r}
//                         onChange={handleChangesetR}
//                       />
//                     </Grid>

//                     <Grid item md={1.8}>
//                       <TextField
//                         className=" mt-4 width100 text-field-style"
//                         id="outlined-basic"
//                         label="Y"
//                         name="y"
//                         value={vmrSensorsThreshold.y}
//                         onChange={handleChangesetR}
//                       />
//                     </Grid>
//                     <Grid item md={1.8}>
//                       <TextField
//                         className=" mt-4 width100 text-field-style"
//                         id="outlined-basic"
//                         label="B"
//                         name="b"
//                         onChange={handleChangesetR}
//                         value={vmrSensorsThreshold.b}
//                       />
//                     </Grid>
//                     <Grid item md={1.8}>
//                       <TextField
//                         className=" mt-4 width100 text-field-style"
//                         id="outlined-basic"
//                         label="RY"
//                         name="ry"
//                         onChange={handleChangesetR}
//                         value={vmrSensorsThreshold.ry}
//                       />
//                     </Grid>

//                     <Grid item md={1.8}>
//                       <TextField
//                         className=" mt-4 width100 text-field-style"
//                         id="outlined-basic"
//                         label="YB"
//                         name="yb"
//                         onChange={handleChangesetR}
//                         value={vmrSensorsThreshold.yb}
//                       />
//                     </Grid>
//                     <Grid item md={1.8}>
//                       <TextField
//                         className=" mt-4 width100 text-field-style"
//                         id="outlined-basic"
//                         label="RB"
//                         name="rb"
//                         onChange={handleChangesetR}
//                         value={vmrSensorsThreshold.rb}
//                       />
//                     </Grid>
//                   </Grid>
//                 </Grid>
//                 <Grid item md={5.8}>
//                   <Typography className="heading-black mt-12">
//                     SPD Sesnors
//                   </Typography>
//                   <Input
//                     className="input-style-1c mt-12 width100"
//                     disableUnderline
//                     value={spdSensors}
//                     {...register("Spd-Sesnors-ErrorInput", {
//                       required: "SPD Sesnors is required.",
//                       onChange: (e) => {
//                         setSpdSensors(e.target.value);
//                       },
//                     })}
//                   />
//                   <ErrorMessage
//                     errors={errors}
//                     name="Spd-Sesnors-ErrorInput"
//                     render={({ message }) => (
//                       <Typography className="red-typo">{message}</Typography>
//                     )}
//                   />
//                 </Grid>
//                 <Grid item md={5.8}>
//                   <Typography className="heading-black mt-12">
//                     SPD Sensor Threshold
//                   </Typography>
//                   <Input
//                     className="input-style-1c mt-12 width100"
//                     disableUnderline
//                     value={spdSensorsThreshold}
//                     {...register("Spd-Threshold-ErrorInput", {
//                       required: "SPD Sensor Threshold is required.",
//                       onChange: (e) => {
//                         setSpdSensorsThreshold(e.target.value);
//                       },
//                     })}
//                   />
//                   <ErrorMessage
//                     errors={errors}
//                     name="Spd-Threshold-ErrorInput"
//                     render={({ message }) => (
//                       <Typography className="red-typo">{message}</Typography>
//                     )}
//                   />
//                 </Grid>

//                 <Grid item md={5.8}>
//                   <Typography className="heading-black mt-12">
//                     RES Sensors
//                   </Typography>
//                   <Input
//                     className="input-style-1c mt-12 width100"
//                     disableUnderline
//                     value={resSensors}
//                     {...register("Res-Sensors-ErrorInput", {
//                       required: " RES Sensors  is required.",
//                       onChange: (e) => {
//                         setResSensors(e.target.value);
//                       },
//                     })}
//                   />
//                   <ErrorMessage
//                     errors={errors}
//                     name="Res-Sensors-ErrorInput"
//                     render={({ message }) => (
//                       <Typography className="red-typo">{message}</Typography>
//                     )}
//                   />
//                 </Grid>
//                 <Grid item md={5.8}>
//                   <Typography className="heading-black mt-12">
//                     RES Sensor Threshold
//                   </Typography>
//                   <Input
//                     className="input-style-1c mt-12 width100"
//                     disableUnderline
//                     value={resSensorsThreshold}
//                     {...register("Res-Threshold-ErrorInput", {
//                       required: "   RES Sensor Threshold  is required.",
//                       onChange: (e) => {
//                         setResSensorsThreshold(e.target.value);
//                       },
//                     })}
//                   />
//                   <ErrorMessage
//                     errors={errors}
//                     name="Res-Threshold-ErrorInput"
//                     render={({ message }) => (
//                       <Typography className="red-typo">{message}</Typography>
//                     )}
//                   />
//                 </Grid>

//                 <Grid item md={5.8}>
//                   <Typography className="heading-black mt-12">
//                     GN Sensors
//                   </Typography>
//                   <Input
//                     className="input-style-1c mt-12 width100"
//                     disableUnderline
//                     value={nerSensors}
//                     {...register("GN-Sensors-ErrorInput", {
//                       required: "       GN Sensors  is required.",
//                       onChange: (e) => {
//                         setNerSensors(e.target.value);
//                       },
//                     })}
//                   />
//                   <ErrorMessage
//                     errors={errors}
//                     name="GN-Sensors-ErrorInput"
//                     render={({ message }) => (
//                       <Typography className="red-typo">{message}</Typography>
//                     )}
//                   />
//                 </Grid>
//                 <Grid item md={5.8}>
//                   <Typography className="heading-black mt-12">
//                     GN Sensor Threshold
//                   </Typography>
//                   <Input
//                     className="input-style-1c mt-12 width100"
//                     disableUnderline
//                     value={nerSensorsThreshold}
//                     {...register("GN-Threshold-ErrorInput", {
//                       required: " GN Sensors Threshold  is required.",
//                       onChange: (e) => {
//                         setNerSensorsThreshold(e.target.value);
//                       },
//                     })}
//                   />
//                   <ErrorMessage
//                     errors={errors}
//                     name="GN-Threshold-ErrorInput"
//                     render={({ message }) => (
//                       <Typography className="red-typo">{message}</Typography>
//                     )}
//                   />
//                 </Grid>
//               </Grid>
//             </DialogContent>
//             <DialogActions className="hgt-40" sx={{ marginBottom: "10px" }}>
//               <Button
//                 sx={{ marginRight: "10px" }}
//                 className="  grey-br-button width-100  hover"
//                 onClick={handleClose}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 sx={{ padding: "3px 0px" }}
//                 className="skyblue-br-button width-100 hover"
//                 type="submit"
//               >
//                 Submit
//               </Button>
//             </DialogActions>
//           </form>
//         </div>
//       </BootstrapDialog>
//     </React.Fragment>
//   );
// }
