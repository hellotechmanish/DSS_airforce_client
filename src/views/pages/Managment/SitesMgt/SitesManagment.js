import React, { useState, useEffect } from "react";
import {
  Typography,
  Breadcrumbs,
  Grid,
  Container,
  Button,
} from "@mui/material";
import dayjs from "dayjs";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Link } from "react-router-dom";
import AddSiteDialog from "./AddSite/SitesAddDialog";
import DeleteDialog from "./ActionButton/DeleteDialog";
import EditDialog from "./ActionButton/EditDialog";
import { FETCH_URL } from "../../../../fetchIp";
import NodataFound from "../../../../assets/img/nodatafound.png";
import { AuthContext } from "../../../../context/AuthContext";

export default function Sites() {
  const [sites, setSites] = useState(null);
  const [data, setData] = useState(null);

  const auth = React.useContext(AuthContext);

  const getnumberOfSite = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    const response = await fetch(`${FETCH_URL}/api/site/getnumberOfSite`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    let res = await response.json();
    if (response.ok) {
      // // console.log(" get site List resp ===> ", res.msg);
      setSites(res.msg);
    } else {
      // console.log("Error in get site List ==> ", res);
    }
  };
  useEffect(() => {
    getnumberOfSite();
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
            <Link
              to="/sites-mgt"
              className="linkcolor"
              underline="hover"
              key="2"
            >
              <Typography className="heading-black  ">
                Site Management
              </Typography>
            </Link>
          </Breadcrumbs>
          {auth.user.role === 2 || auth.user.role === 1 ? null : (
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography className="heading-black mt-12">
                Showing
                {sites?.length === 1 ? (
                  <span> {sites?.length} Site </span>
                ) : (
                  <span> {sites?.length} Sites </span>
                )}
              </Typography>
              <Grid item className="hgt-40">
                <AddSiteDialog getnumberOfSite={getnumberOfSite} />
              </Grid>
            </Grid>
          )}
          <Grid container className="mt-24">
            <TableContainer className="width100 table-container">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      UID
                    </TableCell>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      Site Name
                    </TableCell>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      Location
                    </TableCell>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      Devices
                    </TableCell>
                    <TableCell
                      align="center"
                      className="subheading-grey600 fs-16"
                    >
                      Added on
                    </TableCell>
                    {auth.user.role === 2 || auth.user.role === 1 ? null : (
                      <TableCell
                        align="center"
                        className="subheading-grey600 fs-16"
                      >
                        Action
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sites?.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell
                        align="center"
                        className="p-0"
                        component="th"
                        scope="row"
                      >
                        <Link
                          to="/sites-profile"
                          state={row}
                          className="linkcolor sky-typo fw-600  hover"
                        >
                          #{row.uid}
                        </Link>
                      </TableCell>
                      <TableCell align="center">
                        <Link
                          to="/sites-profile"
                          state={row}
                          className="linkcolor sky-typo fw-600 hover"
                        >
                          {row.siteName}{" "}
                        </Link>
                      </TableCell>
                      <TableCell align="center" className="heading-black">
                        {row.location}
                      </TableCell>
                      <TableCell align="center" className="heading-black">
                        {row.deviceCount}
                      </TableCell>
                      <TableCell align="center" className="heading-black">
                        {dayjs(row?.createdAt).format("DD-MM-YYYY")}
                      </TableCell>
                      {auth.user.role === 2 || auth.user.role === 1 ? null : (
                        <TableCell align="center">
                          <Grid
                            container
                            justifyContent="space-evenly"
                            direction="row"
                          >
                            <EditDialog
                              row={row}
                              sitesID={row._id}
                              getnumberOfSite={getnumberOfSite}
                            />
                            <DeleteDialog
                              sitesID={row._id}
                              getnumberOfSite={getnumberOfSite}
                            />
                          </Grid>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {sites?.length === 0 && (
              <Grid container>
                <Grid item className="mt-32 width100">
                  <Typography align="center">
                    <img src={NodataFound} />
                  </Typography>
                </Grid>
                <Typography
                  className="heading-black width100 mt-42"
                  align="center"
                >
                  No Site found!
                </Typography>
                <Typography
                  className="heading-black width100 mt-24"
                  align="center"
                >
                  Click below button to add site
                </Typography>{" "}
                <Typography align="center" className="hgt-40 width100 mt-12">
                  <AddSiteDialog getnumberOfSite={getnumberOfSite} />
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
