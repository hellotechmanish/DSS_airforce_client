import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Breadcrumbs,
  Typography,
  Container,
  Tabs,
  Tab,
  Button,
  Box,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import CraeteTechnician from "./AddTechnician/AddTechnician";
import CreateUser from "./AddUser/UserAdd";
import TechnicianTab from "../Usermgt/UserTabs/TechnicianTab";
import UserTab from "../Usermgt/UserTabs/UsersTab";
import { FETCH_URL } from "../../../../fetchIp";
import { AuthContext } from "../../../../context/AuthContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Typography>{children}</Typography>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
export default function UserManagment() {
  const { state } = useLocation();
  const auth = React.useContext(AuthContext);
  const [value, setValue] = React.useState(auth.user.role);

  const TabChange = (event, newValue) => {
    setValue(newValue);
  };
  // console.log("Check Value", value + 2);
  const [technician, setTechnician] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    getnumberOftechnician();
  }, []);
  const getnumberOftechnician = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    const response = await fetch(
      `${FETCH_URL}/api/user/userList/${value + 1}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let res = await response.json();
    if (response.ok) {
      // console.log("  get number Of technician List resp ===> ", res.msg);
      setTechnician(res.msg);
    } else {
      // console.log("Error in get technician List ==> ", res);
    }
  };

  const [user, setUser] = useState(null);

  const getnumberOfUser = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    const response = await fetch(
      `${FETCH_URL}/api/user/userList/${value + 1}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let res = await response.json();
    if (response.ok) {
      // console.log(" get getnumber Of User List resp ===> ", res.msg);
      setUser(res.msg);
    } else {
      // console.log("Error in get get number OfUser List ==> ", res);
    }
  };
  useEffect(() => {
    getnumberOfUser();
  }, []);
  return (
    <>
      <Container maxWidth="xl">
        <Grid container direction="row" className="widthLR-90 mt-24">
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              to="/dashboard"
              className="linkcolor"
              underline="hover"
              key="1"
            >
              <Typography className="sky-typo fs-16">Dashboard</Typography>
            </Link>
            ,
            <Typography className="heading-black  ">User Management</Typography>
            ,
          </Breadcrumbs>{" "}
          <Grid container justifyContent="flex-end" alignItems="flex-end">
            <Grid item className="hgt-40">
              {value === 0 ? (
                <CraeteTechnician
                  getnumberOftechnician={getnumberOftechnician}
                />
              ) : (
                <CreateUser getnumberOfUser={getnumberOfUser} />
              )}
            </Grid>
          </Grid>
          <Grid container>
            <Box className="width100">
              {auth.user.role === 0 ? (
                <>
                  <Tabs
                    value={value}
                    onChange={TabChange}
                    className="Tabs-dashboard2"
                  >
                    <Tab
                      className="Tab-dashboardlabel2 fs-16 mr-20 hover"
                      label={
                        <Typography className="sitesname ">
                          Technician
                        </Typography>
                      }
                    />
                    <Tab
                      className="Tab-dashboardlabel2 fs-16  hover"
                      label={
                        <Typography className="sitesname ">Users</Typography>
                      }
                    />
                  </Tabs>
                  <TabPanel value={value} index={0}>
                    <TechnicianTab
                      value={value}
                      technician={technician}
                      getnumberOftechnician={getnumberOftechnician}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <UserTab
                      user={user}
                      value={value}
                      getnumberOfUser={getnumberOfUser}
                    />{" "}
                  </TabPanel>
                </>
              ) : (
                <TabPanel value={value} index={1}>
                  <UserTab
                    user={user}
                    value={value}
                    getnumberOfUser={getnumberOfUser}
                  />{" "}
                </TabPanel>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
