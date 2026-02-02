import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Grid, Breadcrumbs, Typography, Container } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function UserManagment() {
  const { state } = useLocation();

  return (
    <>
      <Grid container justifyContent="space-between" className="mt-16">
        <Grid item md={3}>
          <Typography className="heading-black mt-12">Full Name</Typography>
          <Typography className=" input-style-typo mt-12 ">
            {state?.fullName}
          </Typography>{" "}
        </Grid>{" "}
        <Grid item md={3}>
          <Typography className="heading-black mt-12">UID</Typography>
          <Typography className=" input-style-typo  mt-12">
            {state?.uid}
          </Typography>{" "}
        </Grid>{" "}
        <Grid item md={3}>
          <Typography className="heading-black mt-12">Password</Typography>
          <Typography className=" input-style-typo mt-12 ">********</Typography>
        </Grid>
      </Grid>
    </>
  );
}
