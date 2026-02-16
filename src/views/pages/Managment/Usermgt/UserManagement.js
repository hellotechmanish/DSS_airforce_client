import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Breadcrumbs,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import CraeteTechnician from "./AddTechnician/AddTechnician";
import CreateUser from "./AddUser/UserAdd";
import TechnicianTab from "../Usermgt/UserTabs/TechnicianTab";
import UserTab from "../Usermgt/UserTabs/UsersTab";
import { AuthContext } from "../../../../context/AuthContext";
import { API } from "../../../../lib/endpoint";
import { GET } from "../../../../lib/request";

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
  // const { state } = useLocation();
  const auth = React.useContext(AuthContext);
  const [value, setValue] = React.useState(auth.user.role);

  const TabChange = (event, newValue) => {
    setValue(newValue);
  };
  // console.log("Check Value", value + 2);
  const [technician, setTechnician] = useState(null);
  useEffect(() => {
    getnumberOftechnician();
  }, []);

  const getnumberOftechnician = async () => {
    try {
      const res = await GET(API.USERS.LIST_BY_ROLE(value + 1));
      setTechnician(res.msg);
    } catch (err) {
      console.log("Error fetching technician list", err);
    }
  };

  const [user, setUser] = useState(null);

  const getnumberOfUser = async () => {
    try {
      const res = await GET(API.USERS.LIST_BY_ROLE(value + 1));
      setUser(res.msg);
    } catch (err) {
      console.log("Error fetching user list", err);
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
