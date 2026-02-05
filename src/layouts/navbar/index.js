import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Container } from "@mui/system";

import {
  Box,
  Grid,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  ListItem,
  IconButton,
  Typography,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  SwipeableDrawer,
} from "@mui/material";
import Sound from "react-sound";
// Logo Images
import NavbarBgs from "../../assets/img/Navbar-bgs.png";
import LeftLogo from "../../assets/img/Left-logo.png";
import RightLogo from "../../assets/img/Right-logo.png";
import alertSound from "../../assets/sounds/alertsound.mp3";
import { FiMenu } from "react-icons/fi";
import { VscUnmute, VscMute } from "react-icons/vsc";

// Internal Import
import { FETCH_URL } from "../../fetchIp";
import RebootDialog from "./RebootDialog";
import LogoutDialog from "./LogoutDialog";
import routes from "../../routes/AdminRoutes";
import ShutDonwDialog from "./ShutDonwDialog";
import axiosInstance from "../../api/axiosInstance";
import { AuthContext } from "../../context/AuthContext";
import { GET } from "../../lib/request";
import { API } from "../../lib/endpoint";
//code for change title start here

const StyledToolbar = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${NavbarBgs})`,
  backgroundSize: "cover",
  // Override media queries injected by theme.mixins.toolbar
  "@media all": {
    minHeight: 260,
  },
}));

export default function ProminentAppBar() {
  // ============= userRole ============== //
  const auth = React.useContext(AuthContext);
  const { token, setToken, user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    const hasDialogBeenOpened = localStorage.getItem("welcomeDialogOpened");
    if (token && !hasDialogBeenOpened) {
      setOpen(true);

      localStorage.setItem("welcomeDialogOpened", "true");
    }
  }, [token]);

  const [reboot, setReboot] = useState(null);

  const getRebootStatus = async () => {
    try {
      const resp = await GET(API.DEVICE.REBOOT_STATUS);

      console.log("Reboot Status =>", resp);

      setReboot(resp?.msg || resp);
    } catch (error) {
      console.error("Error fetching reboot status:", error);
    }
  };

  const [shutdown, setShutDown] = useState(null);
  const getShutdownStatus = async () => {
    const response = await fetch(`${FETCH_URL}/api/device/shutdown`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    let res = await response.json();
    if (response.ok) {
      // // console.log(" getShutdownStatus resp ===> ", res.msg);
      setShutDown(res.msg);
    } else {
      // // console.log("Error in getShutdownStatus ==> ", res);
    }
  };
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userData");
    localStorage.removeItem("welcomeDialogOpened");
    localStorage.clear();
    window.location.reload();
  };
  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 270,
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <ListItemButton
        sx={{
          padding: "0px",
          borderTop: "2px solid #ddd",
          borderBottom: "2px solid #ddd",
        }}
      >
        <ListItemIcon className="sidebar-icon  text-capitalize pl-6 ">
          <Avatar sx={{ bgcolor: " #fff" }}>
            <span className="blue-typo ">{user?.fullName?.slice("a")[0]} </span>
          </Avatar>
        </ListItemIcon>

        <ListItemText className="sidebar-text pl-6 ">
          <Typography className="fs-14  heading-white   text-capitalize ">
            {user?.fullName}
          </Typography>
          <Typography className="fs-14  heading-white   text-capitalize ">
            #{user?.uid}
          </Typography>
        </ListItemText>
      </ListItemButton>
      <List>
        {routes?.map((route, index) => {
          if (route.invisible === false) {
            return (
              <React.Fragment key={route.link || index}>
                {auth.user.role === 2 && route.name !== "User Management" ? (
                  <ListItem disablePadding component={Link} to={route.link}>
                    <ListItemButton>
                      <ListItemIcon className="sidebar-icon">
                        <img alt="icon" src={route.icon} />
                      </ListItemIcon>
                      <ListItemText className="sidebar-text">
                        {route.name}
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                ) : null}

                {auth.user.role === 0 || auth.user.role === 1 ? (
                  <ListItem disablePadding component={Link} to={route.link}>
                    <ListItemButton className="p-7">
                      <ListItemIcon className="sidebar-icon">
                        <img alt="icon" src={route.icon} />
                      </ListItemIcon>
                      <ListItemText className="sidebar-text">
                        {route.name}
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                ) : null}
              </React.Fragment>
            );
          }
        })}{" "}
      </List>
    </Box>
  );

  const [alarmStatus, setAlarmStatus] = useState(null);

  const [notificationCount, setNotificationCount] = useState(null);
  const getGlobalAlarmStatus = async () => {
    try {
      const response = await axiosInstance.get("/api/alarm/getAlarmStatus");
      if (response && response.data) {
        setAlarmStatus(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching global alarm status:", error);
    }
  };
  const updateAlarmStatus = async (status) => {
    try {
      await axiosInstance.post("/api/alarm/updateStatus", { status });
    } catch (error) {
      console.error("Error updating alarm status:", error);
      throw error;
    }
  };

  const toggleAlarmStatus = async (status) => {
    try {
      await updateAlarmStatus(status);
      getGlobalAlarmStatus();
    } catch (error) {
      console.error("Error toggling alarm status:", error);
    }
  };

  const getNotificationCount = async () => {
    try {
      const resp = await GET(API.ALARM.GET_NOTIFICATION_COUNT);

      console.log("Notification Count =>", resp);

      setNotificationCount(resp?.count || 0);
    } catch (error) {
      console.error("Error fetching notification count:", error);
      setNotificationCount(0);
    }
  };

  useEffect(() => {
    getGlobalAlarmStatus();
    getNotificationCount();
    const intervalId = setInterval(() => {
      getGlobalAlarmStatus();
      getNotificationCount();
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  //code for change title
  const loadSavedData = () => {
    const savedData = localStorage.getItem("inputValues");
    return savedData
      ? JSON.parse(savedData)
      : { word1: "Indian Airforce", word2: "", word3: "" };
  };
  const [showPopup, setShowPopup] = useState(false);
  const [inputValues, setInputValues] = useState(loadSavedData());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newInputValues = { ...inputValues, [name]: value };
    setInputValues(newInputValues);

    localStorage.setItem("inputValues", JSON.stringify(newInputValues));
  };
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  return (
    <>
      <StyledToolbar>
        <Container maxWidth="xl">
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="widthLR-90 "
            style={{ paddingTop: "42px" }}
          >
            <Grid item>
              <img src={LeftLogo} alt="LeftLogo" className="nav-leftlogo" />
            </Grid>
            <Grid item>
              <Typography align="center" className="white-typo mt-20 fs-50">
                {inputValues.word1}
              </Typography>
              <Typography align="center" className="blue-typo  fs-30">
                Online Resistance Monitoring System
              </Typography>
            </Grid>
            <Grid item className="nav-rightlogo">
              <img src={LeftLogo} alt="RightLogo" className="nav-leftlogo" />
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            className="widthLR-90"
            style={{ marginTop: "51px", width: "100%" }}
          >
            {["right"].map((anchor) => (
              <React.Fragment key={anchor}>
                <Grid item>
                  {alarmStatus?.status ? (
                    <>
                      {alarmStatus?.sound && (
                        <Sound
                          url={alertSound}
                          playStatus={Sound.status.PLAYING}
                          playFromPosition={300}
                          loop={true}
                        />
                      )}
                      <Tooltip title="Mute" arrow>
                        <IconButton
                          onClick={() => {
                            toggleAlarmStatus(false);
                          }}
                        >
                          <VscUnmute color="red" />
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip title="Unmute" arrow>
                        <IconButton
                          onClick={() => {
                            toggleAlarmStatus(true);
                          }}
                        >
                          <VscMute />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Grid>
                <Button onClick={handleOpenPopup}>Change Title </Button>
                {/* Sidebar */}
                <Button onClick={toggleDrawer(anchor, true)}>
                  <FiMenu className="hamburger-menu" />
                </Button>

                <SwipeableDrawer
                  sx={{
                    flexShrink: 0,
                    // zIndex: 9999,
                    "& .MuiDrawer-paper": {
                      boxSizing: "border-box",
                      background: " #044a70",
                    },
                  }}
                  anchor={anchor}
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                  onOpen={toggleDrawer(anchor, true)}
                >
                  {list(anchor)}
                  {auth.user.role === 0 || auth.user.role === 1 ? (
                    <>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <RebootDialog getRebootStatus={getRebootStatus} />
                        </ListItemButton>
                      </ListItem>

                      <ListItem disablePadding>
                        <ListItemButton>
                          <ShutDonwDialog
                            getShutdownStatus={getShutdownStatus}
                          />
                        </ListItemButton>
                      </ListItem>
                    </>
                  ) : null}
                  <ListItem
                    style={{
                      position: "absolute",
                      bottom: "0",
                      cursor: "pointer",
                      marginTop: "20px",
                    }}
                  >
                    <LogoutDialog logout={logout} />
                  </ListItem>
                </SwipeableDrawer>
              </React.Fragment>
            ))}
          </Grid>
        </Container>
      </StyledToolbar>
      {/*showpop up code for change title */}
      {showPopup && (
        <div style={popupStyles}>
          <h5>Change Title</h5>
          <div>
            <input
              type="text"
              name="word1"
              value={inputValues.word1}
              onChange={handleInputChange}
              placeholder="Enter word 1"
            />
          </div>
          <Button onClick={handleClosePopup}>Submit</Button>
        </div>
      )}

      {/* Display entered values */}
      {/* <div>
      <h3>Entered Words:</h3>
      <p>Word 1: {inputValues.word1}</p>
      <p>Word 2: {inputValues.word2}</p>
      <p>Word 3: {inputValues.word3}</p>
     </div>
     */}
      {/*code end for the change title */}
    </>
  );
}
const popupStyles = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "20px",
  backgroundColor: "white",
  border: "1px solid #ccc",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};
