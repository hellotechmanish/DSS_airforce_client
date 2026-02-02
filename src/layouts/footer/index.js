import React from "react";
import { Container, Grid } from "@mui/material";
import CompanyLogo from "../../assets/img/company-logo.png";
import dssLogo from "../../assets/img/dss-logo.png";
export default function Footer() {
  return (
    <>
      <Grid
        container
        className="footer-box"
        sx={{ boxShadow: " 0px -1px 10px #dddddd", marginTop: "40px" }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className=" widthLR-90"
          >
            <Grid item>
              <img src={dssLogo} style={{ height: "66px", width: "179px" }} />
            </Grid>
            <Grid item>
              <img
                src={CompanyLogo}
                style={{ height: "118px", width: "188px" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </>
  );
}
