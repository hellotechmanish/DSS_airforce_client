import React from "react";
import { Grid, Container, Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";

//core component that
import OverviewTab from "./AlarmTab's/overviewTab";

export default function Alarm() {
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
            <Typography className="heading-black ">Alarm</Typography>,
          </Breadcrumbs>{" "}
          <OverviewTab />
        </Grid>
      </Container>
    </>
  );
}
