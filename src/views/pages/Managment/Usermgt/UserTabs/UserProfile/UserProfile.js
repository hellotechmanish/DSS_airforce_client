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
import PersonalTab from "./PersonalTab/PersonalTab";
import AssignedTab from "./AssignedTab/AssiginedTab";
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
  // console.log("Chck USer Id ROe", state);
  const [value, setValue] = React.useState(0);
  const TabChange = (event, newValue) => {
    setValue(newValue);
  };
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
            <Link
              to="/user-management"
              className="linkcolor"
              underline="hover"
              key="1"
            >
              <Typography className="heading-black   ">
                User Management
              </Typography>
            </Link>
            <Link
              to="/user-management"
              state={1}
              className="linkcolor"
              underline="hover"
            >
              <Typography className="heading-black cursor">User</Typography>{" "}
            </Link>
            <Typography className="heading-black  ">
              {state?.fullName}
            </Typography>
          </Breadcrumbs>
          <Grid container className="mt-16">
            <Box className="width100 ">
              <Tabs
                value={value}
                onChange={TabChange}
                className="Tabs-dashboard2"
              >
                <Tab
                  className="Tab-dashboardlabel3  mr-20 fs-16  hover"
                  label={
                    <Typography className="sitesname ">
                      Personal Information
                    </Typography>
                  }
                />
                <Tab
                  className="Tab-dashboardlabel3  fs-16 hover"
                  label={
                    <Typography className="sitesname ">Assigned</Typography>
                  }
                />
              </Tabs>
              <TabPanel value={value} index={0}>
                <PersonalTab state={state} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <AssignedTab state={state} />
              </TabPanel>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
