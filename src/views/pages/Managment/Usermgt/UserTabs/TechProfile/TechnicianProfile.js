import React, { useState, useEffect } from "react";
import { Grid, Breadcrumbs, Typography, Container, Input } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function UserManagment() {
  const { state } = useLocation();

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
              <Typography className="heading-black  ">
                User Management
              </Typography>{" "}
            </Link>
            ,
            <Typography className="heading-black  ">
              {state?.fullName}
            </Typography>
          </Breadcrumbs>
          <Grid container>
            <Typography className="sky-typo fs-20 mt-24">
              Personal Information
            </Typography>
            <Grid container justifyContent="space-between">
              <Grid item md={3}>
                <Typography className="heading-black mt-12">
                  Full Name
                </Typography>
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
                <Typography className="heading-black mt-12">
                  Password
                </Typography>
                <Typography className=" input-style-typo mt-12 ">
                  ********
                </Typography>{" "}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
